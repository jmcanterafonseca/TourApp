// Common UI interactions

var uiHandlers = function() {

	var initSwipe = function() {
		var context = document.getElementById("canvas");
		var current = context.querySelector(".view.current");
		var next = current.nextElementSibling;
		var prev = current.previousElementSibling;
		var reload = document.getElementById("reload");
		var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
		var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
		var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";
		var coordinates = { init: 0, current: 0 }


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
		}

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

			if (coordinates.init - coordinates.current >= 0) {
				// To start
				coordinates.direction = "start";
				if (next) {
					next.classList.add("notransition");
					var amount = window.innerWidth - (coordinates.init - coordinates.current);
					next.style.transform = "translateX("+amount+"px)";
					current.style.opacity = (amount/window.innerWidth)
				}

			} else {
				// To end
				coordinates.direction = "end";
				if (prev) {
					current.classList.add("notransition");
					var amount =  coordinates.current - coordinates.init;
					current.style.transform = "translateX("+amount+"px)";
					prev.style.opacity = (amount/window.innerWidth)
				}
			}

		}

		function start() {
			current = context.querySelector(".view.current");
			next = current.nextElementSibling;
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
					current.classList.remove("current")
					current.classList.add("next")
					current.previousElementSibling.classList.add("current");
				}
			} else {
				if ( coordinates.current  <= window.innerWidth / 1.5 && next ) {
					next.classList.remove("next");
					current.classList.remove("current");

					// Check for last slide
					if (next.nextElementSibling) {
						next.classList.add("current");
						next.nextElementSibling.classList.add("next");
					} else {
						next.classList.add("current");
						next.classList.add("last")
					}
					next.dataset.viewport = "";
					if (prev) {
						prev.style.opacity = 0;
					}
					current.style.opacity = 0;
				} else if (next) {
					next.dataset.viewport = "end";
				}
			}

			if (next) {
				// Check for last slide and show reload
				next.addEventListener("transitionend", function transEnd() {

					if (next.classList.contains("last")) {
						reload.classList.remove("hidden")
					}
					this.removeEventListener("transitionend", transEnd)
				});
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

	reload.addEventListener("click", function(){
		window.location.href = window.location.href;
	});


}
