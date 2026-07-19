import { Box, Button, Card, CardContent, Chip, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Todo } from "../../modelo/Todo";

// 1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchTodos } from "../../slices/TodoSlice";

export default function TodoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 2. Buscamos la tarea directamente en el estado global
    const todo = useAppSelector((state) =>
        state.todos.todos.find((t) => t.id === Number(id))
    ) as Todo | undefined;

    const status = useAppSelector((state) => state.todos.status);

    // 3. Si recargaron la página (estado idle), pedimos los datos al backend
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTodos());
        }
    }, [status, dispatch]);

    // 4. Manejo del estado de carga
    if (status === 'loading' || (status === 'idle' && !todo)) {
        return (
            <Typography sx={{ mt: 4, textAlign: "center", fontWeight: 'bold' }}>
                Cargando tarea...
            </Typography>
        );
    }

    // 5. Manejo de error si el ID no existe en la base de datos
    if (!todo) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Tarea no encontrada
                </Typography>
                <Button variant="contained" onClick={() => navigate("/todos")}>
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/todos")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de tareas
            </Button>

            <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Detalle de Tarea
                    </Typography>
                    
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        {todo.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        ID de Tarea: #{todo.id}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        ID de Usuario: {todo.userId}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">Estado:</Typography>
                        <Chip 
                            label={todo.completed ? "Completada" : "Pendiente"} 
                            color={todo.completed ? "success" : "warning"}
                            variant="filled"
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}