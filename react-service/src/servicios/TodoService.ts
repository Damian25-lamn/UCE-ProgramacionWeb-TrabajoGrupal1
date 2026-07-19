import axios from "../api/axios";
import type { Todo } from "../modelo/Todo";

class TodoService {

    async getAll(): Promise<Todo[]> {
        const response = await axios.get<Todo[]>("/todos");
        return response.data;
    }

    async getById(id: number): Promise<Todo> {
        const response = await axios.get<Todo>(`/todos/${id}`);
        return response.data;
    }

    async create(todo: Todo): Promise<Todo> {
        const response = await axios.post<Todo>("/todos", todo);
        return response.data;
    }

    async update(id: number, todo: Todo): Promise<void> {
        await axios.put(`/todos/${id}`, todo);
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`/todos/${id}`);
    }

}

export default new TodoService();