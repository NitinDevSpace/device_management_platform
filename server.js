const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");

//Load env variables
require("dotenv").config();

//connect to teh Database
const connectDB = require("./config/db");
connectDB();

//Rate Limiter
const apiLimited = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100,
	handler: (req, res, next) => {
		// Calculate seconds remaining
		const resetTimestamp = req.rateLimit.resetTime
			? req.rateLimit.resetTime.getTime()
			: Date.now() + req.rateLimit.windowMs;
		const secondsRemaining = Math.ceil((resetTimestamp - Date.now()) / 1000);

		const minutesRemaining = Math.ceil(secondsRemaining / 60);

		res.status(429).json({
			success: false,
			message: `Too many requests from this IP. Please try again after ${minutesRemaining} minute(s).`,
		});
	},
});

//Makes data Available in req.body
app.use(express.json());

//Importing Routes
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

//Routes/API calls
app.use("/api/", apiLimited);
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

// Import Device model
const Device = require("./models/Device");

// Background job to update inactive devices every 30 minutes
setInterval(async () => {
	try {
		const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
		const result = await Device.updateMany(
			{ last_active_at: { $lt: cutoffDate }, status: "active" },
			{ $set: { status: "inactive" } }
		);
		console.log(`Background job: Updated ${result.modifiedCount} devices to inactive.`);
	} catch (error) {
		console.error("Background job error:", error);
	}
}, 30 * 60 * 1000);

//Port & starting of server
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
