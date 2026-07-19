import { useEffect, useState } from "react";
import type { Todo } from "../modelo/Todo";
import { Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import TablaTodos from "../componentes/tablas/TablaTodos";
import FormularioTodos from "../componentes/formularios/FormularioTodos";
import { useNavigate } from "react-router-dom";

// 1. Importamos los hooks de Redux y las acciones de los Todos
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "../slices/TodoSlice";

export default function Todos() {
    const dispatch = useAppDispatch();
    
    // 2. Extraemos las tareas y el estado directamente desde Redux
    const todos = useAppSelector((state) => state.todos.todos);
    const status = useAppSelector((state) => state.todos.status);

    // 3. Mantenemos únicamente los estados de la interfaz visual
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [todoEditar, setTodoEditar] = useState<Todo | undefined>(undefined);
    const [todoEliminar, setTodoEliminar] = useState<Todo | undefined>(undefined);
    const [dialogEliminar, setDialogEliminar] = useState(false);
    const navigate = useNavigate();

    // 4. Cargamos las tareas al montar el componente (si el estado es idle)
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTodos());
        }
    }, [status, dispatch]);

    const verDetalle = (todo: Todo) => {
        navigate(`/todos/${todo.id}`);
    };

    const guardarTodo = async (todo: Todo) => {
        try {
            // 5. Despachamos las acciones conectadas a Helidon
            if (todo.id) {
                await dispatch(updateTodo(todo)).unwrap();
            } else {
                await dispatch(createTodo(todo)).unwrap();
            }
            setDialogAbierto(false);
            // Redux actualiza la tabla automáticamente, no hay que recargar
        } catch (error) {
            console.error("Error al guardar la tarea:", error);
        }
    };

    const editarTodo = (todo: Todo) => {
        setTodoEditar(todo);
        setDialogAbierto(true);
    };

    const cerrarFormulario = () => {
        setDialogAbierto(false);
        setTodoEditar(undefined);
    };

    const iniciarEliminar = (todo: Todo) => {
        setTodoEliminar(todo);
        setDialogEliminar(true);
    };

    const confirmarEliminar = async () => {
        if (!todoEliminar?.id) return;

        try {
            // 6. Despachamos la acción de eliminación
            await dispatch(deleteTodo(todoEliminar.id)).unwrap();
            setDialogEliminar(false);
            setTodoEliminar(undefined);
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    return (
        <Box sx={{ mt: 2, mx: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Tareas (Todos)
            </Typography>

            <TablaTodos
                todos={todos}
                onEditar={editarTodo}
                onEliminar={iniciarEliminar}
                onVer={verDetalle}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    setTodoEditar(undefined);
                    setDialogAbierto(true);
                }}
            >
                Agregar Nueva Tarea
            </Button>

            <FormularioTodos
                open={dialogAbierto}
                onClose={cerrarFormulario}
                onGuardar={guardarTodo}
                todoEditar={todoEditar}
            />

            <Dialog open={dialogEliminar} onClose={() => setDialogEliminar(false)}>
                <DialogTitle>Eliminar Tarea</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar la tarea <strong>"{todoEliminar?.title}"</strong>?
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