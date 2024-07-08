import Todo from "../models/todo-model.js";

class TodoRepo {
    async create(data) {
        try {
            const todo = await Todo.create(data);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const todo = await Todo.findByIdAndUpdate(id, data);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll() {
        try {
            const todo = await Todo.find({});
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const todo = await Todo.findByIdAndDelete(id);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}