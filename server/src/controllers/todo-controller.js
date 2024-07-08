import TodoService from "../services/todo-service.js";

const todoService = new TodoService();

const createTodo = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description
        };
        const todo = await todoService.create(data);
        return res.status(201).json({
            data: todo,
            success: true,
            message: 'Successfully created a todo',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to create the todo',
            error: error
        });
    }
}

const getAllTodos = async (req, res) => {
    try {
        const todos = await todoService.getAll();
        return res.status(200).json({
            data: todos,
            success: true,
            message: 'Successfully fetched all todos',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch the todos',
            error: error
        });
    }
}

const updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            title: req.body.title,
            description: req.body.description
        };
        const todo = await todoService.update(id, data);
        return res.status(200).json({
            data: todo,
            success: true,
            message: 'Successfully updated the todo',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to update the todo',
            error: error
        });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await todoService.delete(id);
        return res.status(200).json({
            data: todo,
            success: true,
            message: 'Successfully deleted the todo',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to delete the todo',
            error: error
        });
    }
}

export {
    createTodo,
    getAllTodos,
    updateTodo,
    deleteTodo
}