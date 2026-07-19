import axios from "../api/axios";
import type { Photo } from "../modelo/Photo";

class PhotoService {

    async getAll(): Promise<Photo[]> {

        const response = await axios.get<Photo[]>("/photos");

        return response.data;

    }

    async getById(id: number): Promise<Photo> {

        const response = await axios.get<Photo>(`/photos/${id}`);

        return response.data;

    }

    async create(photo: Photo): Promise<Photo> {

        const response = await axios.post<Photo>("/photos", photo);

        return response.data;

    }

    async update(id: number, photo: Photo): Promise<void> {

        await axios.put(`/photos/${id}`, photo);

    }

    async delete(id: number): Promise<void> {

        await axios.delete(`/photos/${id}`);

    }

}

export default new PhotoService();