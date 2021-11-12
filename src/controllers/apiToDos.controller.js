const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../dataBase/models/ToDo.model');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model');
const { asyncHandler } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/', asyncHandler(getToDo));
    router.get('/:id', asyncHandler(getToDoById));
    router.post('/', asyncHandler(createToDo));
    router.patch('/:id', asyncHandler(patchToDoById));
    router.delete('/:id', asyncHandler(deleteToDoById));
    router.delete('/', asyncHandler(deleteAllToDo));
    
}

async function getToDo(req, res, next) {
    const todo = await ToDo.findAll();

    res.status(200).json({ todo });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findByPk(req.params.id);

    if (!todo) {throw new ErrorResponse('No todo found', 404); }

    res.status(200).json(todo);
}

async function createToDo(req, res, next) {
    const todo = await ToDo.create({
        ...req.body
    });

    res.status(200).json(todo);
}

async function patchToDoById(req, res, next) {
    const todo = ToDo.update({
        where: { id: req.params.id }
    },
    )
    res.status(200).json( todo );
}

async function deleteAllToDo(req, res, next) {
    ToDo.destroy({
        where: { id: req.userId }
    },
    )
    res.status(200).json({ message: "All deleted" });
}
async function deleteToDoById(req, res, next) {
    let id = req.params.id;
    let todo = await ToDo.findByPk(id);
    await todo.destroy();
    res.status(200).json({ message: "Deleted by ID" });
}
initRoutes();

module.exports = router;