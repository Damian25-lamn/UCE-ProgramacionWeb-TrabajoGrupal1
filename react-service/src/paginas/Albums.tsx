import { useEffect, useState } from "react";
import type { Album } from "../modelo/Album";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaAlbums from "../componentes/tablas/TablaAlbums";
import FormularioAlbum from "../componentes/formularios/FormularioAlbum";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones de los álbumes
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchAlbums, createAlbum, updateAlbum, deleteAlbum } from "../slices/AlbumSlice";

export default function Albums() {
    const dispatch = useAppDispatch();

    // 2. Extraemos los álbumes y el estado directamente de Redux
    const albums = useAppSelector((state) => state.albums.albums);
    const status = useAppSelector((state) => state.albums.status);

    // 3. Mantenemos únicamente los estados de la interfaz visual
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [albumEditar, setAlbumEditar] = useState<Album | undefined>(undefined);
    const [albumEliminar, setAlbumEliminar] = useState<Album | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);

    // 4. Disparamos la petición al backend solo si no se ha hecho previamente
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAlbums());
        }
    }, [status, dispatch]);

    const navigate = useNavigate();

    const verAlbum = (album: Album) => {
        navigate(`/albums/${album.id}`);
    };

    const guardarAlbum = async (album: Album) => {
        try {
            // 5. Despachamos las acciones conectadas a Helidon
            if (album.id) {
                await dispatch(updateAlbum(album)).unwrap();
            } else {
                await dispatch(createAlbum(album)).unwrap();
            }
            setDialogAbierto(false);
            // Redux se encarga de actualizar el estado, no es necesario recargar manualmente
        } catch (error) {
            console.error("Error al guardar el álbum:", error);
        }
    };

    const editarAlbum = (album: Album) => {
        setAlbumEditar(album);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setAlbumEditar(undefined);
    };

    const eliminarAlbum = (album: Album) => {
        setAlbumEliminar(album);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!albumEliminar?.id) return;

        try {
            // 6. Despachamos la acción de eliminación
            await dispatch(deleteAlbum(albumEliminar.id)).unwrap();
            setDialogEliminar(false);
            setAlbumEliminar(undefined);
        } catch (error) {
            console.error("Error al eliminar el álbum:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Álbumes
            </Typography>

            <TablaAlbums
                albums={albums}
                onEditar={editarAlbum}
                onEliminar={eliminarAlbum}
                onVer={verAlbum}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setAlbumEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Álbum
            </Button>

            <FormularioAlbum
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarAlbum}
                albumEditar={albumEditar}
            />

            <Dialog
                open={dialogEliminar}
                onClose={() => setDialogEliminar(false)}
            >
                <DialogTitle>
                    Eliminar Álbum
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de eliminar el álbum <strong>"{albumEliminar?.title}"</strong>? Esta acción no se puede deshacer.
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