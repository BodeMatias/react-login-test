const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/token", userController.token);
router.delete("/logout", userController.logout);
router.get("/auth", userController.authenticateToken, (req, res) => {
    console.log("Acceso permitido.");
    return res.status(200).json({ authenticated: true });
});

module.exports = router;
