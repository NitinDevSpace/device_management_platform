const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
	{
		device: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "devices",
			required: true,
		},
		event: { type: String, required: true }, // e.g., "units_consumed"
		value: { type: Number, required: true },
		timestamp: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Log = mongoose.model("logs", logSchema);
module.exports = Log;
