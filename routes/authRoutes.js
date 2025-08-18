const router = require("express").Router();
const { signup, login } = require("../controllers/authController");

//register a new user
router.post("/signup", signup);

//login a user
router.post("/login", login);

module.exports = router;
