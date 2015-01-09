var killinglock = false;

var build_giffullscreen = function(unikid,basePath) {

	var listloc = basePath + "/giflist.tsv";
	var imagesFold = basePath + "/ims/";

	var DURSLIDE = 600;
	var THEGIFLINES = null;
	var WIDTH = 0;
	var HEIGHT = 0;

	var currentIndex = 2;
	var thebox = null;
		
	var addImageBehind = function(i,line) {
		var path = imagesFold+line['file']
		console.log("adding file: "+path);
		var agif = thebox.append("div")
			.attr("class","giffullscreen_agif")
			.attr("id",i);
		var im = agif.append("img").attr("src",path).style("z-index",1000-i);
		if(line['bubbles']) {
			var bubbles = line['bubbles'].split("|");
			for(e in bubbles) {
				var bvals = bubbles[e].split(";");
				agif.append("div")
					.style("opacity",0.7)
					.style("width", function(d,i){ return 8+bvals[2].length*5.4 +"px"; })
					.style("left", function(d,i){ return bvals[0]*WIDTH+"px"; })
					.style("top", function(d,i){ return bvals[1]*HEIGHT+"px"; })
					.style("z-index",1000-i)
					.text(function(d,i){ return bvals[2]; });
			}
		}
		/*var svg = agif.append("svg:svg");
		var im = svg.append("g").append("svg:image")
			.attr("xlink:href",path)
			.attr("x",0)
			.attr("y",0)
			.attr("width","100%")
			.attr("height","100%");
			//.attr("clip-path", "url(#clipper)");
		*/
		im.style("opacity",0).transition().duration(DURSLIDE).style("opacity",0.2);
	};
	var refreshOpacityOfIms = function(kX,kY) {
		d3.selectAll(unikid+" .giffullscreen_agif").each(function() {
			var i = d3.select(this).attr("id");
			var op = 1;
			if(i%2==0) op=0.5+kX;
			if(i%2==1) op=1-kX;
/*
			if(i%4==2) op=0.5+kY;
			if(i%4==3) op=1-kY;
*/
			d3.select(this).select("img").style("opacity",op);
			//console.log("set to:"+kX+" "+kY);	
		});
		d3.selectAll("svg image").style("opacity",1);
	};
	
	window.onload = function() {
		console.log("Loading gifs: "+basePath);
		
		d3.tsv(listloc,function(dat) {
			thebox = d3.select(unikid).style("text-align","center")
				.append("div").attr("class","giffullscreen_wrapper").style("height",d3.select(".giffullscreen_wrapper").style("width").replace("px","")*(20/35)+"px")
				.append("div").attr("class","giffullscreen_container");
			
			THEGIFLINES = dat;
			WIDTH = d3.select(".giffullscreen_wrapper").style("width").replace("px","");
			HEIGHT = WIDTH*(20/35);

			// function to move forward !
			var moveForward = function() {
				if(!killinglock) {
					killinglock = true;
					// slide out the first image
					var curwidth = d3.select(".giffullscreen_agif").style("width");
					var thediv = d3.select(".giffullscreen_agif");
					thediv.selectAll("div").transition().duration(DURSLIDE).style("opacity",0).remove();
					thediv.select("img").transition().duration(DURSLIDE).style("opacity",0)
						.each("end",function(){
							thediv.remove();
							killinglock = false;
						});
					addImageBehind(currentIndex,THEGIFLINES[currentIndex]);
					currentIndex+=1;
				}
				refreshOpacityOfIms(0.4,1);
			};	
			// building first layers
			for(var n=0;n<2;n=n+1) addImageBehind(n,THEGIFLINES[n]);
			
			// we can move forward automatically (remove current + add next)
			setInterval(moveForward,700);
			
			// or setting mouse clic to do it manually
/*
			d3.selectAll(unikid+" .giffullscreen_container")
				.on("click", function(d,i) {
					moveForward();
				});
*/
			
			// set opacity
			//refreshOpacityOfIms(1,0.2);
			
			// set opacity by mouse
/*
			d3.select(unikid+" .giffullscreen_container").on("mousemove",function(){
				var coeff = 2;
				var curwidth = d3.select(".giffullscreen_agif").style("width").replace("px","");
				var curheight = curwidth*(20/35);
				var kX = d3.mouse(this)[0]/(curwidth*coeff);
				var kY = d3.mouse(this)[1]/(curheight*coeff);
				refreshOpacityOfIms(kX,kY);
			});
*/
		});
	}
};
