var webmap = L.map
		(
			"webmap",
			{
				center: [54.89, 20.59],
				crs: L.CRS.EPSG3857,
				zoom: 5,
				minZoom: 3,
				zoomControl: true,
				preferCanvas: false,
				worldCopyJump: true,
			}
		);