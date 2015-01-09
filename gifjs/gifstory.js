var build_gifstory = function(unikid,basePath) {
	var W = 350;
	var H = 200;
	var minOp = 0.3;
	var maxOp = 0.9;
	var listloc = basePath + "/giflist.tsv";
	var imagesFold = basePath + "/ims/";

	window.onload = function() {
		console.log("Loading gifs: "+basePath);
		
		d3.tsv(listloc,function(dat) {
			var giflist = d3.select(unikid).style("text-align","center").selectAll("div")
				.data(dat)
				.enter().append("div")
					.attr("class","gifstory_agif")
					.attr("id",function(d,i){return "gif_"+i;});
			
			// !!!!!!!! break line every %2
			giflist.each(function(d,i) {
				console.log("numero:"+i);
				if(i%2==0 && i!=0) d3.select(unikid).insert("br","#gif_"+i);
			});
					
			var agifimg	= giflist.append("div").attr("class","agifimg");
			agifimg.each(function(d,i) {
				var me = d3.select(this);
				if(d['bubbles']) {
					var bubbles = d['bubbles'].split("|");
					for(e in bubbles) {
						var bvals = bubbles[e].split(";");
						var sx = bvals[0]+"px";
						var sy = bvals[1]+"px";
						if (bvals[0]<1) {
							sx = bvals[0]*W+"px";
							sy = bvals[1]*H+"px";
						}
						me.append("div").attr("class","agifbubble")
							.style("opacity",0)
							//.style("width", function(d,i){ return 2+bvals[2].length*5 +"px"; })
							.style("left", function(d,i){ return sx; })
							.style("top", function(d,i){ return sy; })
							.text(function(d,i){ return bvals[2]; });		
					};
				}
			});

			agifimg.append("img")
				.style("opacity",minOp)
				.attr("src",function(d,i){
					if( /\./.test(d['file']) ) // if containing ., already have extension
						var impath = imagesFold+d['file'];
					else // else, add .jpg
						var impath = imagesFold+d['file']+".jpg";
					return impath;
				});
				
			giflist.append("div").attr("class","agiflegend")
				.style("opacity",0)
				.text(function(d,i){
					var capt = d['descr'];
					//if(capt==null|capt=="") return d['file'].replace(/\.[^/.]+$/, "");
					//else
					return capt;
					});		

			// setting rollover/clic to switch jpg/gif
			d3.selectAll(unikid+" .gifstory_agif")
				.on("click", function(d,i) {
					d3.select(this).selectAll(".agifbubble").style("opacity",maxOp);
					d3.select(this).select(".agiflegend").style("opacity",maxOp);
					var theim = d3.select(this).select("img");
					theim.style("opacity",1);
					// first test if gif exists, if not, do nothing
					theim.attr("onerror","this.src='"+imagesFold+d['file']+"'" );
					theim.attr("src", imagesFold+d['file'].replace(/\.[^/.]+$/, "")+".gif" );
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
