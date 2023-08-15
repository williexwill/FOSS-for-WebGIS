const key = 'C0glXEYIxSUgeEOGRBxP';
const map = L.map('map').setView([40.7, -73.7], 10); //starting position
const mtLayer = L.maptilerLayer({
    style: "https://api.maptiler.com/maps/77f28370-53d7-4601-a173-79d3de75afde/style.json?key=C0glXEYIxSUgeEOGRBxP",
    geolocate:true
    }).addTo(map);

// Locate user and center map on their location    
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        },
        (error) => {
            console.error('Error getting user location:', error.message);
        }
        );
    }
    else {
        console.error('Geolocation is not supported by your browser.');
      }

// Create a pop up with name and public hours of the garden
function onEachFeature(feature, layer) {
    let popupContent = '<strong>' + feature.properties.gardenname + '</strong>';
    
    if (feature.properties.openhrssu !== null) {
        popupContent += "<br>" + "Sunday: " + feature.properties.openhrssu;
    }
    
    if (feature.properties.openhrsm !== null) {
        popupContent += "<br>" + "Monday: " + feature.properties.openhrsm;
    }
    
    if (feature.properties.openhrstu !== null) {
        popupContent += "<br>" + "Tuesday: " + feature.properties.openhrstu;
    }
    
    if (feature.properties.openhrsw !== null) {
        popupContent += "<br>" + "Wednesday: " + feature.properties.openhrsw;
    }
    
    if (feature.properties.openhrsth !== null) {
        popupContent += "<br>" + "Thursday: " + feature.properties.openhrsth;
    }
    
    if (feature.properties.openhrsf !== null) {
        popupContent += "<br>" + "Friday: " + feature.properties.openhrsf;
    }
    
    if (feature.properties.openhrssa !== null) {
        popupContent += "<br>" + "Saturday: " + feature.properties.openhrssa;
    }
    
    layer.bindPopup(popupContent);
}

//Filter out inactive gardens
function active(feature) {
  if (feature.properties.status === "Active") return true
}

// Add garden outlines to the map
axios('data/updatedGarden_data.geojson').then(resp => {
    console.log(resp.data)
    L.geoJSON(resp.data,{
        filter: active,
        style: {color: "green"},
        onEachFeature: onEachFeature
        })
        .addTo(map);
    });







