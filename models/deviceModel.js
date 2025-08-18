const mongoose = require("mongoose");

//Defining the Schema for the devices
const deviceSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		type: { type: String, required: true },
		status: { type: String, enum: ["active", "inactive"], default: "active" },
		last_active_at: { type: Date, default: null },
		owner_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{ timestamps: true }
);

//Creating the Model of devices using the deviceSchema
const Device = mongoose.model("devices", deviceSchema);
module.exports = Device;
