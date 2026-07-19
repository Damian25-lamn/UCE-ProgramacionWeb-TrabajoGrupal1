import { useEffect, useState } from "react";
import type { User } from "../modelo/User";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaUsuarios from "../componentes/tablas/TablaUsuarios";
import FormularioUsuario from "../componentes/formularios/FormularioUsuario";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones del Usuario
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchUsers, createUser, updateUser, deleteUser } from "../slices/UserSlice";

export default function Usuarios() {
    const dispatch = useAppDispatch();

    // 2. Extraemos los usuarios y el estado de la petición desde Redux
    const usuarios = useAppSelector((state) => state.users.users);
    const status = useAppSelector((state) => state.users.status);

    // 3. Mantenemos SOLO los estados visuales
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<User | undefined>(undefined);
    const [usuarioEliminar, setUsuarioEliminar] = useState<User | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);

    // 4. Cargamos los usuarios al montar el componente (solo si no se han cargado antes)
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    const navigate = useNavigate();
    
    const verUsuario = (usuario: User) => {
        navigate(`/usuarios/${usuario.id}`);
    };

    const guardarUsuario = async (usuario: User) => {
        try {
            // 5. Despachamos las acciones de Redux. Usamos .unwrap() para capturar errores correctamente
            if (usuario.id) {
                await dispatch(updateUser(usuario)).unwrap();
            } else {
                await dispatch(createUser(usuario)).unwrap();
            }
            setDialogAbierto(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const editarUsuario = (usuario: User) => {
        setUsuarioEditar(usuario);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setUsuarioEditar(undefined);
    };

    const eliminarUsuario = (usuario: User) => {
        setUsuarioEliminar(usuario);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!usuarioEliminar?.id) return;
        try {
            // 6. Despachamos la acción de eliminar
            await dispatch(deleteUser(usuarioEliminar.id)).unwrap();
            setDialogEliminar(false);
            setUsuarioEliminar(undefined);
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Usuarios
            </Typography>

            <TablaUsuarios
                usuarios={usuarios}
                onEditar={editarUsuario}
                onEliminar={eliminarUsuario}
                onVer={verUsuario}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setUsuarioEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Usuario
            </Button>

            <FormularioUsuario
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarUsuario}
                usuarioEditar={usuarioEditar}
            />
            
            <Dialog
                open={dialogEliminar}
                onClose={() => setDialogEliminar(false)}
            >
                <DialogTitle>
                    Eliminar Usuario
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de eliminar al usuario
                        <strong> {usuarioEliminar?.name}</strong>?
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