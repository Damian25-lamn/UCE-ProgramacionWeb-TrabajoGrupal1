import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Post } from "../../modelo/Post";

type Props = {
    posts: Post[];
    onEditar: (post: Post) => void;
    onEliminar: (post: Post) => void;
    onVer: (post: Post) => void;
};

export default function TablaPosts({ posts, onEditar, onEliminar, onVer }: Props) {
    
    const columnas = useMemo<GridColDef<Post>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "userId", headerName: "ID Usuario", width: 100 },
        { field: "title", headerName: "Título", flex: 1 },
        { field: "body", headerName: "Contenido", flex: 2 },
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
                      onClick={() => onEditar(params.row)}>
                        <EditIcon />
                    </IconButton>
                    
                    <IconButton
                        color="error"
                        onClick={() => onEliminar(params.row)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ], [onEditar, onEliminar, onVer]);

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={posts}
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