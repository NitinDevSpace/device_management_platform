const mongoose = require("mongoose");

//Defining the Schema for the users
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["user", "admin"],
			required: true,
			default: "user",
		},
	},
	{ timestamps: true }
);

//Creating the Model of users using the userSchema
module.exports = mongoose.model("users", userSchema);
