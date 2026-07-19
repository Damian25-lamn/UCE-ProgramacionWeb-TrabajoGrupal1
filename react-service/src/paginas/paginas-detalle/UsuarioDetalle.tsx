import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { User } from "../../modelo/User";

//1. 1. Importamos los hooks de Redux y la acción de carga
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchUsers } from "../../slices/UserSlice";

export default function UsuarioDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    //2. Buscamos el usuario directamente en el estado global de Redux
    const usuario = useAppSelector((state) =>
        state.users.users.find((u) => u.id === Number(id))
    ) as User | undefined;
    
    const status = useAppSelector((state) => state.users.status);

    //3. Si recargaron la página estando en esta ruta, le pedimos a Redux que traiga los datos
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    //4. Manejamos el estado de carga
    if (status === 'loading' || (status === 'idle' && !usuario)) {
        return (
            <Typography sx={{ mt: 4, textAlign: 'center', fontWeight: 'bold' }}>
                Cargando información del usuario...
            </Typography>
        );
    }

    //5. Manejamos el caso donde el ID no existe en la base de datos
    if (!usuario) {
        return (
            <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Usuario no encontrado
                </Typography>
                <Button variant="contained" onClick={() => navigate("/usuarios")}>
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/usuarios")}
                sx={{ mb: 2 }}
            >
                Regresar a la lista de Usuarios
            </Button>

            <Typography variant="h4" gutterBottom>
                {usuario.name}
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6">Información Personal</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography><b>Usuario:</b></Typography>
                            <Typography>{usuario.username}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Correo:</b></Typography>
                            <Typography>{usuario.email}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Teléfono:</b></Typography>
                            <Typography>{usuario.phone}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Sitio Web:</b></Typography>
                            <Typography>{usuario.website}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6">Dirección</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={6}>
                            <Typography><b>Calle:</b></Typography>
                            <Typography>{usuario.address.street}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Suite:</b></Typography>
                            <Typography>{usuario.address.suite}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Ciudad:</b></Typography>
                            <Typography>{usuario.address.city}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Código Postal:</b></Typography>
                            <Typography>{usuario.address.zipcode}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Latitud:</b></Typography>
                            <Typography>{usuario.address.geo.lat}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography><b>Longitud:</b></Typography>
                            <Typography>{usuario.address.geo.lng}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6">Empresa</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <Typography><b>Nombre:</b></Typography>
                            <Typography>{usuario.company.name}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><b>Catch Phrase:</b></Typography>
                            <Typography>{usuario.company.catchPhrase}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography><b>BS:</b></Typography>
                            <Typography>{usuario.company.bs}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}