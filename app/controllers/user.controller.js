require("dotenv").config();

const express = require("express");
const mongo = require("mongodb");
const User = require("../models/user.schema");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userController = {};

let refreshTokens = [];

userController.token = (req, res) => {
    //refresh token
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = userController.generateAccessToken({
            name: user.name
        });
        res.json({ accessToken: accessToken });
    });
};

userController.logout = (req, res) => {
    //delete token
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
};

userController.register = (req, res) => {
    //register user
    User.find({ username: req.body.username }).then(user => {
        console.log(user);
        if (user.length == 0) {
            newUser = new User();
            newUser.username = req.body.username;
            newUser.password = req.body.password;
            newUser.save();
            console.log("Registrado correctamente");
        } else {
            console.log("Ya existe un usuario registrado con ese nombre.");
        }
    });
};

userController.login = async (req, res) => {
    //authenticate user
    passport.authenticate("local");
    const username = req.body.username;
    const user = { name: username };
    //send token
    const accessToken = userController.generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
    refreshTokens.push(refreshToken);
    res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        currentUser: user
    });
};

userController.authenticateToken = (req, res, next) => {
    //check if token is valid
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) {
        return res.status(401).json({ authenticated: false });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ authenticated: false });
        }
        console.log("token verified");
        next();
    });
};

userController.generateAccessToken = user => {
    //generate token
    return jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "900s" // 15 minutes
    });
};
module.exports = userController;
