const key = 'C0glXEYIxSUgeEOGRBxP';
const map = L.map('map').setView([40.7, -73.7], 10); //starting position
const mtLayer = L.maptilerLayer({
    style: "https://api.maptiler.com/maps/77f28370-53d7-4601-a173-79d3de75afde/style.json?key=C0glXEYIxSUgeEOGRBxP",
    geolocate: true
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
} else {
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

    popupContent += '</div>';
    
    const popupOptions = {
        className: 'popup' 
    };
    
    layer.bindPopup(popupContent, popupOptions);
}

// Filter out inactive gardens
function active(feature) {
    return feature.properties.status === "Active";
}

// Function to check if a garden is open now
function isOpenNow(gardenProperties) {
    const now = new Date();

    // Step 1: Check Current Time
    const currentTime = now.getHours() * 60 + now.getMinutes();
    console.log('Current Time (minutes):', currentTime);

    // Step 2: Check Day Key
    const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayKey = ['su', 'm', 'tu', 'w', 'th', 'f', 'sa'][currentDay];
    console.log('Day Key:', dayKey);

    // Construct parsed time keys
    const openTimeKey = `open_time_${dayKey}`;
    const closeTimeKey = `close_time_${dayKey}`;

    if (gardenProperties[openTimeKey]) {
        // Step 3: Check Open and Close Times
        const openTime = parseTime(gardenProperties[openTimeKey]);
        const closeTime = parseTime(gardenProperties[closeTimeKey]);
        
        console.log('Open Time:', openTime);
        console.log('Close Time:', closeTime);

        return currentTime >= openTime && currentTime <= closeTime;
    }

    return false;
}

function parseTime(timeStr) {
    if (timeStr) {
        const match = timeStr.match(/(\d+):(\d+)\s*([ap]?)\.?m?\.?/i);

        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3].toLowerCase();

            let totalMinutes = hours * 60 + minutes;

            if (period === 'p' && hours !== 12) {
                totalMinutes += 12 * 60;
            }

            return totalMinutes;
        }
    }
    return -1; // Return -1 for invalid times
}

// Toggle the filter on and off
let filterActive = false;

// Handle the filter button click
const filterButton = document.getElementById('filterButton');
filterButton.addEventListener('click', function () {
    const currentTime = new Date();
    console.log('Current Time:', currentTime);

    // Filter gardens based on open hours
    axios('data/updatedGarden_data.geojson').then(resp => {
        console.log('Data Loaded:', resp.data);
        const gardens = resp.data.features;

        const activeGardens = gardens.filter(active);
        const filteredGardens = filterActive ? activeGardens : activeGardens.filter(garden => isOpenNow(garden.properties));
        console.log('Filtered Gardens:', filteredGardens);

        // Clear existing layers and add the filtered gardens
        map.eachLayer(layer => {
            if (layer !== mtLayer) {
                map.removeLayer(layer);
            }
        });

        L.geoJSON(filteredGardens, {
            style: { 
                color: 'green', // Border color
                fillColor: 'green', // Fill color
                weight: .5, // Border thickness
                opacity: 0.8, // Border opacity
                fillOpacity: 0.4, // Fill opacity
            },
            onEachFeature: onEachFeature
        }).addTo(map);

        // Update the filter toggle state and button text
        filterActive = !filterActive;
        filterButton.innerText = filterActive ? 'SHOW ALL' : 'OPEN NOW';

    });
});

// Display all active gardens on load
axios('data/updatedGarden_data.geojson').then(resp => {
    const activeGardens = resp.data.features.filter(active);
    console.log('Active Gardens on Load:', activeGardens);
    L.geoJSON(activeGardens, {
        style: { 
            color: 'green', // Border color
            fillColor: 'green', // Fill color
            weight: .5, // Border thickness
            opacity: 0.8, // Border opacity
            fillOpacity: 0.4, // Fill opacity
        },
        onEachFeature: onEachFeature
    }).addTo(map);
});
