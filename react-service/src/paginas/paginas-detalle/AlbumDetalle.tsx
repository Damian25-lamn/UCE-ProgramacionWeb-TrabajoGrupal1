import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Album } from "../../modelo/Album";

// 1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchAlbums } from "../../slices/AlbumSlice";

export default function AlbumDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 2. Buscamos el álbum directamente en el estado global
    const album = useAppSelector((state) =>
        state.albums.albums.find((a) => a.id === Number(id))
    ) as Album | undefined;

    const status = useAppSelector((state) => state.albums.status);

    // 3. Si el estado es idle (ej. recargaron la página), mandamos a pedir los datos
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAlbums());
        }
    }, [status, dispatch]);

    // 4. Manejo del estado de carga
    if (status === 'loading' || (status === 'idle' && !album)) {
        return (
            <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 'bold' }}>
                Cargando álbum...
            </Typography>
        );
    }

    // 5. Manejo de error si el ID del álbum no existe
    if (!album) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Álbum no encontrado
                </Typography>
                <Button variant="contained" onClick={() => navigate("/albums")}>
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/albums")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de álbumes
            </Button>

            <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Detalle del Álbum #{album.id}
                    </Typography>
                    
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {album.title}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1">
                        <strong>ID del Usuario propietario:</strong> {album.userId}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}