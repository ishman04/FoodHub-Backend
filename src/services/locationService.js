const axios = require('axios');
const polyline = require('@mapbox/polyline');

const activeSimulations = new Map();

async function getRouteFromOSRM(startCoords, endCoords) {
    // ... (This function does not need any changes)
    const start = `${startCoords.longitude},${startCoords.latitude}`;
    const end = `${endCoords.longitude},${endCoords.latitude}`;
    const url = `http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=polyline`;
    try {
        const response = await axios.get(url);
        if (response.data?.routes?.[0]) {
            const route = response.data.routes[0];
            const decodedPolyline = polyline.decode(route.geometry);
            return {
                points: decodedPolyline,
                duration: route.duration,
                distance: route.distance,
            };
        }
        return null;
    } catch (error) {
        console.error("[OSRM] Error fetching route:", error.message);
        return null;
    }
}

async function simulateDriverLocation(io, roomName, startCoords, endCoords) {
    if (activeSimulations.has(roomName)) {
        return;
    }

    const routeData = await getRouteFromOSRM(startCoords, endCoords);
    if (!routeData) {
        io.to(roomName).emit('tracking_error', { message: 'Could not calculate a delivery route.' });
        return;
    }

    // --- KEY CHANGE: Store route data before starting the interval ---
    const simulationData = {
        route: routeData.points,
        duration: routeData.duration,
        distance: routeData.distance,
        intervalId: null, // We'll store the interval ID here
        currentPointIndex: 0,
    };

    // Emit the initial tracking data to anyone already in the room
    io.to(roomName).emit('trackingStarted', {
        route: simulationData.route,
        duration: simulationData.duration,
        distance: simulationData.distance,
    });
    
    const intervalId = setInterval(() => {
        const sim = activeSimulations.get(roomName);
        if (!sim || sim.currentPointIndex >= sim.route.length) {
            clearInterval(intervalId);
            activeSimulations.delete(roomName);
            io.to(roomName).emit('journeyEnded', { message: 'Driver has arrived!' });
            return;
        }

        const point = sim.route[sim.currentPointIndex];
        const newLocation = { lat: point[0], lng: point[1] };
        
        io.to(roomName).emit('locationUpdate', newLocation);
        sim.currentPointIndex++;
    }, 2000);

    // Store the interval ID in our simulation data
    simulationData.intervalId = intervalId;
    activeSimulations.set(roomName, simulationData);
    console.log(`[Simulation] Started for room ${roomName}`);
}

// --- NEW EXPORTED FUNCTION ---
// This function will be called from index.js when a user joins a room.
function resendRouteToLateJoiner(io, socket, roomName) {
    if (activeSimulations.has(roomName)) {
        const sim = activeSimulations.get(roomName);
        console.log(`[Simulation] Late joiner detected for ${roomName}. Resending route data.`);
        // Use socket.emit to send only to the user who just joined
        socket.emit('trackingStarted', {
            route: sim.route,
            duration: sim.duration,
            distance: sim.distance,
        });
    }
}

module.exports = {
    simulateDriverLocation,
    resendRouteToLateJoiner // <-- Export the new function
};