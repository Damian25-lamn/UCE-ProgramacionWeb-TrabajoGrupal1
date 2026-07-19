import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Album } from '../../modelo/Album';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (album: Album) => Promise<void>;
    albumEditar?: Album | undefined;
};

const estadoInicial: Album = {
    userId: 1,
    title: ""
};

export default function FormularioAlbum({ open, onClose, onGuardar, albumEditar }: Props) {

    const [album, setAlbum] = useState<Album>(estadoInicial);

    useEffect(() => {
        if (open) {
            setAlbum(albumEditar ?? estadoInicial);
        }
    }, [albumEditar, open]);

    const formularioValido =
        album.title.trim() !== "" &&
        album.userId > 0;

    const cambiarCampo = (campo: keyof Album, valor: string | number) => {
        setAlbum({
            ...album,
            [campo]: valor
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                {albumEditar ? "Editar Álbum" : "Nuevo Álbum"}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    
                    <Grid size={12}>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            Datos del Álbum
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="ID del Usuario"
                            value={album.userId || ""}
                            error={!album.userId || album.userId <= 0}
                            helperText={
                                !album.userId || album.userId <= 0
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
                            label="Título del Álbum"
                            value={album.title}
                            error={album.title.trim() === ""}
                            helperText={
                                album.title.trim() === ""
                                    ? "El título es obligatorio"
                                    : ""
                            }
                            onChange={(e) => cambiarCampo("title", e.target.value)}
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
                        await onGuardar(album);
                    }}
                >
                    {albumEditar ? "Guardar Cambios" : "Crear Álbum"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}