import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Album } from "../../modelo/Album";

type Props = {
    albums: Album[];
    onEditar: (album: Album) => void;
    onEliminar: (album: Album) => void;
    onVer: (album: Album) => void;
};

export default function TablaAlbums({ albums, onEditar, onEliminar, onVer }: Props) {

    const columnas = useMemo<GridColDef<Album>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "userId", headerName: "ID Usuario", width: 100 },
        { field: "title", headerName: "Título del Álbum", flex: 1 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="info"
                        onClick={() => onVer(params.row)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => onEditar(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => onEliminar(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ], [onEditar, onEliminar, onVer]);

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={albums}
                columns={columnas}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
            />
        </div>
    );
}