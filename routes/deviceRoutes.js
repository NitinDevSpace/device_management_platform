const router = require("express").Router();
const {
	registerDevice,
	getDevices,
	updateDevice,
	deleteDevice,
	heartbeatDevice,
} = require("../controllers/deviceController");
const authMiddleware = require("../middleware/authMiddleware");

//Protect all routes
router.use(authMiddleware);

//register a new device
router.post("/", registerDevice);

//list devices
router.get("/", getDevices);

// Update device Details
router.patch("/:id", updateDevice);

//Remove device
router.delete("/:id", deleteDevice);

// update last_active-at
router.post("/:id/heartbeat", heartbeatDevice);

module.exports = router;
