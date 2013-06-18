'use strict';

var NEXT_ALARM_KEY = 'next_alarm';

var lock = window.navigator.requestWakeLock('screen');

window.addEventListener('beforeunload', function() {
  if (lock) {
    lock.unlock();
  }
});

// Define global key elements  and initialize UI listeners
document.addEventListener('DOMContentLoaded', function() {

	// Initialize UI handlers
	uiHandlers();

});


navigator.mozSetMessageHandler('alarm', function(alarm) {
  window.console.log('Alarm message arrived!!!', JSON.stringify(alarm));

  if(alarm.data.tourAppRestart === true) {
    window.asyncStorage.removeItem(NEXT_ALARM_KEY, function onremove() {
        navigator.mozApps.getSelf().onsuccess = function getSelfCB(evt) {
        var app = evt.target.result;
        app.launch('tourapp');
      };
    });
  }
  else if(alarm.data.imageSync === true) {
    window.console.log('Going to update commercial offer images');

    commercials.updateImgs(function(changes) {
      if(typeof changes === 'object') {
        if(typeof commercials.onimgsupdated === 'function') {
          window.setTimeout(commercials.onimgsupdated, 0);
        }
      }
    }, null, false);
  }
});


document.addEventListener('mozvisibilitychange', function vis_changed(e) {
  window.console.log('Visibility change event!!!', window.asyncStorage);

  window.asyncStorage.getItem(NEXT_ALARM_KEY, function(data) {
    window.console.log(data);

    if (data) {
      if (document.mozHidden === false) {
        navigator.mozAlarms.remove(data);
      }
    }
    else {
      if (document.mozHidden === true) {
        window.console.log('Moz hidden !!!');
        return;

        var at = Date.now() + (window.configuration.restartAppPeriod
                               * 60 * 1000);
        var scheduledDate = new Date(at);

        var req = navigator.mozAlarms.add(scheduledDate, 'honorTimezone', {
          tourAppRestart: true
        });

        window.console.log('Alarm scheduled!!!');

        req.onsuccess = function() {
          window.asyncStorage.setItem(NEXT_ALARM_KEY, req.result);
          window.console.log('Alarm scheduled!!!');
        };

        req.onerror = function() {
          window.console.error('Error while scheduling alarm: ',
                               req.error.name);
        };
      }
    }
  });
});
