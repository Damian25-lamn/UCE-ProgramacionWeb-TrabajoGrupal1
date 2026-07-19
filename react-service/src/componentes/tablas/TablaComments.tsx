import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Comment } from "../../modelo/Comment";

type Props = {
    comentarios: Comment[];
    onEditar: (comentario: Comment) => void;
    onEliminar: (comentario: Comment) => void;
    onVer: (comentario: Comment) => void;
};

export default function TablaComentarios({ comentarios, onEditar, onEliminar, onVer }: Props) {
    
    const columnas = useMemo<GridColDef<Comment>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "postId", headerName: "ID Post", width: 90 },
        { field: "name", headerName: "Asunto / Nombre", flex: 1 },
        { field: "email", headerName: "Correo Autor", flex: 1 },
        { field: "body", headerName: "Comentario", flex: 2 },
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
                rows={comentarios}
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