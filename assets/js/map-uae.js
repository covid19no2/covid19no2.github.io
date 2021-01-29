var no2_2019;
var no2_2020;
proj4.defs("EPSG:27040", "+proj=utm +zone=40 +ellps=clrk80 +towgs84=-242.2,-144.9,370.3,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var projection = new ol.proj.Projection({
	code: "EPSG:27040",
	extent: ol.proj.transformExtent([50, 20, 60, 28], "EPSG:4326", "EPSG:27040")
});
var map = new ol.Map({
	target: document.getElementById("map"),
	controls: ol.control.defaults({attribution: false}).extend([new ol.control.Attribution({collapsible: true})]),
	view: new ol.View({
		projection: projection,
		center: ol.proj.fromLonLat([55, 24], "EPSG:27040"),
		zoom: 1,
		maxZoom: 12,
		minZoom: 1,
		extent: ol.proj.transformExtent([50, 20, 60, 30], "EPSG:4326", "EPSG:27040")
	}),
	layers: [new ol.layer.Tile({source: new ol.source.OSM()})]
});

fetch('images/no2/UAENO2_2020.tif').then(response => response.arrayBuffer()).then(buffer => {
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
			domain: [0, 8.01e+15],
			colorScale: "turbo"
		});
		plot.setClamp(false);
		plot.render();
		no2_2020 = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: canvas.toDataURL("image/png"),
				imageExtent: [-62428.5494, 2501222.1574, 437816.1094, 2895843.3105]
			}),
			extent: [-62428.5494, 2501222.1574, 437816.1094, 2895843.3105],
			opacity: 0.5
		});
		map.addLayer(no2_2020);
	});

	fetch('images/no2/UAENO2_2019.tif').then(response1 => response1.arrayBuffer()).then(buffer1 => {
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
				domain: [0, 8.01e+15],
				colorScale: "turbo"
			});
			plot1.setClamp(false);
			plot1.render();
			no2_2019 = new ol.layer.Image({
				source: new ol.source.ImageStatic({
					url: canvas1.toDataURL("image/png"),
					imageExtent: [-62428.5494, 2501222.1574, 437816.1094, 2895843.3105]
				}),
				extent: [-62428.5494, 2501222.1574, 437816.1094, 2895843.3105],
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
