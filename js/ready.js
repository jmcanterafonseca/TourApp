var lock = window.navigator.requestWakeLock('screen');

window.addEventListener('unload', function () {
    lock.unlock();
});

// Define global key elements  and initialize UI listeners
document.addEventListener("DOMContentLoaded", function () {

	// Initialize UI handlers
	uiHandlers();

});
