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

	// G enerate dynamically  slides
	Variant.createSlides = function(media, callback) {

		var tpl = '<section id="slide-#number#" class="slide #position#" role="region" #viewport#>'+
					'<img src="#url#">'+
				  '</section>';

		var tplVideo = '<section id="slide-#number#" class="slide #position# video" role="region" #viewport# style="background-image: url(gphx/slides/video.png)">'+
				'<a href="#" class="play">Play</a>'+
				'<video controls="controls">'+
					'<source type="video/ogg; codecs=&quot;theora, vorbis&quot;" src="gphx/slides/#number#.ogv"></source>'+
				'</video>'+
			'</section>'

		var staticSlidesHTML = dom.context.innerHTML;
		var htmlBuffer = "";

		for (var i = 0; i < media.length; i++) {
			var info = {
				number: i+1,
				position: "",
				viewport: 'data-viewport="end"',
				url: media[i]
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

	Variant.getSlidesImg = function(callback) {

		var url = "http://basiclines.com/lab/tourapp/slides/";
		var imageExt = ".png";
		var videoExt = ".ogv";

		var hasImages = true;
		var slideImages = 1;
		var slideVideos = 1;
		var videoFetchEnd = false;
		var paths = [];

		function fetchVideo() {
			var video = document.createElement("video");
			video.src = url+slideVideos+videoExt;
			console.log("video url: " + url+slideVideos+videoExt)

			var errorFallback = {};

			video.onloadeddata = function() {
				// Finished video loop, try to found more images
				console.log("video")
				clearTimeout(errorFallback)
			 	paths.push(video.src);
			 	videoFetchEnd = true;
			 	slideImages++;
			 	fetchImages();
			}
			// Don't search for videos name higher that images count
			if ( slideVideos < slideImages + 1 ) {
				errorFallback = setTimeout(function(){
					console.log("video error fallback")
					slideVideos++;
				 	fetchVideo();
				}, 600)
				video.onerror = function() {
					console.log("video onerror")
					clearTimeout(errorFallback)
				 	slideVideos++;
				 	fetchVideo();
				}
			} else {
				// Finished video loop, try to found more images
				console.log("no video")
				clearTimeout(errorFallback)
				videoFetchEnd = true;
			 	slideImages++;
				fetchImages();
			}
		}

		function fetchImages() {
			var image = new Image();
			console.log( "fetch: " + url+slideImages+imageExt)
			image.src = url+slideImages+imageExt;
			image.onload = function() {
				console.log("loaded")
			 	slideImages++;
			 	paths.push(image.src);
			 	fetchImages();
			};
			image.onerror = function() {
				console.log("image error")
				// If we've already fetched the video, create the slides
				if (videoFetchEnd) {
					console.log("createSlides")
					Variant.createSlides(paths, callback);
				} else {
					console.log("fetch Video")
					fetchVideo();
				}
			};
		}

		// Start the fetchs loop
		// When images are fetched, start fetching the video
		fetchImages();

	}

})();
