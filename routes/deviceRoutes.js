const router = require("express").Router();
const {
	registerDevice,
	getDevices,
	updateDevice,
	deleteDevice,
	heartbeatDevice,
} = require("../controllers/deviceController");
const {
	addLogEntry,
	getLogs,
	getUsage,
} = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes
router.use(authMiddleware);

// Add a log entry for a device
router.post("/:id/logs", addLogEntry);

// Get log entries for a device
router.get("/:id/logs", getLogs);

// Get usage data for a device
router.get("/:id/usage", getUsage);

// Update device heartbeat (last_active_at)
router.post("/:id/heartbeat", heartbeatDevice);

// Register a new device
router.post("/", registerDevice);

// List all devices
router.get("/", getDevices);

// Update device details
router.patch("/:id", updateDevice);

// Remove a device
router.delete("/:id", deleteDevice);

module.exports = router;
