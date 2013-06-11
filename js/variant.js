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
					'<source type="video/ogg; codecs=&quot;theora, vorbis&quot;" src="#url#"></source>'+
				'</video>'+
			'</section>'

		var staticSlidesHTML = dom.context.innerHTML;
		var htmlBuffer = "";

		for (var i = 0; i < media.length; i++) {
			var info = {
				number: i+1,
				position: "",
				viewport: 'data-viewport="end"',
				url: SERVER+media[i]
			}

			// Set first slide
			if (info.number == 1) {
				info.position = "current";
				info.viewport = '';
			}

			// Set next one
			if (info.number == 2) {
				info.position = "next";
			}
			// Check for video
			if (info.url.search(".ogv") !== -1) {
				var slideHTML = Variant.parseTemplate(tplVideo, info);
			} else {
				var slideHTML = Variant.parseTemplate(tpl, info);
			}

			htmlBuffer += slideHTML;
		}

		dom.context.innerHTML = htmlBuffer + staticSlidesHTML;


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
