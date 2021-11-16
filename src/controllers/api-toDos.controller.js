const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../dataBase/models/ToDo.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDo));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.post('/', asyncHandler(requireToken), asyncHandler(createToDo));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(patchToDoById));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
    router.delete('/', asyncHandler(requireToken), asyncHandler(deleteAllToDo));
}

async function getToDo(req, res, next) {
    const todos = await ToDo.findAll({
        where: {
            userId: req.userId,
        },
    });

    res.status(200).json({ todos });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findByPk({
        where: {
            id: req.params.id,
            userId: req.userId,
        },
    });

    if (!todo) { throw new ErrorResponse('No todo found', 404); }

    res.status(200).json(todo);
}

async function createToDo(req, res, next) {
    const todo = await ToDo.create({
        ...req.body,
        userId: req.userId,
    });

    res.status(200).json(todo);
}

async function patchToDoById(req, res, next) {
    const todo = await ToDo.update({
        where: {
            id: req.params.id,
            userId: req.userId,
        }
    },
    )
    res.status(200).json(todo);
}

async function deleteAllToDo(req, res, next) {
    await ToDo.destroy({
        where: { userId: req.userId }
    });
    res.status(200).json({ message: "All deleted" });
}
async function deleteToDoById(req, res, next) {
    const todo = await ToDo.findByPk({
        where: {
            id: req.params.id,
            userId: req.userId,
        },
    });
    await todo.destroy();
    res.status(200).json({ message: "Deleted by ID" });
}

initRoutes();

module.exports = router;