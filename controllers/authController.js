const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
	try {
		const userExists = await User.findOne({ email: req.body.email });
		if (userExists) {
			return res.send({
				success: false,
				message: "User already exists",
			});
		}
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		const newUser = new User({
			...req.body,
			password: hashedPassword,
		});
		await newUser.save();
		res.send({
			success: true,
			message: "Registered Successfully, Please Login",
		});
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.send({
				success: false,
				message: "User not found, Please Register",
			});
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch) {
			return res.send({
				success: false,
				message: "Invalid Password",
			});
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res
			.cookie("token", token, {
				httpOnly: true, // prevents JavaScript access
				secure: process.env.NODE_ENV === "production", // only https in prod
				sameSite: "strict", // CSRF protection
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})
			.send({
				success: true,
				token: token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			});
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
};

module.exports = {
	signup,
	login,
};
