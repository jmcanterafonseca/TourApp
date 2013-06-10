// Common UI interactions

var uiHandlers = function() {

	// Check for touchable mobile devices
	isTouch = ("ontouchstart" in window && navigator.userAgent.search("Mobile") != -1);
	dom = {};
	dom.context = document.getElementById("canvas");
	dom.loading = document.getElementById("loading");

	// Create slides, then set dom stuff
	Variant.getSlidesImg(function() {

		dom.closeapp = document.getElementById("closeapp");
		dom.reloadapp = document.getElementById("reloadapp");
		dom.play = document.querySelectorAll(".play");

		// Initialize slider
		Slider();

		function playVideo(trigger) {
			var video = trigger.parentNode.querySelector("video");
			video.classList.add("active");
			video.play();
			// TO DO: to be defined
		}

		// Play video
		for (var i = 0; i < dom.play.length; i++) {
			dom.play[i].addEventListener("click", function() {
				playVideo(this);
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
