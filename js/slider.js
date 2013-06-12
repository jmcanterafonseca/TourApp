
Slider = function() {

	var last;
	var next = dom.context.querySelector(".next");
	var current = dom.context.querySelector(".current");
	var prev = dom.context.querySelector(".prev");
	var slides = dom.context.querySelectorAll(".slide");

	var pressEvent =  isTouch  ? "touchstart" : "mousedown";
	var moveEvent = isTouch ? "touchmove" : "mousemove";
	var releaseEvent = isTouch ? "touchend" :"mouseup";
	var coordinates = { init: 0, current: 0 }
	var OFFSET = 25 * (window.innerWidth/320);
	var BASE_OPACITY = 0.6;
	var delay = 8000;

	// Trigger autoplay mode
	Slider.autoPlay;

	// Interval object
	Slider.repeat;

	Slider.reloadApp = function() {
		for (var i = 0; i < slides.length; i++) {
			// Clean all
			slides[i].classList.remove("prev");
			slides[i].classList.remove("current");
			slides[i].classList.remove("next");
			slides[i].classList.remove("last");
			slides[i].style.opacity = "";
			slides[i].style.transform = "";

			// Set initial order
			if (!i == 0) {
				slides[i].dataset.viewport = "end"
			} else {
				slides[i].classList.add("current");
			}
			if ( i == 1 ) {
				slides[i].classList.add("next");
			}
		}
	}

	function refreshNodes() {
		next = dom.context.querySelector(".next");
		current = dom.context.querySelector(".current");
		prev = dom.context.querySelector(".prev");
	}

	// Move to next slide
	Slider.nextSlide = function() {
		next.style.transform = "";
		next.style.opacity = "";
		next.dataset.viewport = "";
		current.style.opacity = BASE_OPACITY;

		// Convert ? in to next
		if (next.nextElementSibling) {
			next.nextElementSibling.classList.add("next");
		}
		// Convert next in to current
		next.classList.remove("next")
		next.classList.add("current")
		// Convert current in to prev
		current.classList.remove("current")
		current.classList.add("prev")
		// Remove prev
		if (prev) {
			prev.classList.remove("prev");
		}
	}

	// Keep on the same slide
	function keepSlide() {
		// If there is no next, we are on last slide
		if (next) {
			next.style.transform = "";
			next.style.opacity = "";
		} else {
			current.style.transform = "";
			current.style.opacity = "";
		}

	}

	function prevSlide() {
		current.style.transform =""
		current.dataset.viewport ="end";
		prev.style.opacity = "1";

		// Remove next
		if (next) {
			next.style.opacity = "";
			next.classList.remove("next");
		}
		// Convert current in next
		current.classList.remove("current");
		current.classList.add("next");
		// Convert prev in current
		prev.classList.remove("prev");
		prev.classList.add("current");

		if (prev.previousElementSibling) {
			prev.previousElementSibling.classList.add("prev");
		}
	}

	// Play slidevideo when on autoplay mode
	function playSlideVideo() {
		clearInterval(Slider.repeat);
		var video = next.querySelector("video");
		var reference = next.querySelector(".play");
		uiHandlers.playVideo(reference);

		video.addEventListener("ended", function end(e) {
			uiHandlers.finishVideo(reference);
			refreshNodes();
			if (!next.nextElementSibling) {
				Slider.reloadApp();
			}
			video.removeEventListener("ended", end);
		});
	}

	// Enters autoplaymode
	Slider.autoPlay = function() {
		clearInterval(Slider.repeat);
		Slider.repeat = setInterval(function() {
			dom.context.classList.add("autoplay");
			refreshNodes();
			if (next.nextElementSibling) {
				Slider.nextSlide();
				// If has a video then play it
				if (next.classList.contains("video")) {
					playSlideVideo();
				}
			} else {
				Slider.reloadApp();
			}
		}, delay);
	};

	function move(e) {
		coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

		if (coordinates.init - coordinates.current >= 0) {
			// To start
			coordinates.direction = "start";
			if (next) {
				var amount = window.innerWidth - OFFSET - (coordinates.init - coordinates.current);

				next.style.transform = "translateX("+amount+"px)";
				// Increase opacity from 0.6 to 1
				next.style.opacity = (1 - (amount/2)/window.innerWidth);
			}

		} else {
			// To end
			coordinates.direction = "end";
			if (prev) {
				var amount =  coordinates.current - coordinates.init;
				current.style.transform = "translateX("+amount+"px)";
			}
		}
	}

	function start() {
		clearInterval(Slider.repeat);

		// Get actual prev, current and next slides
		refreshNodes();

		dom.context.classList.remove("autoplay");
		if (current) {
			current.classList.add("notransition");
		}
		if (next) {
			next.classList.add("notransition");
		}

		dom.context.addEventListener(moveEvent, move);
		dom.context.addEventListener(releaseEvent, end);
	}

	function end() {

		if (next) {
			next.classList.remove("notransition")
		}

		if (current) {
			current.classList.remove("notransition")
		}

		// resetSlides();
		Slider.autoPlay();

		// // Swipe start to end |=>|
		if ( coordinates.direction == "end" ) {
			if ( coordinates.current  >= window.innerWidth / 3 && prev ) {
				console.log("=>")
				prevSlide();
			} else {
				//Don't move |=|
				console.log("=")
				// What current is next in the opposite direction
				next = dom.context.querySelector(".current");
				keepSlide();
			}
		} else {
			// Swipe end to start |<=|
			if ( !(coordinates.current  <= window.innerWidth / 1.5 && next) ) {
				//Don't move |=|
				console.log("=")
				keepSlide();
			} else {
				//Next slide
				console.log("<=")
				Slider.nextSlide();
			}

		}

		dom.context.removeEventListener(moveEvent, move, false);
		dom.context.removeEventListener(releaseEvent, end, false);
	}
	dom.context.addEventListener(pressEvent, function(e) {
		// Avoid to slide if the video is touched
		var tag = e.explicitOriginalTarget.tagName;
		var isAction = (tag == "VIDEO" || tag == "A" || tag == "BUTTON");
		if (!isAction) {
			coordinates.init = (e.touches) ? e.touches[0].pageX : e.clientX;
			start();
		}
	});

	Slider.autoPlay();
}
