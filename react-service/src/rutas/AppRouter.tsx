import { Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/Dashboard";
import Usuarios from "../paginas/Usuarios";
import Posts from "../paginas/Posts";
import Comentarios from "../paginas/Comentarios";
import Albums from "../paginas/Albums";
import Fotos from "../paginas/Fotos";
import Todos from "../paginas/Todos";
import MainLayout from "../layout/MainLayout";
import UsuarioDetalle from "../paginas/paginas-detalle/UsuarioDetalle";
import PostDetalle from "../paginas/paginas-detalle/PostDetalle";
import ComentarioDetalle from "../paginas/paginas-detalle/ComentarioDetalle";
import AlbumDetalle from "../paginas/paginas-detalle/AlbumDetalle";
import FotoDetalle from "../paginas/paginas-detalle/FotoDetalle";
import TodoDetalle from "../paginas/paginas-detalle/TodoDetalle";


export default function AppRouter() {
    return (
    <Routes>

    <Route element={<MainLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="usuarios" element={<Usuarios />} />

        <Route path="/usuarios/:id" element={<UsuarioDetalle />} />

        <Route path="posts" element={<Posts />} />

        <Route path="/posts/:id" element={<PostDetalle />} />

        <Route path="comentarios" element={<Comentarios />} />

        <Route path="/comentarios/:id" element={<ComentarioDetalle />} />

        <Route path="albums" element={<Albums />} />

        <Route path="/albums/:id" element={<AlbumDetalle />} />

        <Route path="fotos" element={<Fotos />} />

        <Route path="/fotos/:id" element={<FotoDetalle />} />

        <Route path="todos" element={<Todos />} />

        <Route path="/todos/:id" element={<TodoDetalle />} />

    </Route>

</Routes>
    )
}