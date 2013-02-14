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
		var OFFSET = 30 * (window.innerWidth/320);


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
			reload.classList.add("hidden");
		}

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

			if (coordinates.init - coordinates.current >= 0) {
				// To start
				coordinates.direction = "start";
				if (next) {
					next.classList.add("notransition");
					var amount = window.innerWidth + OFFSET - (coordinates.init - coordinates.current);
					next.style.transform = "translateX("+amount+"px)";
					next.style.opacity = (1.2-amount/window.innerWidth)
				}

			} else {
				// To end
				coordinates.direction = "end";
				if (prev) {
					current.classList.add("notransition");
					var amount =  coordinates.current - coordinates.init;
					current.style.transform = "translateX("+amount+"px)";
					current.style.opacity = (1.2-amount/window.innerWidth)
					if (next){next.classList.remove("next")}
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
					prev.classList.add("current");
					prev.classList.remove("prev");
					if (prev.previousElementSibling) {prev.previousElementSibling.classList.add("prev")}
				}
			} else {
				if ( coordinates.current  <= window.innerWidth / 1.5 && next ) {
					if (prev) {prev.classList.remove("prev");}
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
					next.dataset.viewport = "";
				} else if (next) {
					next.dataset.viewport = "end";
				}
			}

			if (next) {
				// Check for last slide and show reload
				next.addEventListener("transitionend", function transEnd() {

					if (next && next.classList.contains("last")) {
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
