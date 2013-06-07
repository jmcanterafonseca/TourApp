// Common UI interactions

var uiHandlers = function() {

	// Check for touchable mobile devices
	isTouch = ("ontouchstart" in window && navigator.userAgent.search("Mobile") != -1);
	dom = {};
	dom.context = document.getElementById("canvas");
	dom.closeapp = document.getElementById("closeapp");
	dom.reloadapp = document.getElementById("reloadapp");
	dom.play = document.querySelectorAll(".play");
	dom.options = document.getElementById("options");
	dom.cancel = document.getElementById("cancel");
	dom.loading = document.getElementById("loading");
	dom.selectVariant = dom.options.querySelector("select");

	function playVideo(trigger) {
		var video = trigger.parentNode.querySelector("video");
		video.classList.add("active");
		video.play();
		// TO DO: to be defined
	}

	// Initialize slider
	Slider();

	// Close app
	dom.closeapp.addEventListener("click", function() {
		window.close();
	});

	// Reload app
	dom.reloadapp.addEventListener("click", function() {
		Slider.reloadApp();
	});

	// Play video
	for (var i = 0; i < dom.play.length; i++) {
		dom.play[i].addEventListener("click", function() {
			playVideo(this);
		});
	}

	dom.selectVariant.addEventListener("blur", function(e) {
		dom.options.classList.add("hidden");
		dom.loading.classList.remove("hidden");
		Variant.getSlidesImg(this.value);
	});

	dom.cancel.addEventListener("click", function(e) {
		dom.options.classList.add("hidden");
	});

	// if we setted up the option hide dom.options
	if (localStorage.getItem("variant")) {
		dom.options.classList.add("bruteHidden");
		dom.loading.classList.add("bruteHidden");
		var data = localStorage.getItem("images").split(",");
		Variant.createSlides(data);
	} else {
		// Hide the dom.loading to show the dom.options
		dom.loading.classList.add("hidden");
	}


}
