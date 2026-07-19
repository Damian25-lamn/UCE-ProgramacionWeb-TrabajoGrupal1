import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { User } from "../../modelo/User";

type Props = {
    usuarios: User[];
    onEditar: (usuario: User) => void;
    onEliminar: (usuario: User) => void;
    onVer: (usuario: User) => void;
};

export default function TablaUsuarios({ usuarios, onEditar, onEliminar, onVer }: Props) {
    
    const columnas = useMemo<GridColDef<User>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "username", headerName: "Usuario", flex: 1 },
        { field: "email", headerName: "Correo", flex: 1 },
        {
            field: "city",
            headerName: "Ciudad",
            flex: 1,
            valueGetter: (_, row) => row.address?.city,
        },
        {
            field: "company",
            headerName: "Empresa",
            flex: 1,
            valueGetter: (_, row) => row.company?.name,
        },
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
                rows={usuarios}
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