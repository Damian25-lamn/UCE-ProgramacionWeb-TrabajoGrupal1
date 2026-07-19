import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Photo } from '../../modelo/Photo';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (foto: Photo) => Promise<void>;
    fotoEditar?: Photo | undefined;
};

const estadoInicial: Photo = {
    albumId: 1,
    title: "",
    url: "",
    thumbnailUrl: ""
};

export default function FormularioFoto({ open, onClose, onGuardar, fotoEditar }: Props) {

    const [foto, setFoto] = useState<Photo>(estadoInicial);

    useEffect(() => {
        if (open) {
            setFoto(fotoEditar ?? estadoInicial);
        }
    }, [fotoEditar, open]);

    const formularioValido =
        foto.title.trim() !== "" &&
        foto.url.trim() !== "" &&
        foto.thumbnailUrl.trim() !== "" &&
        foto.albumId > 0;

    const cambiarCampo = (campo: keyof Photo, valor: string | number) => {
        setFoto({
            ...foto,
            [campo]: valor
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                {fotoEditar ? "Editar Foto" : "Nueva Foto"}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    
                    <Grid size={12}>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            Detalles de la Foto
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="ID del Álbum Asociado"
                            value={foto.albumId || ""}
                            error={!foto.albumId || foto.albumId <= 0}
                            helperText={!foto.albumId || foto.albumId <= 0 ? "ID debe ser mayor a 0" : ""}
                            onChange={(e) => cambiarCampo("albumId", Number(e.target.value))}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="Título de la Foto"
                            value={foto.title}
                            error={foto.title.trim() === ""}
                            onChange={(e) => cambiarCampo("title", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="URL de la Imagen"
                            value={foto.url}
                            error={foto.url.trim() === ""}
                            onChange={(e) => cambiarCampo("url", e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            label="URL de la Miniatura"
                            value={foto.thumbnailUrl}
                            error={foto.thumbnailUrl.trim() === ""}
                            onChange={(e) => cambiarCampo("thumbnailUrl", e.target.value)}
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
                        await onGuardar(foto);
                    }}
                >
                    {fotoEditar ? "Guardar Cambios" : "Crear Foto"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}