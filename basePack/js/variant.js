(function(){
	Variant = {};

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

		var tplVideo = '<section id="slide-#number#" class="slide #position# video" role="region" #viewport#>'+
				'<a href="#" class="play">Play</a>'+
				'<a href="#" class="pause">Pause</a>'+
				'<video preload>'+
					'<source type="video/ogg" src="#url#"></source>'+
				'</video>'+
			'</section>'

		var htmlBuffer = "";

		for (var i = 0; i < media.length; i++) {
			var info = {
				number: i,
				position: "",
				viewport: 'data-viewport="end"',
				url: media[i]
			}

			// Set next slide
			if (i == 1) {
				info.position = "next";
				info.viewport= 'data-viewport="end"';
			}

			// Set first slide
			if (i == 0) {
				info.position = "current";
				info.viewport= "";
			}

			// Set last slide
			if (i == media.length-1) {
				info.position = "prev";
				info.viewport= "";
			}

			// Set video tpl or image one
			if (media[i].search(".ogv") == -1) {
				var slideHTML = Variant.parseTemplate(tpl, info);
			} else {
				var slideHTML = Variant.parseTemplate(tplVideo, info);
			}

			htmlBuffer += slideHTML;
		}

		// Insert all the slides
		dom.context.innerHTML = htmlBuffer;

		// Give some time b2g to paint the htmlBuffer
		var delay = setTimeout(function(){
			callback();
		}, 50);
	}

})();
