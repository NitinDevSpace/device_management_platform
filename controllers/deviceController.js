const Device = require("../models/deviceModel");

// Register a new device
exports.registerDevice = async (req, res) => {
	try {
		const { name, type, status } = req.body;
		const owner_id = req.user.userId;

		if (!name || !type) {
			return res
				.status(400)
				.json({ success: false, error: "Device name and type are required" });
		}

		const device = await Device.create({
			name,
			type,
			status: status || "inactive", // default if not provided
			owner_id,
		});

		return res.json({ success: true, device });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Get devices
exports.getDevices = async (req, res) => {
	try {
		const owner_id = req.user.userId;
		const filter = { owner_id };
		if (req.query.type) filter.type = req.query.type;
		if (req.query.status) filter.status = req.query.status;
		const devices = await Device.find(filter);
		return res.json({ success: true, devices });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Update a device if it belongs to the user
exports.updateDevice = async (req, res) => {
	try {
		const owner_id = req.user.userId;
		const deviceId = req.params.id;
		const updates = {};
		["name", "type", "status"].forEach((field) => {
			if (field in req.body) updates[field] = req.body[field];
		});
		const device = await Device.findOneAndUpdate(
			{ _id: deviceId, owner_id },
			{ $set: updates },
			{ new: true }
		);
		if (!device) {
			return res
				.status(404)
				.json({ success: false, error: "Device not found or not authorized" });
		}
		return res.json({ success: true, device });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Delete a device if it belongs to the user
exports.deleteDevice = async (req, res) => {
	try {
		const owner_id = req.user.userId;
		const deviceId = req.params.id;
		const device = await Device.findOneAndDelete({ _id: deviceId, owner_id });
		if (!device) {
			return res
				.status(404)
				.json({ success: false, error: "Device not found or not authorized" });
		}
		return res.json({ success: true, message: "Device deleted successfully" });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Heartbeat: update last_active_at to now
exports.heartbeatDevice = async (req, res) => {
	try {
		const owner_id = req.user.userId;
		const deviceId = req.params.id;
		const now = new Date();
		const device = await Device.findOneAndUpdate(
			{ _id: deviceId, owner_id },
			{ $set: { last_active_at: now } },
			{ new: true }
		);
		if (!device) {
			return res
				.status(404)
				.json({ success: false, error: "Device not found or not authorized" });
		}
		return res.json({
			success: true,
			message: "Device heartbeat recorded",
			last_active_at: device.last_active_at,
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};
