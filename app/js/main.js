/* ========================================================================= */
/* VARIABLES =============================================================== */
/* ========================================================================= */

var checkedBoxes = 0,
	round = [],
	results = [],
	tour;

/* ========================================================================= */
/* HELPERS ================================================================= */
/* ========================================================================= */

Handlebars.registerHelper('getCategory', function (id) {
	return _.findWhere(categories, {_id: id});
});

Handlebars.registerHelper('getItem', function (id) {
	return _.findWhere(items, {_id: id});
});

Handlebars.registerHelper('equals', function(a,b){
	return a == b;
});

trimInput = function(value) {
	return value.replace(/^\s*|\s*$/g, '');
};

/* ========================================================================= */
/* FUNCTIONS =============================================================== */
/* ========================================================================= */

var siteHandler = {
	/**
	 * Carga un template con los datos que recibe como parámetro.
	 *
	 * @param  {String}  name    	- Nombre del fichero .hbs donde se encuentra el template
	 * @param  {String}  where   	- Selector CSS donde vamos a insertar el template
	 * @param  {Object}	 context	- Objeto con los datos que va a utilizar el template
	 * @param  {Boolean} append  	- Si es true inserta el template al final de un contenedor para no borrar su contenido
	 */
	loadTemplate: function(name, where, context, append) {
		var location = where || '#' + name,
			data = context,
			template = JST['app/templates/' + name + '.hbs'],
			html = template(data);

		if (append)
			$(location).append(html);
		else
			document.querySelector(location).innerHTML = html;
	},
	/**
	 * Establece los eventos de la app
	 */
	setEvents: {
		/**
		 * Al hacer click sobre una caja se muestra un modal con su contenido (items).
		 * Si la caja ha sido comprobada se ocultará al cerrar el modal.
		 */
	},
	init: function() {
		this.loadTemplate('home', '#mainWrapper');

		mapboxgl.util.getJSON('https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v6.json', function(err,style){
			if (err) throw err;

			style.layers.push({
				"id": "markers",
			    "type": "symbol",
			    "source": "markers",
			    "layout": {
			      "icon-image": "{marker-symbol}-12",
			      "text-field": "{title}",
			      "text-font": "Open Sans Semibold, Arial Unicode MS Bold",
			      "text-offset": [0, 0.6],
			      "text-anchor": "top"
			    },
			    "paint": {
			      "text-size": 12,
			      "text-halo-color": "white",
			      "text-halo-width": 2
			    }
			});
			mapboxgl.accessToken = 'pk.eyJ1IjoiYXlvemVtaXRjYW5ldCIsImEiOiJBd0VOLTZjIn0.A4XIkQqKKcCp6pvhrFidVA';
			var map = new mapboxgl.Map({
				container: 'map',
				style: style,
				center: [28.0779, -16.1676],
				zoom: 11,
				// causes pan & zoom handlers not to be applied, similar to
				// .dragging.disable() and other handler .disable() funtions in Leaflet.
				interactive: true,
				hash:true
			});
			var file = 'js/geojson/vieja.geojson';
			mapboxgl.util.getJSON(file, function(err,data){
				map.on('click', function(e){
				  console.log(e);
				});
				var geojson = data;
				var markers = new mapboxgl.GeoJSONSource({data: geojson });
				map.addSource('markers',markers);
				console.log(map.sources);
				console.log(style);
				map.addControl(new mapboxgl.Navigation());
				//map.style.addClass('night');
			});

		});

		function lanesStyle(err, style){

		}

	}
};

siteHandler.init();
