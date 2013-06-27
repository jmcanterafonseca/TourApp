SliderReady = false;
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
	var BASE_OPACITY = 0.6;
	var delay = configuration.slidesAutoplay;

	// Trigger autoplay mode
	Slider.autoPlay;

	// Interval object
	Slider.repeat;

	Slider.refreshNodes = function() {
		next = dom.context.querySelector(".next");
		current = dom.context.querySelector(".current");
		prev = dom.context.querySelector(".prev");
	}

	// Move to next slide
	Slider.nextSlide = function() {
		next.style.transform = "";
		next.style.opacity = "";
		current.style.opacity = "";

		// Convert ? in to next
		if (next.nextElementSibling) {
			next.nextElementSibling.classList.add("next");
		} else {
			// If there is no next, use the first slide.
			slides[0].classList.add("next");
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
		current.style.transform = "";
		current.style.opacity = "";
		prev.style.opacity = "";

		// Remove next
		if (next) {
			next.style.transform = "";
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
		} else {
			// If there is no prev, use the last slide
			var last = slides.length;
			slides[last-1].classList.add("prev");
		}
	}

	// Play slidevideo when on autoplay mode
	function playSlideVideo() {
		clearInterval(Slider.repeat);
		var video = next.querySelector("video");
		var reference = next.querySelector(".play");
		/*
		  We should set the video at begining but:
		  video.currentTime = 0; is not working
		 */
		uiHandlers.playVideo(reference);

		video.addEventListener("ended", function end(e) {
			uiHandlers.finishVideo(reference);
			Slider.refreshNodes();
			video.removeEventListener("ended", end);
		});
	}

	// Enters autoplaymode
	Slider.autoPlay = function() {
		clearInterval(Slider.repeat);
		Slider.repeat = setInterval(function() {
			dom.context.classList.add("autoplay");
			Slider.refreshNodes();
			next.classList.add("transition");
			next.addEventListener("transitionend", function end() {
				this.classList.remove("transition");
				next.removeEventListener("transitionend", end);
			});
			Slider.nextSlide();
			// If has a video then play it
			if (next.classList.contains("video")) {
				playSlideVideo();
			}
		}, delay);
	};

	function move(e) {
		coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

		if (coordinates.init - coordinates.current >= 0) {
			// To start |<=|
			coordinates.direction = "start";
			var amount = window.innerWidth - (coordinates.init - coordinates.current);
			next.style.transform = "translateX("+amount+"px)";
			// Increase opacity from 0.6 to 1
			next.style.opacity = (1 - (amount/2)/window.innerWidth);

		} else {
			// To end |=>|
			coordinates.direction = "end";
			var amount =  coordinates.current - coordinates.init;
			current.style.transform = "translateX("+amount+"px)";
			current.style.opacity = (1 - (amount/2)/window.innerWidth);
		}
	}

	function start() {
		clearInterval(Slider.repeat);

		// Get actual prev, current and next slides
		Slider.refreshNodes();

		dom.context.classList.remove("autoplay");
		if (prev) {
			prev.classList.remove("transition");
		}
		if (current) {
			current.classList.remove("transition");
		}
		if (next) {
			next.classList.remove("transition");
		}

		dom.context.addEventListener(moveEvent, move);
		dom.context.addEventListener(releaseEvent, end);
	}

	function end() {

		// resetSlides();
		Slider.autoPlay();

		// // Swipe start to end |=>|
		if ( coordinates.direction == "end" ) {
			if (current) {
				current.classList.add("transition")
			}

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
			if (next) {
				next.classList.add("transition")
			}

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
	SliderReady = true;
	// Notify finished execution
	var done = new CustomEvent("SliderReady");
	document.dispatchEvent(done);

}
