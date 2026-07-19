import { useMemo } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Todo } from "../../modelo/Todo";

type Props = {
    todos: Todo[];
    onEditar: (todo: Todo) => void;
    onEliminar: (todo: Todo) => void;
    onVer: (todo: Todo) => void;
};

export default function TablaTodos({ todos, onEditar, onEliminar, onVer }: Props) {

    const columnas = useMemo<GridColDef<Todo>[]>(() => [
        { field: "id", headerName: "ID", width: 70 },
        { field: "userId", headerName: "Usuario ID", width: 100 },
        { field: "title", headerName: "Tarea", flex: 1 },
        { 
            field: "completed", 
            headerName: "Completada", 
            width: 120,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.value} 
                    disabled 
                    color="primary" 
                />
            )
        },
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
                rows={todos}
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