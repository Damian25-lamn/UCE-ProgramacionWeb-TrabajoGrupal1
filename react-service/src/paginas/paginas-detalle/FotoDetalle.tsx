import { Box, Button, Card, CardContent, CardMedia, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Photo } from "../../modelo/Photo";

// 1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchPhotos } from "../../slices/PhotoSlice";

export default function FotoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 2. Buscamos la foto directamente en el estado global
    const foto = useAppSelector((state) =>
        state.photos.photos.find((p) => p.id === Number(id))
    ) as Photo | undefined;

    const status = useAppSelector((state) => state.photos.status);

    // 3. Si recargaron la página (estado idle), pedimos los datos
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPhotos());
        }
    }, [status, dispatch]);

    // 4. Manejo del estado de carga
    if (status === 'loading' || (status === 'idle' && !foto)) {
        return (
            <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 'bold' }}>
                Cargando foto...
            </Typography>
        );
    }

    // 5. Manejo de error si el ID no existe en la base de datos
    if (!foto) {
        return (
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Foto no encontrada
                </Typography>
                <Button variant="contained" onClick={() => navigate("/fotos")}>
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/fotos")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de fotos
            </Button>

            <Card sx={{ boxShadow: 3 }}>
                {/* Aquí renderizamos la imagen visualmente */}
                <CardMedia
                    component="img"
                    image={foto.url}
                    alt={foto.title}
                    sx={{ 
                        maxHeight: 500, 
                        objectFit: "contain", 
                        backgroundColor: "#f5f5f5" 
                    }}
                />

                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {foto.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID de Foto: #{foto.id} | ID de Álbum: {foto.albumId}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Button
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        href={foto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                    >
                        Abrir imagen original
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}