import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Comment } from "../../modelo/Comment";

// 1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchComments } from "../../slices/CommentSlice"; 

export default function ComentarioDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 2. Buscamos el comentario directamente en el estado global
    const comentario = useAppSelector((state) =>
        state.comments.comments.find((c) => c.id === Number(id))
    ) as Comment | undefined;

    const status = useAppSelector((state) => state.comments.status);

    // 3. Si recargaron la página estando en esta ruta, pedimos los datos
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchComments());
        }
    }, [status, dispatch]);

    // 4. Manejamos el estado de carga
    if (status === 'loading' || (status === 'idle' && !comentario)) {
        return (
            <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 'bold' }}>
                Cargando comentario...
            </Typography>
        );
    }

    // 5. Manejamos el caso donde el ID no existe
    if (!comentario) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Comentario no encontrado
                </Typography>
                <Button variant="contained" onClick={() => navigate("/comentarios")}>
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
                onClick={() => navigate("/comentarios")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de comentarios
            </Button>

            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                {comentario.name}
            </Typography>

            <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
            >
                Escrito por: <strong style={{ color: '#1976d2' }}>{comentario.email}</strong>
            </Typography>
            
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                En respuesta al Post ID: <strong>{comentario.postId}</strong> | Comentario #{comentario.id}
            </Typography>

            <Card sx={{ mt: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Mensaje
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
                        {comentario.body}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}