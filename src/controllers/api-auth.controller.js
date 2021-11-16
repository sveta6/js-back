const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model');
const { asyncHandler } = require('../middlewares/middlewares');
const { Op } = require("sequelize");
const { nanoid } = require("nanoid");

const router = Router();

function initRoutes() {
    router.post('/registration', asyncHandler(registration));
    router.post('/login', asyncHandler(login));
}

async function registration(req, res, next) {
    let user = await User.findOne({
        where: {
            [Op.or]: [
                {
                    login: req.body.login,
                    password:req.body.password,
                },
            ],
        },
    });
    if (user) throw new ErrorResponse("Email or Login have been already exist", 400);
    user = await User.create(req.body);
    res.status(200).json(user);
}

async function login(req, res, next) {
    let user = await User.findOne({
        where: {
            login: req.body.login,
            password: req.body.password,
        },
    });
    if (!user) throw new ErrorResponse("Incorrect login or passwd", 400);
    let token = await Token.create({
        userId: user.id,
        value: nanoid(128),
    });

    res.status(200).json({
        accessToken: token.value,
    });
}

initRoutes();

module.exports = router;