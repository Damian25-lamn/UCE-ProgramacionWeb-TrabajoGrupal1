import { Box, Typography, Card, CardContent, Grid, Avatar, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate();

    const integrantes = [
        "Mouaaz Alammarin",
        "Damian Minda",
        "Francis Pulles",
        "Santiago Villarreal"
    ];

    return (
        <Box sx={{ mt: 6, mx: 'auto', maxWidth: 900, px: 3 }}>
            <Card sx={{ boxShadow: 4, borderRadius: 3, textAlign: 'center', p: 2 }}>
                <CardContent>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ¡Bienvenido, Docente Jaime Salvador M.!
                    </Typography>
                    
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Asignatura: Programación Web
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Trabajo Grupal: API REST HELIDON SE 4.5
                    </Typography>

                    <Divider sx={{ my: 4 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ px: 2 }}>
                            Integrantes del Grupo 6
                        </Typography>
                    </Divider>

                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                        {integrantes.map((nombre) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={nombre}>
                                <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa', height: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                                        {nombre.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {nombre}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 5 }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => navigate('/usuarios')}
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                        >
                            Comenzar a explorar la App
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}