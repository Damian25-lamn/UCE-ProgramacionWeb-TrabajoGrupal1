import axios from "../api/axios";
import type { Post } from "../modelo/Post";

class PostService {

    async getAll(): Promise<Post[]> {

        const response = await axios.get<Post[]>("/posts");

        return response.data;

    }

    async getById(id: number): Promise<Post> {

        const response = await axios.get<Post>(`/posts/${id}`);

        return response.data;

    }

    async create(post: Post): Promise<Post> {

        const response = await axios.post<Post>("/posts", post);

        return response.data;

    }

    async update(id: number, post: Post): Promise<void> {

        await axios.put(`/posts/${id}`, post);

        }

    async delete(id: number): Promise<void> {

        await axios.delete(`/posts/${id}`);

    }

}

export default new PostService();