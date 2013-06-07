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

	// Dynamic generate slides
	Variant.createSlides = function(img) {
		console.log(img)

		var tpl = '<section id="slide-#number#" class="slide #position#" role="region" #viewport#>'+
					'<img src="#url#">'+
				  '</section>';

		var htmlBuffer = "";
		var pathsBuffer = [];

		for (var i = 0; i < img.length; i++) {
			var info = {
				number: i+1,
				position: "",
				viewport: 'data-viewport="end"',
				url: img[i]
			}

			if (info.number == 1) {
				info.position = "current";
				info.viewport = '';
			}

			if (info.number == 2) {
				info.position = "next";
			}

			var slideHtml = Variant.parseTemplate(tpl, info);
			htmlBuffer += slideHtml;
			pathsBuffer.push(info.url);
		}

		dom.context.innerHTML = htmlBuffer;

		// Save data if was not saved before
		if (!localStorage.getItem("images")) {
			localStorage.setItem("images", pathsBuffer.join(","));
		}

		// Give some time b2g to paint th htmlBuffer
		var delay = setTimeout(function(){
			dom.loading.classList.add("hidden");
		}, 50);
	}

	Variant.getSlidesImg = function(variant) {
		// Save choice
		localStorage.setItem("variant", variant);

		var url = "http://basiclines.com/lab/tourapp/variants/"+variant+"/";
		var imageExt = ".png";
		var videoExt = ".ogv";

		var hasImages = true;
		var slide = 1;
		var images = [];

		function fetch() {
			var image = new Image();
			image.src = url+slide+imageExt;
			image.onload = function() {
			 	slide++;
			 	images.push(image.src);
			 	fetch();
			};
			image.onerror = function() {
				console.log("404 image")
				// This means we've finalized fetching images
				Variant.createSlides(images);
			};
		}

		// Start the fetch loop
		fetch();
	}

})();
