console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 11); 
//geojson.io for  lat// 
//stamen for basemap layers//

let basemap_urls = {
    toner:"https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
    osm:'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
}

L.tileLayer(basemap_urls.toner, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.gardenname);
    }

axios('data/GreenThumb Garden Info.geojson').then(resp => {
    console.log(resp.data)
    L.geoJSON(resp.data,{
        style: {color: "green"},
        onEachFeature: onEachFeature
    })
    .addTo(map);
});
