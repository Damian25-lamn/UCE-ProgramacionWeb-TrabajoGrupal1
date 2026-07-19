import axios from "../api/axios";
import type { User } from "../modelo/User"; 
class UserService {

    async getAll(): Promise<User[]> {

        const response = await axios.get<User[]>("/users");

        return response.data;

    }

    async getById(id: number): Promise<User> {

        const response = await axios.get<User>(`/users/${id}`);

        return response.data;

    }

    async create(user: User): Promise<User> {

        const response = await axios.post<User>("/users", user);

        return response.data;

    }

    async update(id: number, user: User): Promise<void> {

        await axios.put(`/users/${id}`, user);

    }

    async delete(id: number): Promise<void> {

        await axios.delete(`/users/${id}`);

    }

}

export default new UserService();