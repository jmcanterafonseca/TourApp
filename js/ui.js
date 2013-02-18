// Common UI interactions

var uiHandlers = function() {

	var initSwipe = function() {
		var context = document.getElementById("canvas");
		var current = context.querySelector(".view.current");
		var next = current.nextElementSibling;
		var prev = current.previousElementSibling;
		var closeapp = document.getElementById("closeapp");
		var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
		var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
		var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";
		var coordinates = { init: 0, current: 0 }
		var OFFSET = 25 * (window.innerWidth/320);


		// Reset to default state
		function resetViews () {
			if (prev) {
				prev.classList.remove("notransition");
				prev.setAttribute("style", "");
			}
			if (next) {
				next.classList.remove("notransition");
				next.setAttribute("style", "");
			}
			current.classList.remove("notransition");
			current.setAttribute("style", "");
			if (context.querySelector(".last")) {context.querySelector(".last").classList.remove("last");}
		}

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

			if (coordinates.init - coordinates.current >= 0) {
				// To start
				coordinates.direction = "start";
				if (next) {
					var amount = window.innerWidth + OFFSET - (coordinates.init - coordinates.current);
					next.style.transform = "translateX("+amount+"px)";
					current.querySelector(".overlay").style.background = "#000";
					current.querySelector(".overlay").style.opacity = (1.3-amount/window.innerWidth);
					next.querySelector(".overlay").style.opacity = (amount/window.innerWidth);
					next.querySelector(".position").style.transform = "translateX("+((window.innerWidth-amount-1)/10)+"px)";
					next.querySelector(".position").style.opacity = ((amount/2)/window.innerWidth);
				}

			} else {
				// To end
				coordinates.direction = "end";
				if (prev) {
					var amount =  coordinates.current - coordinates.init;
					current.style.transform = "translateX("+amount+"px)";
					current.querySelector(".overlay").style.background = "rgba(255,255,255,0.2)";
					current.querySelector(".overlay").style.opacity = (amount/window.innerWidth);
					current.querySelector(".position").style.transform = "translateX("+((window.innerWidth-amount-1)/10)+"px)";
					current.querySelector(".position").style.opacity = (amount/window.innerWidth);
					if (next){next.classList.remove("next")}
				}
			}

		}

		function start() {
			current = context.querySelector(".view.current");
			if (current) {
				current.classList.add("notransition");
			}
			next = current.nextElementSibling;
			if (next) {
				next.classList.add("notransition");
			}
			prev = current.previousElementSibling;

			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			resetViews();

			// // Swipe to start to start or end
			if ( coordinates.direction == "end" ) {
				if ( coordinates.current  >= window.innerWidth / 3 && prev ) {
					current.dataset.viewport = "end";
					if (next) {
						next.classList.remove("next");
					}
					prev.querySelector(".overlay").style.opacity = 0;
					current.querySelector(".overlay").style.opacity = 1;
					current.querySelector(".position").style.opacity = 1;
					current.querySelector(".position").style.transform = "translateX(0px)";
					current.classList.remove("current")
					current.classList.add("next")
					prev.classList.add("current");
					prev.classList.remove("prev");
					if (prev.previousElementSibling) {prev.previousElementSibling.classList.add("prev")}
				} else {
					//Not moved
					current.querySelector(".position").style.opacity = 0;
				}
			} else {
				if ( coordinates.current  <= window.innerWidth / 1.5 && next ) {
					if (prev) {
						prev.classList.remove("prev");
					}
					next.querySelector(".overlay").style.opacity = 0;
					next.classList.remove("next");
					current.classList.remove("current");
					current.classList.add("prev");

					// Check for last slide
					if (next.nextElementSibling) {
						next.classList.add("current");
						next.nextElementSibling.classList.add("next");
					} else {
						next.classList.add("current");
						next.classList.add("last");
					}
					next.dataset.viewport = "start";
				} else if (next) {
					//Not moved
					current.querySelector(".overlay").style.opacity = 0;
					next.querySelector(".position").style.opacity = 1;
					next.querySelector(".position").style.transform = "translateX(0px)";
					next.dataset.viewport = "end";
				}
			}

			context.removeEventListener(moveEvent, move, false);
			context.removeEventListener(releaseEvent, end, false);
		}

		context.addEventListener(pressEvent, function(e) {
			coordinates.init = (e.touches) ? e.touches[0].pageX : e.clientX;
			start();
		});
	}

	initSwipe();

	closeapp.addEventListener("click", function() {
		window.close();
	});


}
