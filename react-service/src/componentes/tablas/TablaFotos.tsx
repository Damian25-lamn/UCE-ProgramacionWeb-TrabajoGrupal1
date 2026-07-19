import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Photo } from "../../modelo/Photo";

type Props = {
    fotos: Photo[];
    onEditar: (foto: Photo) => void;
    onEliminar: (foto: Photo) => void;
    onVer: (foto: Photo) => void;
};

export default function TablaFotos({ fotos, onEditar, onEliminar, onVer }: Props) {

    const columnas = useMemo<GridColDef<Photo>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { 
            field: "thumbnailUrl", 
            headerName: "Miniatura", 
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <img 
                    src={params.value} 
                    alt="thumbnail" 
                    style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', marginTop: 5 }} 
                />
            )
        },
        { field: "albumId", headerName: "ID Álbum", width: 90 },
        { field: "title", headerName: "Título", flex: 1 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton color="info" onClick={() => onVer(params.row)}>
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => onEditar(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onEliminar(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ], [onEditar, onEliminar, onVer]);

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={fotos}
                columns={columnas}
                rowHeight={60}
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