import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Comment } from '../../modelo/Comment';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (comentario: Comment) => Promise<void>;
    comentarioEditar?: Comment | undefined;
};

const estadoInicial: Comment = {
    postId: 1, // Valor inicial por defecto para asociar a un post
    name: "",
    email: "",
    body: ""
};

export default function FormularioComentario({ open, onClose, onGuardar, comentarioEditar }: Props) {

    const [comentario, setComentario] = useState<Comment>(estadoInicial);

    useEffect(() => {
        if (open) {
            setComentario(comentarioEditar ?? estadoInicial);
        }
    }, [comentarioEditar, open]);

    const formularioValido =
        comentario.name.trim() !== "" &&
        comentario.email.trim() !== "" &&
        comentario.body.trim() !== "" &&
        comentario.postId > 0;

    const cambiarCampo = (campo: keyof Comment, valor: string | number) => {
        setComentario({
            ...comentario,
            [campo]: valor
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                {comentarioEditar ? "Editar Comentario" : "Nuevo Comentario"}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    
                    {/* ──────────────────────────────────
                        INFORMACIÓN DEL COMENTARIO
                       ────────────────────────────────── */}
                    <Grid size={12}>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            Datos del Comentario
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="ID del Post Asociado"
                            value={comentario.postId || ""}
                            error={!comentario.postId || comentario.postId <= 0}
                            helperText={
                                !comentario.postId || comentario.postId <= 0
                                    ? "ID debe ser mayor a 0"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("postId", Number(e.target.value))}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 8 }}>
                        <TextField
                            fullWidth
                            required
                            label="Asunto / Nombre del Comentario"
                            value={comentario.name}
                            error={comentario.name.trim() === ""}
                            helperText={
                                comentario.name.trim() === ""
                                    ? "El nombre/asunto es obligatorio"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("name", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            type="email"
                            label="Correo Electrónico del Autor"
                            value={comentario.email}
                            error={comentario.email.trim() === ""}
                            helperText={
                                comentario.email.trim() === ""
                                    ? "El correo es obligatorio"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("email", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={4}
                            label="Contenido del Comentario (Body)"
                            value={comentario.body}
                            error={comentario.body.trim() === ""}
                            helperText={
                                comentario.body.trim() === ""
                                    ? "El contenido no puede estar vacío"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("body", e.target.value)}
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
                        await onGuardar(comentario);
                    }}
                >
                    {comentarioEditar ? "Guardar Cambios" : "Crear Comentario"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}