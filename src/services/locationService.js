const axios = require('axios'); // <-- ENSURE THIS IS AT THE TOP
const polyline = require('@mapbox/polyline');

const activeSimulations = new Map();

/**
 * Gets a driving route from the OSRM API.
 * @param {object} startCoords - The starting coordinates ({ latitude, longitude }).
 * @param {object} endCoords - The ending coordinates ({ latitude, longitude }).
 * @returns {Array|null} An array of [latitude, longitude] points, or null if failed.
 */
async function getRouteFromOSRM(startCoords, endCoords) {
    // OSRM wants coordinates in {longitude},{latitude} format
    const start = `${startCoords.longitude},${startCoords.latitude}`;
    const end = `${endCoords.longitude},${endCoords.latitude}`;
    
    // Using the free public OSRM demo server
    const url = `http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=polyline`;

    try {
        console.log(`[OSRM] Fetching route from: ${url}`);
        const response = await axios.get(url);
        
        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const encodedPolyline = response.data.routes[0].geometry;
            // Decode the polyline into an array of [lat, lng] coordinates
            const decodedRoute = polyline.decode(encodedPolyline);
            console.log(`[OSRM] Successfully fetched and decoded route with ${decodedRoute.length} points.`);
            return decodedRoute;
        }
        return null;
    } catch (error) {
        console.error("[OSRM] Error fetching route:", error.message);
        return null;
    }
}



/**
 * Simulates a driver's journey from start to end coordinates.
 * @param {object} io - The Socket.IO server instance.
 * @param {string} roomName - The name of the room to broadcast to (e.g., "order_XYZ").
 * @param {object} startCoords - The starting coordinates ({ latitude, longitude }).
 * @param {object} endCoords - The ending coordinates ({ latitude, longitude }).
 */
async function simulateDriverLocation(io, roomName, startCoords, endCoords) {
    // Prevent starting a simulation if one is already active for this room
    if (activeSimulations.has(roomName)) {
        console.log(`[Location Service] Simulation for ${roomName} is already running.`);
        return;
    }

   const routePoints = await getRouteFromOSRM(startCoords, endCoords);

    // If we couldn't get a route, don't start the simulation
    if (!routePoints || routePoints.length === 0) {
        console.error(`[Location Service] Could not get a valid route for ${roomName}. Aborting simulation.`);
        // Optionally, you could emit an error to the client here
        // io.to(roomName).emit('tracking_error', { message: 'Could not calculate delivery route.' });
        return;
    }
    // --- END: NEW OSRM LOGIC ---

    console.log(`[Location Service] Starting simulation for room: ${roomName} along a path of ${routePoints.length} points.`);

    let currentPointIndex = 0;

    const simulationInterval = setInterval(() => {
        // If we've reached the end of the route
        if (currentPointIndex >= routePoints.length) {
            clearInterval(simulationInterval);
            activeSimulations.delete(roomName);
            console.log(`[Location Service] Simulation ended for ${roomName}`);
            io.to(roomName).emit('journeyEnded', { message: 'Driver has arrived!' });
            return;
        }

        // Get the next point from the route array
        const point = routePoints[currentPointIndex];
        const newLocation = { lat: point[0], lng: point[1] };
        
        // Broadcast the new location to all clients in the specific order room
        console.log(`[Location Service] Emitting point ${currentPointIndex + 1}/${routePoints.length} to room ${roomName}:`, newLocation);
        io.to(roomName).emit('locationUpdate', newLocation);

        currentPointIndex++; // Move to the next point for the next interval

    }, 2000); // We can make the interval faster for a smoother animation on a detailed path

    activeSimulations.set(roomName, simulationInterval);
}


module.exports = {
    simulateDriverLocation
};