(function(){
	Variant = {};
	SERVER = "http://basiclines.com/lab/tourapp/slides/";

	// Small template engine
	Variant.parseTemplate = function(template, data) {
		for ( var i in data ) {
			var key = i;
			var value = data[i];
			template = template.replace(new RegExp("#"+key+"#", 'g'), value);
		}
		return template;
	}

	// Generate slides dynamically
	Variant.createSlides = function(media, callback) {

		var tpl = '<section id="slide-#number#" class="slide #position#" role="region" #viewport#>'+
					'<img src="#url#">'+
				  '</section>';

		var tplVideo = '<section id="slide-#number#" class="slide #position# video" role="region" #viewport# style="background-image: url('+SERVER+'video.png)">'+
				'<a href="#" class="play">Play</a>'+
				'<video controls="controls">'+
					'<source type="#format#" src="#url#"></source>'+
				'</video>'+
			'</section>'


		var htmlBuffer = "";
		var localSlidesAmount = dom.context.querySelectorAll(".slide").length

		for (var i = 0; i < media.length; i++) {
			var info = {
				number: i+localSlidesAmount+1,
				position: "",
				viewport: 'data-viewport="end"',
				url: SERVER+media[i]
			}

			// Check for video
			if (info.url.search(".ogv") !== -1 || info.url.search(".mp4") !== -1) {
				if (info.url.search(".ogv") !== -1) {
					info.format = "video/ogg";
				} else if (info.url.search(".mp4") !== -1) {
					info.format = "video/mp4";
				}
				var slideHTML = Variant.parseTemplate(tplVideo, info);
			} else {
				var slideHTML = Variant.parseTemplate(tpl, info);
			}

			htmlBuffer += slideHTML;
		}

		dom.remotes.outerHTML = htmlBuffer;


		// Give some time b2g to paint th htmlBuffer
		var delay = setTimeout(function(){
			dom.loading.classList.add("hidden");
			callback()
		}, 50);
	}

	Variant.getSlidesMedia = function(callback) {

		function success(data) {
			var slides = JSON.parse(data);
			Variant.createSlides(slides, callback)
		}

		function error(status) {
			console.log("error")
			console.log(status)
		}

		// HTTP request
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType('application/json');
		xhr.open('GET', SERVER+"slides.json", true);

		xhr.onreadystatechange = function() {
			// We will get a 0 status if the app is in app://
			if (xhr.readyState === 4 && (xhr.status === 200 ||
				xhr.status === 0)) {
				success(xhr.responseText);
			}
			else if (xhr.readyState === 4) {
				error(xhr.status)
			}
		}; // onreadystatechange

		xhr.send(null);
	};

})();
