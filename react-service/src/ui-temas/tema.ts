import { createTheme } from "@mui/material/styles";

const tema = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#9c27b0",
        },
        background: {
            default: "#f5f5f5",
        },
    },

    typography: {
        fontFamily: "Roboto, sans-serif",
    },

    shape: {
        borderRadius: 10,
    },
});

export default tema;