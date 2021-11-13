const { Router } = require('express');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model');
const { asyncHandler, requireToken } = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
    router.patch('/update', asyncHandler(requireToken), asyncHandler(updateInfo));
    router.get('/about', asyncHandler(requireToken), asyncHandler(receiveInfo));
}

async function receiveInfo(req, res, _next) {
    let user = await User.findByPk(req.userId);
    res.status(200).json(user);
}

async function updateInfo(req, res, _next) {
    let user = await User.findByPk(req.userId);
    user = await User.update(req.body, {
        where: {
            id: req.userId,
        },
        returning: true,
    });

    res.status(200).json(user);
}

async function logout(req, res, _next) {
    await Token.destroy({
        where: {
            value: req.header("token"),
        },
    });

    res.status(200).json({ message: "Logged out" });
}

initRoutes();

module.exports = router;