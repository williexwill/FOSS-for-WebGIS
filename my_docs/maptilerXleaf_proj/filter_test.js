// Sample garden data with open hours for testing
const sampleGardens = [
    {
        "type": "Feature",
        "properties": {
            "open_time_su": "11:00a",
            "close_time_su": "3:00p",
            "open_time_m": "9:00a",
            "close_time_m": "5:00p",
            "open_time_tu": "10:00a",
            "close_time_tu": "4:00p",
            "open_time_w": "8:00a",
            "close_time_w": "6:00p",
            "open_time_th": "12:00p",
            "close_time_th": "8:00p",
            "open_time_f": "1:00p",
            "close_time_f": "9:00p",
            "open_time_sa": "10:00a",
            "close_time_sa": "6:00p"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-73.944, 40.705]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "open_time_su": "1:00p",
            "close_time_su": "6:00p",
            "open_time_m": "9:00a",
            "close_time_m": "4:00p",
            "open_time_tu": "10:00a",
            "close_time_tu": "4:00p",
            "open_time_w": "8:00a",
            "close_time_w": "6:00p",
            "open_time_th": "12:00p",
            "close_time_th": "8:00p",
            "open_time_f": "1:00p",
            "close_time_f": "9:00p",
            "open_time_sa": "10:00a",
            "close_time_sa": "6:00p"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-73.941, 40.703]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "open_time_su": null,
            "close_time_su": null,
            "open_time_m": null,
            "close_time_m": null,
            "open_time_tu": null,
            "close_time_tu": null,
            "open_time_w": null,
            "close_time_w": null,
            "open_time_th": null,
            "close_time_th": null,
            "open_time_f": null,
            "close_time_f": null,
            "open_time_sa": null,
            "close_time_sa": null
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-73.940, 40.799]
        }
    }
];


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

// Test the "open now" filter
console.log('Gardens Open Now:');
sampleGardens.forEach(garden => {
    if (isOpenNow(garden.properties)) {
        console.log(garden.properties);
    }
});