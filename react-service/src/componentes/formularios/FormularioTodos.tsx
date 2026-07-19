import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Todo } from '../../modelo/Todo';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (todo: Todo) => Promise<void>;
    todoEditar?: Todo | undefined;
};

const estadoInicial: Todo = {
    userId: 1,
    title: "",
    completed: false
};

export default function FormularioTodo({ open, onClose, onGuardar, todoEditar }: Props) {

    const [todo, setTodo] = useState<Todo>(estadoInicial);

    useEffect(() => {
        if (open) {
            setTodo(todoEditar ?? estadoInicial);
        }
    }, [todoEditar, open]);

    const formularioValido =
        todo.title.trim() !== "" &&
        todo.userId > 0;

    const cambiarCampo = (campo: keyof Todo, valor: string | number | boolean) => {
        setTodo({
            ...todo,
            [campo]: valor
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                {todoEditar ? "Editar Tarea" : "Nueva Tarea"}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    
                    <Grid size={12}>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            Detalles del Todo
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="ID del Usuario"
                            value={todo.userId || ""}
                            error={!todo.userId || todo.userId <= 0}
                            helperText={!todo.userId || todo.userId <= 0 ? "ID debe ser mayor a 0" : ""}
                            onChange={(e) => cambiarCampo("userId", Number(e.target.value))}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="Título de la Tarea"
                            value={todo.title}
                            error={todo.title.trim() === ""}
                            onChange={(e) => cambiarCampo("title", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={todo.completed}
                                    onChange={(e) => cambiarCampo("completed", e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="¿Tarea completada?"
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disabled={!formularioValido}
                    onClick={async () => {
                        await onGuardar(todo);
                    }}
                >
                    {todoEditar ? "Guardar Cambios" : "Crear Tarea"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}