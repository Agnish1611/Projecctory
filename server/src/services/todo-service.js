import TodoRepo from "../repositories/todo-repo.js";

class TodoService {
    constructor() {
        this.todoRepo = new TodoRepo();
    }

    async create(data) {
        try {
            const todo = await this.todoRepo.create(data);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll() {
        try {
            const todos = await this.todoRepo.getAll();
            return todos;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const todo = await this.todoRepo.update(id, data);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const todo = await this.todoRepo.delete(id);
            return todo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default TodoService;