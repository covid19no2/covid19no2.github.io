var no2_2019;
var no2_2020;
proj4.defs("EPSG:4240", "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +no_defs");
ol.proj.proj4.register(proj4);
var projection = new ol.proj.Projection({
	code: "EPSG:4240",
	extent: ol.proj.transformExtent([90, 0, 115, 24], "EPSG:4326", "EPSG:4240")
});
var map = new ol.Map({
	target: document.getElementById("map"),
	controls: ol.control.defaults({attribution: false}).extend([new ol.control.Attribution({collapsible: true})]),
	view: new ol.View({
		projection: projection,
		center: ol.proj.fromLonLat([102.5, 12], "EPSG:4240"),
		zoom: 1,
		maxZoom: 12,
		minZoom: 1,
		extent: ol.proj.transformExtent([90, 0, 115, 24], "EPSG:4326", "EPSG:4240")
	}),
	layers: [new ol.layer.Tile({source: new ol.source.OSM()})]
});

fetch('images/no2/ThailandNO2_2020.tif').then(response => response.arrayBuffer()).then(buffer => {
	let parser = GeoTIFF.parse(buffer);
	let image = parser.getImage();
	let plot;
	image.readRasters({
		window: [0, 0, image.getWidth(), image.getHeight()],
		samples: [0]
	}, function (rasters) {
		let canvas = document.createElement("canvas");
		plot = new plotty.plot({
			canvas: canvas,
			data: rasters[0],
			width: image.getWidth(),
			height: image.getHeight(),
			domain: [0, 5e+15],
			colorScale: "turbo"
		});
		plot.setClamp(false);
		plot.render();
		no2_2020 = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: canvas.toDataURL("image/png"),
				imageExtent: [97.3214, 5.6072, 105.6711, 20.4915]
			}),
			extent: [97.3214, 5.6072, 105.6711, 20.4915],
			opacity: 0.5
		});
		map.addLayer(no2_2020);
	});

	fetch('images/no2/ThailandNO2_2019.tif').then(response1 => response1.arrayBuffer()).then(buffer1 => {
		let parser1 = GeoTIFF.parse(buffer1);
		let image1 = parser1.getImage();
		let plot1;
		image1.readRasters({
			window: [0, 0, image1.getWidth(), image1.getHeight()],
			samples: [0]
		}, function (rasters) {
			let canvas1 = document.createElement("canvas");
			plot1 = new plotty.plot({
				canvas: canvas1,
				data: rasters[0],
				width: image1.getWidth(),
				height: image1.getHeight(),
				domain: [0, 5e+15],
				colorScale: "turbo"
			});
			plot1.setClamp(false);
			plot1.render();
			no2_2019 = new ol.layer.Image({
				source: new ol.source.ImageStatic({
					url: canvas1.toDataURL("image/png"),
					imageExtent: [97.3214, 5.6072, 105.6711, 20.4915]
				}),
				extent: [97.3214, 5.6072, 105.6711, 20.4915],
				opacity: 0.5
			});
			map.addLayer(no2_2019);
		});
	
		var swipe = new ol.control.Swipe();
		map.addControl(swipe);
		swipe.addLayer(no2_2019, true);
		swipe.addLayer(no2_2020, false);
	});
});
