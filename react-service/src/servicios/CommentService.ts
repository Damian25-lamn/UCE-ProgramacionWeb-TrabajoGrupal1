import axios from "../api/axios";
import type { Comment } from "../modelo/Comment";

class CommentService {

    async getAll(): Promise<Comment[]> {

        const response = await axios.get<Comment[]>("/comments");

        return response.data;

    }

    async getById(id: number): Promise<Comment> {

        const response = await axios.get<Comment>(`/comments/${id}`);

        return response.data;

    }

    async create(comment: Comment): Promise<Comment> {

        const response = await axios.post<Comment>("/comments", comment);

        return response.data;

    }

    async update(id: number, comment: Comment): Promise<void> {

        await axios.put(`/comments/${id}`, comment);

    }

    async delete(id: number): Promise<void> {

        await axios.delete(`/comments/${id}`);

    }

}

export default new CommentService();