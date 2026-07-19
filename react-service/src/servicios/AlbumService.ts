import axios from "../api/axios";
import type { Album } from "../modelo/Album";

class AlbumService {

    async getAll(): Promise<Album[]> {

        const response = await axios.get<Album[]>("/albums");

        return response.data;

    }

    async getById(id: number): Promise<Album> {

        const response = await axios.get<Album>(`/albums/${id}`);

        return response.data;

    }

    async create(album: Album): Promise<Album> {

        const response = await axios.post<Album>("/albums", album);

        return response.data;

    }

    async update(id: number, album: Album): Promise<void> {

        await axios.put(`/albums/${id}`, album);

    }

    async delete(id: number): Promise<void> {

        await axios.delete(`/albums/${id}`);

    }

}

export default new AlbumService();