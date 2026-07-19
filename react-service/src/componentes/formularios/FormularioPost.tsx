import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Post } from '../../modelo/Post';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (post: Post) => Promise<void>;
    postEditar?: Post | undefined;
};

const estadoInicial: Post = {
    userId: 1, // Valor inicial por defecto para evitar campos vacíos
    title: "",
    body: ""
};

export default function FormularioPost({ open, onClose, onGuardar, postEditar }: Props) {

    const [post, setPost] = useState<Post>(estadoInicial);

    useEffect(() => {
        if (open) {
            setPost(postEditar ?? estadoInicial);
        }
    }, [postEditar, open]);

    const formularioValido =
        post.title.trim() !== "" &&
        post.body.trim() !== "" &&
        post.userId > 0;

    const cambiarCampo = (campo: keyof Post, valor: string | number) => {
        setPost({
            ...post,
            [campo]: valor
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                {postEditar ? "Editar Post" : "Nuevo Post"}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    
                    {/* ──────────────────────────────────
                        INFORMACIÓN DEL POST
                       ────────────────────────────────── */}
                    <Grid size={12}>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            Contenido de la Publicación
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="ID del Usuario (Autor)"
                            value={post.userId || ""}
                            error={!post.userId || post.userId <= 0}
                            helperText={
                                !post.userId || post.userId <= 0
                                    ? "ID debe ser mayor a 0"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("userId", Number(e.target.value))}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 8 }}>
                        <TextField
                            fullWidth
                            required
                            label="Título"
                            value={post.title}
                            error={post.title.trim() === ""}
                            helperText={
                                post.title.trim() === ""
                                    ? "El título es obligatorio"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("title", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={5}
                            label="Contenido (Body)"
                            value={post.body}
                            error={post.body.trim() === ""}
                            helperText={
                                post.body.trim() === ""
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
                        await onGuardar(post);
                    }}
                >
                    {postEditar ? "Guardar Cambios" : "Crear Post"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}