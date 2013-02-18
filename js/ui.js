// Common UI interactions

var uiHandlers = function() {


	var initSwipe = function() {
		var context = document.getElementById("canvas");
		var closeapp = document.getElementById("closeapp");
		var current, overlayCurrent, positionCurrent, next, overlayNext, positionNext, prev, overlayPrev, positionPrev;

		var repeat, queueRepeat;
		var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
		var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
		var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";
		var coordinates = { init: 0, current: 0 }
		var OFFSET = 25 * (window.innerWidth/320);

		var autoPlay = function() {

			var delay = 3500;
			context.classList.add("autoplay");
			function nextSlide() {
				if (next) {
					// anonymous becomes next
					if (next.nextElementSibling) {
						next.nextElementSibling.classList.add("next");

						// Next becomes current
						next.dataset.viewport = "start";
						next.classList.remove("next");
						next.classList.add("current");
						next.addEventListener("transitionend", function endTrans() {
							refreshNodes();
							this.removeEventListener("transitionend", endTrans);
						});

						// Current becomes prev
						overlayCurrent.style.opacity = "1";
						current.classList.remove("current");
						current.classList.add("prev");

						// Prev becomes anonymous
						if (prev) {
							prev.classList.remove("prev");
						}
					} else {
						// Last slide and reload app
						window.location.href = window.location.href
						clearInterval(repeat);
					}

				}
			}
			repeat = setInterval(function(){
				nextSlide();
			}, delay);
		}


		function refreshNodes() {
			current = context.querySelector(".view.current");
			if (current) {
				overlayCurrent = current.querySelector(".overlay");
				positionCurrent = current.querySelector(".position");
			}

			next = current.nextElementSibling;
			if (next) {
				overlayNext = next.querySelector(".overlay");
				positionNext = next.querySelector(".position");
			}

			prev = current.previousElementSibling;
			if (prev) {
				overlayPrev = prev.querySelector(".overlay");
				positionPrev = prev.querySelector(".position");
			}
		}

		// Reset to default state
		function resetViews() {
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
			if (context.querySelector(".last")) {
				context.querySelector(".last").classList.remove("last");
			}
		}

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;

			if (coordinates.init - coordinates.current >= 0) {
				// To start
				coordinates.direction = "start";
				if (next) {
					var amount = window.innerWidth - OFFSET - (coordinates.init - coordinates.current);
					next.style.transform = "translateX("+amount+"px)";
					overlayCurrent.style.background = "#000";
					overlayCurrent.style.opacity = (1.3-amount/window.innerWidth < 1) ? 1.3-amount/window.innerWidth : 1 ;
					overlayNext.style.opacity = (amount/window.innerWidth);
					positionNext.style.transform = "translateX("+((window.innerWidth-amount-1)/10)+"px)";
					positionNext.style.opacity = ((amount/2)/window.innerWidth);
				}

			} else {
				// To end
				coordinates.direction = "end";
				if (prev) {
					var amount =  coordinates.current - coordinates.init;
					current.style.transform = "translateX("+amount+"px)";
					overlayPrev.style.background = "rgba(255,255,255,0.2)";
					overlayPrev.style.opacity = (1-amount/window.innerWidth);
					positionCurrent.style.transform = "translateX("+((window.innerWidth-amount-1)/10)+"px)";
					positionCurrent.style.opacity = (amount/window.innerWidth);
					if (next) {
						next.classList.remove("next");
					}
				}
			}

		}

		function start() {
			clearInterval(repeat);
			clearTimeout(queueRepeat);
			context.classList.remove("autoplay");
			refreshNodes();
			if (current) {
				current.classList.add("notransition");
			}
			if (next) {
				next.classList.add("notransition");
			}

			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			resetViews();
			queueRepeat = setTimeout(function(){
				refreshNodes();
				autoPlay();
			}, 3500);

			// // Swipe to start to start or end
			if ( coordinates.direction == "end" ) {
				if ( coordinates.current  >= window.innerWidth / 3 && prev ) {
					current.dataset.viewport = "end";
					if (next) {
						next.classList.remove("next");
					}

					//prev.querySelector(".overlay").style.background = "rgba(255,255,255,0.2)";
					overlayPrev.style.opacity = 0;
					overlayCurrent.style.opacity = 1;
					positionCurrent.style.opacity = 1;
					positionCurrent.style.transform = "translateX(0px)";
					current.classList.remove("current")
					current.classList.add("next")
					prev.classList.add("current");
					prev.classList.remove("prev");
					if (prev.previousElementSibling) {
						prev.previousElementSibling.classList.add("prev");
					}
				} else {
					//Not moved
					positionCurrent.style.opacity = 0;
				}
			} else {
				if ( coordinates.current  <= window.innerWidth / 1.5 && next ) {
					if (prev) {
						prev.classList.remove("prev");
					}
					overlayNext.style.opacity = 0;
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
					overlayCurrent.style.background = "rgba(255,255,255,0.2)";
					overlayCurrent.style.opacity = 0;
					positionNext.style.opacity = 1;
					positionNext.style.transform = "translateX(0px)";
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
		refreshNodes();
		autoPlay();
	}

	initSwipe();

	closeapp.addEventListener("click", function() {
		window.close();
	});


}
