import { useEffect, useState } from "react";
import type { Photo } from "../modelo/Photo";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaFotos from "../componentes/tablas/TablaFotos";
import FormularioFoto from "../componentes/formularios/FormularioFoto";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones de fotos
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchPhotos, createPhoto, updatePhoto, deletePhoto } from "../slices/PhotoSlice";

export default function Fotos() {
    const dispatch = useAppDispatch();
    
    // 2. Extraemos las fotos y el estado directamente desde Redux
    const fotos = useAppSelector((state) => state.photos.photos);
    const status = useAppSelector((state) => state.photos.status);

    // 3. Mantenemos únicamente los estados visuales
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [fotoEditar, setFotoEditar] = useState<Photo | undefined>(undefined);
    const [fotoEliminar, setFotoEliminar] = useState<Photo | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);
    
    const navigate = useNavigate();

    // 4. Cargamos las fotos al montar el componente (si el estado es idle)
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPhotos());
        }
    }, [status, dispatch]);

    const verDetalle = (foto: Photo) => {
        navigate(`/fotos/${foto.id}`);
    };

    const guardarFoto = async (foto: Photo) => {
        try {
            // 5. Despachamos las acciones conectadas a Helidon
            if (foto.id) {
                await dispatch(updatePhoto(foto)).unwrap();
            } else {
                await dispatch(createPhoto(foto)).unwrap();
            }
            setDialogAbierto(false);
            // Redux actualiza la tabla automáticamente, no hay que recargar
        } catch (error) {
            console.error("Error al guardar la foto:", error);
        }
    };

    const editarFoto = (foto: Photo) => {
        setFotoEditar(foto);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setFotoEditar(undefined);
    };

    const iniciarEliminar = (foto: Photo) => {
        setFotoEliminar(foto);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!fotoEliminar?.id) return;

        try {
            // 6. Despachamos la acción de eliminación
            await dispatch(deletePhoto(fotoEliminar.id)).unwrap();
            setDialogEliminar(false);
            setFotoEliminar(undefined);
        } catch (error) {
            console.error("Error al eliminar la foto:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Fotos
            </Typography>

            <TablaFotos
                fotos={fotos}
                onEditar={editarFoto}
                onEliminar={iniciarEliminar}
                onVer={verDetalle}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setFotoEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Nueva Foto
            </Button>

            <FormularioFoto
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarFoto}
                fotoEditar={fotoEditar}
            />

            <Dialog open={dialogEliminar} onClose={() => setDialogEliminar(false)}>
                <DialogTitle>Eliminar Foto</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar la foto <strong>"{fotoEliminar?.title}"</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogEliminar(false)}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={confirmarEliminar}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}