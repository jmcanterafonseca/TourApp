// Common UI interactions
(function(){

	uiHandlers = function() {

		// Check for touchable mobile devices
		isTouch = ("ontouchstart" in window && navigator.userAgent.search("Mobile") != -1);
		dom = {};
		dom.context = document.getElementById("canvas");
		dom.loading = document.getElementById("loading");

		// Expose playVideo
		uiHandlers.playVideo = {};
		uiHandlers.finishVideo = {};

		// Create slides, then set dom stuff
		Variant.getSlidesMedia(function() {

			dom.closeapp = document.getElementById("closeapp");
			dom.reloadapp = document.getElementById("reloadapp");
			dom.play = document.querySelectorAll(".play");

			// Initialize slider
			Slider();

			uiHandlers.playVideo = function(trigger) {
				clearInterval(Slider.repeat);
				var video = trigger.parentNode.querySelector("video");
				trigger.classList.add("bruteHidden")
				video.classList.add("active");
				video.play();
				video.addEventListener("ended", function end() {
					uiHandlers.finishVideo(trigger);
					video.removeEventListener("ended", end);
				})
				// TO DO: to be defined
			}

			uiHandlers.finishVideo = function(trigger) {
				Slider.autoPlay();
				var video = trigger.parentNode.querySelector("video");
				video.classList.remove("active");
				trigger.classList.remove("bruteHidden")
				// TO DO: to be defined
			}

			// Play video
			for (var i = 0; i < dom.play.length; i++) {
				dom.play[i].addEventListener("click", function() {
					uiHandlers.playVideo(this);
				});
			}

			// Close app
			dom.closeapp.addEventListener("click", function() {
				console.log("close app")
				window.close();
			});

			// Reload app
			dom.reloadapp.addEventListener("click", function() {
				Slider.reloadApp();
			});

		});
	}
})();

