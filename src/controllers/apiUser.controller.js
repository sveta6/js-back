const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../dataBase/models/ToDo.model');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model');
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const { Op } = require("sequelize");


const router = Router();

async function receiveInfo(req, res, _next) {
    let user = await User.findByPk(req.userId);
    res.status(200).json(user);
}

async function updateInfo(req, res, _next) {
    let user = await User.findByPk(req.userId);
    
    req.body.password = user.password;

    user = await User.update(req.body, {
        where: {
            id: req.userId,
        },
        returning: true,
    });

    res.status(200).json(user);
}


async function logout(req, res, _next) {
    Token.destroy({
        where: {
            value: req.headers.token,
        },
    });

    res.status(200).json({ message: "Logged out" });
}


function initRoutes() {
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
    router.patch('/update', asyncHandler(requireToken), asyncHandler(updateInfo));
    router.get('/me', asyncHandler(requireToken), asyncHandler(receiveInfo));
}
initRoutes();

module.exports = router;