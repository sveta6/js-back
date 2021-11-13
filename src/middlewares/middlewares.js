const ErrorResponse = require("../classes/error-response");
const Token = require("../dataBase/models/Token.model");
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
    console.log('Ошибка', {
        message: err.message,
        stack: err.stack,
    });
    res.status(err.code || 500).json({
        message: err.messages
    });
};

const requireToken = async (req, _res, next) => {
    const token = req.header("token");
    if (!token) throw new ErrorResponse("Token undefinded", 404);
    let tokenFind = await Token.findOne({
        where: {
            value: token,
        },
    });

    if (!tokenFind) { throw new ErrorResponse("Wrong token", 403); }

    req.userId = tokenFind.userId;
    next();
};
//  const requireToken = async(req, _res, next)=>{
//     let token = await Token.findOne({
//         where:{value: req.headers.token}, 
//     });
//     if(!token)throw new ErrorResponse("Wrong token", 403);
//     req.userId= token.userId;
// }

module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
    errorHandler,
    requireToken,
};