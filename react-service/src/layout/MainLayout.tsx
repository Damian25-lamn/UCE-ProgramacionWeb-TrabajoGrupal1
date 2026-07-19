import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import ImageIcon from '@mui/icons-material/Image';
import TaskIcon from '@mui/icons-material/Task';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
    const menu = [
    {
        texto: "Dashboard",
        ruta: "/",
        icono: <DashboardIcon />
    },
    {
        texto: "Usuarios",
        ruta: "/usuarios",
        icono: <PeopleIcon />
    },
    {
        texto: "Posts",
        ruta: "/posts",
        icono: <ArticleIcon />
    },
    {
        texto: "Comentarios",
        ruta: "/comentarios",
        icono: <CommentIcon />
    },
    {
        texto: "Albums",
        ruta: "/albums",
        icono: <PhotoAlbumIcon />
    },
    {
        texto: "Fotos",
        ruta: "/fotos",
        icono: <ImageIcon />
    },
    {
        texto: "Todos",
        ruta: "/todos",
        icono: <TaskIcon />
    }
];
    return (
        <Box sx={{ display: "flex" }}>

            {/* Barra superior */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>

                    <Typography variant="h6" noWrap>

                        API REST HELIDON

                    </Typography>

                </Toolbar>
            </AppBar>


            {/* Menú lateral */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,

                    "& .MuiDrawer-paper": {
                        width: 240,
                        boxSizing: "border-box",
                    },
                }}
            >

                {/* Espacio para que el menú empiece debajo del AppBar */}
                <Toolbar />

                <List>

                    {menu.map((item) => (

                        <ListItem key={item.texto} disablePadding>

                            <ListItemButton
                                component={Link}
                                to={item.ruta}
                            >

                                <ListItemIcon>
                                    {item.icono}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.texto}
                                />

                            </ListItemButton>

                        </ListItem>

                    ))}

                </List>

            </Drawer>


            {/* Contenido principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >

                {/* Deja espacio para el AppBar */}
                <Toolbar />

                <Outlet />

            </Box>

        </Box>
    );
}