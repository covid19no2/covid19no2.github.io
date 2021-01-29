var no2_2019;
var no2_2020;
var projection = ol.proj.get("EPSG:4326");
var map = new ol.Map({
	target: document.getElementById("main"),
	controls: ol.control.defaults({attribution: false}).extend([new ol.control.Attribution({collapsible: true})]),
	interactions : ol.interaction.defaults({doubleClickZoom :false}),
	view: new ol.View({
		projection: projection,
		center: [0, 0],
		zoom: 1,
		maxZoom: 13,
		minZoom: 1,
		extent: [-180, -90, 180, 90]
	}),
	layers: [new ol.layer.Tile({source: new ol.source.OSM()})]
});

var countries = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: "assets/json/countries.geojson",
		format: new ol.format.GeoJSON()
	})
});
map.addLayer(countries);

fetch('images/no2/WorldNO2_2020.tif').then(response => response.arrayBuffer()).then(buffer => {
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
			domain: [-6.4e+14, 2.5e+16],
			colorScale: "hot"
		});
		plot.setClamp(false);
		plot.render();
		no2_2020 = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: canvas.toDataURL("image/png"),
				//imageExtent: [-17005833.3305, -8623957.3634, 16993954.3611, 8173304.3451]
				imageExtent: [-180, -90, 180, 90]
			}),
			extent: [-180, -90, 180, 90],
			opacity: 0.5
		});
		map.addLayer(no2_2020);
	});

	fetch('images/no2/WorldNO2_2019.tif').then(response1 => response1.arrayBuffer()).then(buffer1 => {
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
				domain: [-6.4e+14, 2.5e+16],
				colorScale: "hot"
			});
			plot1.setClamp(false);
			plot1.render();
			no2_2019 = new ol.layer.Image({
				source: new ol.source.ImageStatic({
					url: canvas1.toDataURL("image/png"),
					imageExtent: [-180, -90, 180, 90]
				}),
				extent: [-180, -90, 180, 90],
				opacity: 0.5
			});
			map.addLayer(no2_2019);
		});
	
		var swipe = new ol.control.Swipe();
		map.addControl(swipe);
		swipe.addLayer(no2_2019, true);
		swipe.addLayer(no2_2020, false);
		//map.addLayer(countries);
	});
});

var selected = null;
var highlightStyle = new ol.style.Style({
	fill: new ol.style.Fill({
		color: "rgba(255, 255, 255, 0.7)"
	}),
	stroke: new ol.style.Stroke({
		color: "#3399cc",
		width: 3
	})
});

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");
var overlay = new ol.Overlay({
	element: container,
	autoPan: true,
	autoPanAnimation: {
		duration: 250
	}
});

closer.onclick = function () {
	overlay.setPosition(undefined);
	closer.blur();
	return false;
};

map.addOverlay(overlay);

map.on("pointermove", function (e) {
	if (selected !== null) {
		selected.setStyle(undefined);
		selected = null;
	}
	map.forEachFeatureAtPixel(e.pixel, function (feature) {
		content.innerHTML = "";
		selected = feature;
		feature.setStyle(highlightStyle);
		content.innerHTML += feature.get("name") + "<br>";
		content.innerHTML += "Lockdown: " + feature.get("time") + "<br>";
		content.innerHTML += "Study period: " + feature.get("period");
		overlay.setPosition(e.coordinate);
		return true;
	});
});

map.on("click", function (e) {
	map.forEachFeatureAtPixel(e.pixel, function (feature) {
		let countryName = feature.get("alias");
		let newPage = countryName + ".html";
		window.location.href = newPage;
	})
});
