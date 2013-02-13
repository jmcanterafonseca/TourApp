// Common UI interactions

var uiHandlers = function() {

	var context = document.body;
	var prev = "";
	var current = context.querySelector(".view.current");
	var trigger = context.querySelector(".view.next");
	var reload = document.getElementById("reload");
	var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
	var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
	var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";
	var coordinates = { init: 0, current: 0 }
	var OFFSET = 25*window.innerWidth/320;


	resetViews();

	// Reset to default state
	function resetViews () {
		trigger.classList.remove("notransition");
		current.classList.remove("notransition");
		trigger.setAttribute("style", "");
		current.setAttribute("style", "");
	}

	function move(e) {
		coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

		trigger.classList.add("notransition");
		current.classList.add("notransition");

		if (coordinates.init - coordinates.current >= 0) {
			// To start
			var amount = window.innerWidth - OFFSET - (coordinates.init - coordinates.current);
			trigger.style.transform = "translateX("+amount+"px)";
			current.style.opacity = (amount/window.innerWidth)

		} else {
			// To end
			var amount =  coordinates.current - coordinates.init;
			current.style.transform = "translateX("+amount+"px)";
			prev.style.opacity = (amount/window.innerWidth)
		}

	}

	function start() {
		current = context.querySelector(".view.current");
		trigger = context.querySelector(".view.next");
		prev = current.previousElementSibling;

		// Check for last slide
		if (!trigger) {
			return;
		}

		context.addEventListener(moveEvent, move);
		context.addEventListener(releaseEvent, end);
	}

	function end() {
		resetViews();

		// To start or end
		if ( coordinates.current  <= window.innerWidth / 1.5 ) {
			trigger.classList.remove("next");
			// Check for last slide
			if (trigger.nextElementSibling) {
				current.classList.remove("current");
				trigger.classList.add("current");
				trigger.nextElementSibling.classList.add("next");
			} else {
				trigger.classList.add("last")
			}
			trigger.dataset.viewport = "";
			current.style.opacity = 0;
		} else {
			trigger.dataset.viewport = "end";
		}

		// Check for last slide and show reload
		trigger.addEventListener("transitionend", function transEnd() {

			if (trigger.classList.contains("last")) {
				reload.classList.remove("hidden")
			}
			this.removeEventListener("transitionend", transEnd)
		});

		context.removeEventListener(moveEvent, move, false);
		context.removeEventListener(releaseEvent, end, false);
	}

	context.addEventListener(pressEvent, function(e) {
		coordinates.init = (e.touches) ? e.touches[0].pageX : e.clientX;
		start();
	});

	reload.addEventListener("click", function(){
		window.location.href = window.location.href;
	});


}
