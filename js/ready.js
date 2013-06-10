var NEXT_ALARM_KEY = 'next_alarm';
var TIMEOUT_APP = 1;                // In minutes

var lock = window.navigator.requestWakeLock('screen');

window.addEventListener('unload', function() {
  if (lock) {
    lock.unlock();
  }
});

// Define global key elements  and initialize UI listeners
document.addEventListener('DOMContentLoaded', function() {

	// Initialize UI handlers
	uiHandlers();

});


navigator.mozSetMessageHandler('alarm', function() {
  window.console.log('Alarm message arrived!!!');

  window.asyncStorage.removeItem(NEXT_ALARM_KEY, function onremove() {
      navigator.mozApps.getSelf().onsuccess = function getSelfCB(evt) {
      var app = evt.target.result;
      app.launch('tourapp');
    };
  });
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

        var at = Date.now() + (TIMEOUT_APP * 60 * 1000);
        var scheduledDate = new Date(at);

        var req = navigator.mozAlarms.add(scheduledDate, 'honorTimezone', {});

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
