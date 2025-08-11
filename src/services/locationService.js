const activeSimulations = new Map();

/**
 * Simulates a driver's journey from start to end coordinates.
 * @param {object} io - The Socket.IO server instance.
 * @param {string} roomName - The name of the room to broadcast to (e.g., "order_XYZ").
 * @param {object} startCoords - The starting coordinates ({ latitude, longitude }).
 * @param {object} endCoords - The ending coordinates ({ latitude, longitude }).
 */
function simulateDriverLocation(io, roomName, startCoords, endCoords) {
    // Prevent starting a simulation if one is already active for this room
    if (activeSimulations.has(roomName)) {
        console.log(`[Location Service] Simulation for ${roomName} is already running.`);
        return;
    }

    console.log(`[Location Service] Starting simulation for room: ${roomName}`);
    console.log(`[Location Service] Journey from ${JSON.stringify(startCoords)} to ${JSON.stringify(endCoords)}`);

    let currentStep = 0;
    const totalSteps = 100; // The journey will be divided into 100 steps

    // Create an interval that runs every 3 seconds
    const simulationInterval = setInterval(() => {
        currentStep++;

        // If the journey is complete
        if (currentStep > totalSteps) {
            clearInterval(simulationInterval); // Stop the interval
            activeSimulations.delete(roomName); // Remove it from the active list
            console.log(`[Location Service] Simulation ended for ${roomName}`);
            io.to(roomName).emit('journeyEnded', { message: 'Driver has arrived!' });
            return;
        }

        // Calculate the progress of the journey (from 0.01 to 1.0)
        const progress = currentStep / totalSteps;

        // Use linear interpolation to calculate the new coordinates
        const lat = startCoords.latitude + (endCoords.latitude - startCoords.latitude) * progress;
        const lng = startCoords.longitude + (endCoords.longitude - startCoords.longitude) * progress;
        
        const newLocation = { lat, lng };

        // Broadcast the new location to all clients in the specific order room
        console.log(`[Location Service] Emitting 'locationUpdate' to room ${roomName}:`, newLocation);
        io.to(roomName).emit('locationUpdate', newLocation);

    }, 3000); // Update location every 3 seconds

    // Store the interval so we can manage it
    activeSimulations.set(roomName, simulationInterval);
}

module.exports = {
    simulateDriverLocation
};