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
				'<video controls="controls">'+
					'<source type="#format#" src="#url#"></source>'+
				'</video>'+
			'</section>'


		var htmlBuffer = "";
		var localSlides = dom.context.querySelectorAll(".slide");
		var localSlidesAmount = localSlides.length

		for (var i = 0; i < media.length; i++) {
			var info = {
				number: i+localSlidesAmount+1,
				position: "",
				viewport: 'data-viewport="end"',
				url: media[i]
			}

			// Remove local last slide and user remote as last
			if (i == media.length-1) {
				info.position = "prev";
				info.viewport= "";
				localSlides[localSlidesAmount-1].classList.remove("prev");
				localSlides[localSlidesAmount-1].dataset.viewport = "end";
			}

			var slideHTML = Variant.parseTemplate(tpl, info);
			htmlBuffer += slideHTML;
		}
		dom.remotes.outerHTML = htmlBuffer;


		// Give some time b2g to paint th htmlBuffer
		var delay = setTimeout(function(){
			callback()
		}, 50);
	}

})();
