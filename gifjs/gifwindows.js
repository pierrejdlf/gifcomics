var build_gifwindows = function(unikid,basePath) {

	var minOp = 0.3;
	var maxOp = 1.0;
	var DURSLIDE = 700;
	var DURJPG = 5000;
	var listloc = basePath + "/giflist.tsv";
	var imagesFold = basePath + "/ims/";
	var CURLAYER = 0;
	
	var loadTheSrcOf = function(n) {
		d3.selectAll("#gif_"+n+" img.isjpg").attr("src", function(d,i){ return imagesFold+d['file'];} );
		d3.selectAll("#gif_"+n+" img.isgif")
			.attr("src", function(d,i){ return imagesFold+d['file'].replace(/\.[^/.]+$/, "")+".gif";} )
			.attr("onerror",function(d,i){ return "this.src='"+imagesFold+d['file']+"'";} );
	};

	window.onload = function() {
		console.log("Loading gifs: "+basePath);
		d3.tsv(listloc,function(dat) {
			
			var basediv = d3.select(unikid).style("text-align","center")
			
			for (var K=0;K<=1;K=K+1) {
				var gifbox = basediv.append("div").attr("class","gifwindows_gifbox").attr("id","gifbox_"+K);
					
				var giflist = gifbox.selectAll("div")
					.data(dat.filter(function(d,i){return i%2==K;}))
					.enter().append("div")
						.style("z-index",function(d,i){return 999-i;})
						.attr("class","gifwindows_agif")
						.attr("id",function(d,i){return "gif_"+i;});
				
				// filling gif boxes
				var agifimg	= giflist.append("div").attr("class","agifimg");
				
				// making (now hidden) bubbles
				agifimg.each(function(d,i) {
					var me = d3.select(this);
					if(d['bubbles']) {
						var bubbles = d['bubbles'].split("|");
						for(e in bubbles) {
							var bvals = bubbles[e].split(";");
							me.append("div").attr("class","agifbubble")
								.style("opacity",0)
								.style("width", function(d,i){ return 8+bvals[2].length*5.4 +"px"; })
								.style("left", function(d,i){ return bvals[0]+"px"; })
								.style("top", function(d,i){ return bvals[1]+"px"; })
								.text(function(d,i){ return bvals[2]; });		
						};
					}
				});
				
				// making 2 layers : jpg + gif
				// we don't put src jpeg/gifs now, we'll do it later poco a poco
				agifimg.append("img")
					.style("opacity",maxOp)
					.attr("class","isgif")
					.attr("src",function(d,i){ return "";});
				agifimg.append("img")
					.style("opacity",maxOp)
					.attr("class","isjpg")
					.attr("src",function(d,i){ return "";});

				
				// hidden legend on bottom
				giflist.append("div").attr("class","agiflegend")
					.style("opacity",0)
					.text(function(d,i){ return d['descr']; });		
			}
			
			// showing first ones
			loadTheSrcOf(0);
			giffirst = d3.selectAll("#gif_0");
			giffirst.select(".isjpg").transition().duration(DURJPG).style("opacity",0).remove();
			giffirst.selectAll(".agifbubble").style("opacity",maxOp);
			giffirst.select(".agiflegend").style("opacity",maxOp)
			
			loadTheSrcOf(1);
			//loadTheSrcOf(2);
						
			// setting mouse interaction to switch from one gif to the next one
			d3.selectAll(unikid+" .gifwindows_gifbox")
				.on("click", function(d,i) {
					console.log("clicked, current layer is:"+CURLAYER);
					if(CURLAYER<=dat.length/2) {
						var gifcurrent = d3.selectAll("#gif_"+CURLAYER);
						var gifnext = d3.selectAll("#gif_"+(CURLAYER+1));
						
						// remove the current gif (next one is already available)
						gifcurrent.selectAll(".agifbubble").remove();
						gifcurrent.select(".agiflegend").remove();
						d3.selectAll("#gifbox_0 #gif_"+CURLAYER+" .isgif").transition().duration(DURSLIDE).style("left","-350px").remove();
						d3.selectAll("#gifbox_1 #gif_"+CURLAYER+" .isgif").transition().duration(DURSLIDE).style("left","+350px").remove();
						
						// we load the next stack jpg+gif
						loadTheSrcOf(CURLAYER+2);
						gifnext.selectAll(".agifbubble").style("opacity",maxOp);
						gifnext.select(".agiflegend").style("opacity",0).transition().duration(DURSLIDE).style("opacity",maxOp);
						gifnext.select(".isjpg").transition().duration(DURJPG).style("opacity",0).remove();
						gifnext.select(".isgif").style("opacity",maxOp);
						
						CURLAYER += 1;
					} else {
						console.log("llego at the end");
					}	
				});
				
/*
			d3.selectAll(unikid+" .agif")
				.on("mouseout", function(d,i) {
					d3.select(this).selectAll(".agifbubble").style("opacity",0);
					d3.select(this).select(".agiflegend").style("opacity",0);
					d3.select(this).select("img").style("opacity",minOp);
					d3.select(this).select("img").attr("src", imagesFold+d['file']+".jpg" );
				});
*/
		});
	}
};

