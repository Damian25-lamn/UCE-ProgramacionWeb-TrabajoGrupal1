import { useEffect, useState } from "react";
import type { Comment } from "../modelo/Comment";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaComentarios from "../componentes/tablas/TablaComments"; // Verifica que esta ruta siga siendo correcta
import FormularioComentario from "../componentes/formularios/FormularioComentario";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones de comentarios
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchComments, createComment, updateComment, deleteComment } from "../slices/CommentSlice"; // Verifica que esta ruta siga siendo correcta

export default function Comentarios() {
    const dispatch = useAppDispatch();
    
    // 2. Extraemos los comentarios y el estado de carga directamente de Redux
    const comentarios = useAppSelector((state) => state.comments.comments);
    const status = useAppSelector((state) => state.comments.status);

    // 3. Mantenemos únicamente los estados de la interfaz visual
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [comentarioEditar, setComentarioEditar] = useState<Comment | undefined>(undefined);
    const [comentarioEliminar, setComentarioEliminar] = useState<Comment | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);

    // 4. Disparamos la petición al backend solo si no se ha hecho previamente
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchComments());
        }
    }, [status, dispatch]);

    const navigate = useNavigate();
    
    const verComentario = (comentario: Comment) => {
        navigate(`/comentarios/${comentario.id}`);
    };

    const guardarComentario = async (comentario: Comment) => {
        try {
            // 5. Despachamos las acciones conectadas a Helidon
            if (comentario.id) {
                await dispatch(updateComment(comentario)).unwrap();
            } else {
                await dispatch(createComment(comentario)).unwrap();
            }
            setDialogAbierto(false);
            // Redux se encarga de actualizar el estado, no es necesario recargar manualmente
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    };

    const editarComentario = (comentario: Comment) => {
        setComentarioEditar(comentario);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setComentarioEditar(undefined);
    };

    const eliminarComentario = (comentario: Comment) => {
        setComentarioEliminar(comentario);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!comentarioEliminar?.id) return;

        try {
            // 6. Despachamos la acción de eliminación
            await dispatch(deleteComment(comentarioEliminar.id)).unwrap();
            setDialogEliminar(false);
            setComentarioEliminar(undefined);
        } catch (error) {
            console.error("Error al eliminar el comentario:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Comentarios
            </Typography>

            <TablaComentarios
                comentarios={comentarios}
                onEditar={editarComentario}
                onEliminar={eliminarComentario}
                onVer={verComentario}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setComentarioEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Comentario
            </Button>

            <FormularioComentario
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarComentario}
                comentarioEditar={comentarioEditar}
            />
            
            <Dialog
                open={dialogEliminar}
                onClose={() => setDialogEliminar(false)}
            >
                <DialogTitle>
                    Eliminar Comentario
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de eliminar el comentario con asunto
                        <strong> "{comentarioEliminar?.name}"</strong> del autor <strong>{comentarioEliminar?.email}</strong>? Esta acción no se puede deshacer.
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