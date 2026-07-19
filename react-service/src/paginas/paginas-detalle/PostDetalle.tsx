import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Post } from "../../modelo/Post";

//1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchPosts } from "../../slices/PostSlice";

export default function PostDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    //2. Buscamos el post directamente en el estado global de Redux
    const post = useAppSelector((state) =>
        state.posts.posts.find((p) => p.id === Number(id))
    ) as Post | undefined;

    const status = useAppSelector((state) => state.posts.status);

    //3. Si recargaron la página estando en esta ruta, le pedimos a Redux que traiga los datos
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    //4. Manejamos el estado de carga
    if (status === 'loading' || (status === 'idle' && !post)) {
        return (
            <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 'bold' }}>
                Cargando publicación...
            </Typography>
        );
    }

    //5. Manejamos el caso donde el ID no existe en la base de datos
    if (!post) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Publicación no encontrada
                </Typography>
                <Button variant="contained" onClick={() => navigate("/posts")}>
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: "auto",
                mt: 4
            }}
        >
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/posts")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de Posts
            </Button>

            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                {post.title}
            </Typography>

            <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
            >
                Publicado por el Usuario ID: <strong>{post.userId}</strong> | Post #{post.id}
            </Typography>

            <Card sx={{ mt: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Contenido del mensaje
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography 
                        variant="body1" 
                        sx={{ 
                            whiteSpace: "pre-line", 
                            lineHeight: 1.7,
                            fontSize: "1.05rem" 
                        }}
                    >
                        {post.body}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}