import { useEffect, useState } from "react";
import type { Post } from "../modelo/Post";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaPosts from "../componentes/tablas/TablaPosts";
import FormularioPost from "../componentes/formularios/FormularioPost";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones de posts
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchPosts, createPost, updatePost, deletePost } from "../slices/PostSlice";

export default function Posts() {
    const dispatch = useAppDispatch();
    
    // 2. Extraemos los posts y el estado de carga desde Redux
    const posts = useAppSelector((state) => state.posts.posts);
    const status = useAppSelector((state) => state.posts.status);

    // 3. Mantenemos únicamente los estados visuales
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [postEditar, setPostEditar] = useState<Post | undefined>(undefined);
    const [postEliminar, setPostEliminar] = useState<Post | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);

    // 4. Cargamos los posts al montar el componente (si no se han cargado antes)
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    const navigate = useNavigate();
    
    const verPost = (post: Post) => {
        navigate(`/posts/${post.id}`);
    };

    const guardarPost = async (post: Post) => {
        try {
            // 5. Despachamos las acciones de creación o actualización
            if (post.id) {
                await dispatch(updatePost(post)).unwrap();
            } else {
                await dispatch(createPost(post)).unwrap();
            }
            setDialogAbierto(false);
            // Ya no hace falta recargar manualmente la lista
        } catch (error) {
            console.error("Error al guardar la publicación:", error);
        }
    };

    const editarPost = (post: Post) => {
        setPostEditar(post);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setPostEditar(undefined);
    };

    const eliminarPost = (post: Post) => {
        setPostEliminar(post);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!postEliminar?.id) return;

        try {
            // 6. Despachamos la acción de eliminar
            await dispatch(deletePost(postEliminar.id)).unwrap();
            setDialogEliminar(false);
            setPostEliminar(undefined);
            // Ya no hace falta recargar manualmente la lista
        } catch (error) {
            console.error("Error al eliminar la publicación:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Publicaciones (Posts)
            </Typography>

            <TablaPosts
                posts={posts}
                onEditar={editarPost}
                onEliminar={eliminarPost}
                onVer={verPost}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setPostEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Post
            </Button>

            <FormularioPost
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarPost}
                postEditar={postEditar}
            />
            
            <Dialog
                open={dialogEliminar}
                onClose={() => setDialogEliminar(false)}
            >
                <DialogTitle>
                    Eliminar Publicación
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de eliminar la publicación titulada
                        <strong> "{postEliminar?.title}"</strong>? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogEliminar(false)}>
                        Cancelar
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmarEliminar}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}