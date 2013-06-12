// Common UI interactions
(function(){

	uiHandlers = function() {

		// Check for touchable mobile devices
		isTouch = ("ontouchstart" in window && navigator.userAgent.search("Mobile") != -1);
		dom = {};
		dom.context = document.getElementById("canvas");
		dom.remotes = document.getElementById("remotes");
		dom.loading = document.getElementById("loading");

		// Expose playVideo
		uiHandlers.playVideo = {};
		uiHandlers.finishVideo = {};

		function bindEvents() {
			dom.play = document.querySelectorAll(".play");
			dom.pause = document.querySelectorAll(".pause");

			// Initialize slider
			Slider();

			uiHandlers.playVideo = function(trigger) {
				clearInterval(Slider.repeat);
				var video = trigger.parentNode.querySelector("video");
				trigger.parentNode.classList.add("active");
				video.play();
				video.addEventListener("ended", function end() {
					uiHandlers.finishVideo(trigger);
					video.removeEventListener("ended", end);
				})
			}

			uiHandlers.finishVideo = function(trigger) {
				Slider.autoPlay();
				var video = trigger.parentNode.querySelector("video");
				video.pause();
				trigger.parentNode.classList.remove("active");
			}

			// Play video
			for (var i = 0; i < dom.play.length; i++) {
				dom.play[i].addEventListener("click", function() {
					uiHandlers.playVideo(this);
				});
			}

			// Pause video
			for (var i = 0; i < dom.pause.length; i++) {
				dom.pause[i].addEventListener("click", function() {
					uiHandlers.finishVideo(this);
				});
			}
		}

		// If we have connection use remote slides
		if (navigator.onLine) {
			// Create slides, then set dom stuff
			Variant.getSlidesMedia(function() {
				bindEvents();
			});
		} else {
			dom.loading.classList.add("hidden");
			dom.context.removeChild(dom.remotes)
			bindEvents();
		}

	}
})();

