'use strict';

var commercials = (function() {
  var OFFER_IMGS_KEY = 'commercialOffer';
  var OFFER_UPDATED_IMGS_KEY = 'updated_commercialOffer';
  var CURRENT_VERSION_KEY = 'currentVersion';

  var ALARM_KEY = 'imgSyncAlarmId';

  var IMGS_DESCRIPTOR = 'slides.json';
  var DEFAULT_TIMEOUT = 20000;

  var target;
  var timeout;
  var configuration;

  function loadDescriptor(cb, errorCb) {
    var configSrc = target + IMGS_DESCRIPTOR + '?t=' + Date.now();

    window.console.log('Going to load JSON config: ', configSrc);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', configSrc, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
      if (xhr.status === 200 || xhr.status === 0) {
        cb(xhr.response);
      }
      else {
        cb(null);
      }
    };

    xhr.ontimeout = function() {
      cb(null);
    };

    xhr.onerror = errorCb;

    xhr.send();
  }

  function getRemoteImgs(descriptor, existingData, cb) {
    var commercialImgs = {};
    // Indicates whether any images were not downloaded
    var imgsNotRetrieved = false;

    window.console.log('JSON config loaded: ', descriptor);

    var retriever = new ImgRetriever(target, descriptor.data);

    retriever.onimageready = function(imgPath, blob) {
      if (blob) {
        commercialImgs[imgPath] = blob;
      }
      else {
        window.console.log('Blob is null for', imgPath);
        if (existingData && existingData[imgPath]) {
          commercialImgs[imgPath] = existingData[imgPath];
        }
        imgsNotRetrieved = true;
      }
    };

    retriever.onfinish = function() {
      cb(commercialImgs);
      // Current version of the commercial offer
      // It is only updated if none of the images were in error
      // Thus we guarantee that during next update cycle images will be
      // downloaded
      if (imgsNotRetrieved === false) {
        window.asyncStorage.setItem(CURRENT_VERSION_KEY, descriptor.version);
      }
    };

    retriever.start();
  }

  function refresh(cb, data) {
    if (navigator.onLine === true) {
      loadDescriptor(function(descriptor) {
        if (descriptor) {
          getRemoteImgs(descriptor, data, function(commercialImgs) {
            cb(commercialImgs);
            window.asyncStorage.setItem(OFFER_IMGS_KEY, commercialImgs);
          });
        }
        else {
          window.console.warn('Descriptor file is null');
          cb(data);
        }
      }, function() {
            window.console.error('Error while loading descriptor file');
        });
    }
    else {
            window.console.log('Device is not online returning existing imgs');
            cb(data);
    }
  }

  function init(cb, errorCb) {
    var req = utils.config.load('config.json');

    req.onload = function(config) {
      window.configuration = config;

      target = config.host + '/' + config.commercialsPath + '/' +
                        config.variant + '/slides/';
      timeout = config.defaultTimeout || DEFAULT_TIMEOUT;

      if (typeof cb === 'function') {
        cb(config);
      }
    };

    req.onerror = function() {
      window.console.error('Error while loading config.json file');
      if (typeof errorCb === 'function') {
        errorCb();
      }
    };
  }

  function start(cb, errorCb) {
    window.console.log('Commercials invoked');

    window.asyncStorage.getItem(OFFER_IMGS_KEY, function(data) {
      updateImgs(function(changes) {
        if (changes === false) {
          if (data) {
            cb(data);
          }
          else {
            window.console.log('Navigator offline, no existing imgs. Ret null');
            cb(null);
          }
        }
        else {
          if (typeof changes === 'object') {
            cb(changes);
          }
        }
      }, errorCb, true, data);
    });
  }

  var ImgRetriever = function(ptarget, imgs) {
    var next = 0;
    var self = this;
    var target = ptarget;

    this.imgs = imgs;

    this.start = function() {
      window.console.log('Img retrieval starting ...');

      retrieveImg(target + this.imgs[next]);
    };

    function imgRetrieved(blob) {
      if (typeof self.onimageready === 'function') {
        var imgPath = self.imgs[next];

        window.setTimeout(function() {
          self.onimageready(imgPath, blob);
        },0);
      }

      // And lets go for the next
      next++;
      if (next < self.imgs.length) {
        retrieveImg(target + self.imgs[next]);
      }
      else {
        if (typeof self.onfinish) {
          window.setTimeout(function() {
            self.onfinish();
          }, 0);
        }
      }
    }

    function retrieveImg(src) {
      httpGet(src, imgRetrieved);
    }
  };

  function httpGet(src, callback) {
    window.console.log('Going to get: ', src);

    var xhr = new XMLHttpRequest();

    xhr.open('GET', src + '?t=' + Date.now(), true);
    xhr.responseType = 'blob';

    xhr.timeout = timeout;

    xhr.onload = function(e) {
      if (xhr.status === 200 || xhr.status === 0) {
        var mblob = e.target.response;
        window.console.log('Loaded: ', src);
        if (typeof callback === 'function')
          self.setTimeout(function() {
            callback(mblob);
          },0);
      }
      else {
        self.console.error('HTTP error retrieving img : ',
                           src, ' Status: ', xhr.status);
        if (typeof callback === 'function')
          self.setTimeout(function() {
            callback(null);
          },0);
      }
    }; // onload

    xhr.ontimeout = function(e) {
      self.console.error('Timeout!!! while retrieving img', src);

      if (typeof callback === 'function')
        self.setTimeout(function() {
          callback(null);
        },0);
    }; // ontimeout

    xhr.onerror = function(e) {
      self.console.error('Error while retrieving img  ', src,
                         'Error: ', e);

      if (typeof callback === 'function') {
        self.setTimeout(function() {
          callback(null);
        },0);
      }
    }; // onerror

    xhr.send();
  }

  function updateImgs(cb, errorCb, force, existingData) {
    window.console.log('Going to update the commercial offer imgs');

    if (navigator.onLine === true) {
      loadDescriptor(function(descriptor) {
        // We are online but it could be server issues
        window.console.log('Descriptor loaded: ', descriptor);
        if (descriptor) {
          window.asyncStorage.getItem(CURRENT_VERSION_KEY, function(data) {
            window.console.log('Device Version: ', data);
            window.console.log('Remote Version: ', descriptor.version);

            if (descriptor.version !== data) {
              window.console.log('Imgs version changed!!');

              getRemoteImgs(descriptor, existingData, function(imgData) {
                // The new imgs are stored in a different key, waiting to
                // switch them when necessary
                var key = force ? OFFER_IMGS_KEY : OFFER_UPDATED_IMGS_KEY;

                window.asyncStorage.setItem(key, imgData, function() {
                  cb(imgData);
                });
              });
            }
            else {
              window.console.log('Imgs version has not changed');
              // No changes
              cb(false);
            }
          });  // window.asyncStorage
        } else {
          scheduleAlarm(window.configuration.retryPeriodIfOffline / 60);
          cb(false);
        }
      }, function() {
        window.console.error('Error while retrieving descriptor file');
        scheduleAlarm(window.configuration.retryPeriodIfOffline / 60);
        if (typeof errorCb === 'function') {
          errorCb();
        }
      });

      scheduleAlarm(window.configuration.checkNewImgsPeriod);
    }
    else {
      if (force === false) {
        window.console.log('Device is not online, scheduling another alarm');
        scheduleAlarm(window.configuration.retryPeriodIfOffline / 60);
      }
      cb(false);
    }
  }

  function getNewCommercials(cb) {
    // The imgs are switched
    window.asyncStorage.getItem(OFFER_UPDATED_IMGS_KEY, function(data) {
      if (data) {
        window.asyncStorage.setItem(OFFER_IMGS_KEY, data, function() {
          cb(data);
          window.asyncStorage.removeItem(OFFER_UPDATED_IMGS_KEY);
        });
      }
    });
  }

  function scheduleAlarm(delay) {
    window.asyncStorage.getItem(ALARM_KEY, function(key) {
      if (key) {
        navigator.mozAlarms.remove(key);
      }
    });

    var at = Date.now() + (delay * 60 * 60 * 1000);
    var scheduledDate = new Date(at);

    var req = navigator.mozAlarms.add(scheduledDate, 'honorTimezone', {
      imageSync: true
    });

    req.onsuccess = function() {
      window.console.log('Alarm for retrieving imgs scheduled correctly');
      window.asyncStorage.setItem(ALARM_KEY, req.result);
    };

    req.onerror = function(e) {
      window.console.error('Error while scheduling alarm for imgs: ',
                           e.target.name);
    };
  }

  return {
    init: init,
    get: start,
    getNew: getNewCommercials,
    refresh: refresh,
    updateImgs: updateImgs
  };

})();
