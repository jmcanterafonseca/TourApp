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

		function bindEvents() {
			dom.loading.classList.add("hidden");
			dom.play = document.querySelectorAll(".play");
			dom.pause = document.querySelectorAll(".pause");

			// Initialize slider
			Slider();

			uiHandlers.playVideo = function(trigger) {
				clearInterval(Slider.repeat);
				var video = trigger.parentNode.querySelector("video");
				trigger.parentNode.classList.add("active");
				video.play();
				video.addEventListener("ended", function end() {
					Slider.refreshNodes();
					Slider.nextSlide();
					uiHandlers.finishVideo(trigger);
					video.removeEventListener("ended", end);
				})
			}

			uiHandlers.finishVideo = function(trigger) {
				Slider.autoPlay();
				var video = trigger.parentNode.querySelector("video");
				video.pause();
				trigger.parentNode.classList.remove("active");
			}

			// Play video
			for (var i = 0; i < dom.play.length; i++) {
				dom.play[i].addEventListener("click", function() {
					uiHandlers.playVideo(this);
				});
			}

			// Pause video
			for (var i = 0; i < dom.pause.length; i++) {
				dom.pause[i].addEventListener("click", function() {
					uiHandlers.finishVideo(this);
				});
			}
		}

		function createSlides(media) {
	  	  	var slides = [];

  	  		var local = utils.config.load(configuration.localSlides+"/slides.json");
		    	local.onload = function(data) {
		  	  	// Local slides
		    		for (var i = 0; i < data.length; i++) {
		    			slides.push(configuration.localSlides+"/"+data[i]);
		    		}

		    		// Remote slides
				if (media) {
				      Object.keys(media).forEach(function(imgSrc) {
				      	slides.push(window.URL.createObjectURL(media[imgSrc]));
				      });
				      window.console.log('Commercials loaded!!!!');
			    	}

			      // Create slides, then set dom stuff
				Variant.createSlides(slides, function() {
					bindEvents();
				});
		    	}

		}

		commercials.init(function() {
		    window.console.log('loaded', commercials.start);
		    commercials.get(function(commercialImgs) {
		    	createSlides(commercialImgs);
		    });
		  });

		commercials.onimgsupdated = function() {
			commercials.getNew(function(commercialImgs) {
				createSlides(commercialImgs);
			});
		}

	}
})();

