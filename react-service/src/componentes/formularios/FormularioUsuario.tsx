import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import type { User } from '../../modelo/User';
import {useEffect, useState } from 'react';
import type { Address } from '../../modelo/user-componentes/Adress';
import type { Company } from '../../modelo/user-componentes/Company';

type Props = {
    open: boolean;
    onClose: () => void;
    onGuardar: (usuario: User) => Promise<void>;
    usuarioEditar?: User | undefined;
};

const estadoInicial: User = {
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: { lat: "", lng: "" }
    },
    company: {
        name: "",
        catchPhrase: "",
        bs: ""
    }
};

export default function FormularioUsuario({ open, onClose, onGuardar, usuarioEditar }: Props) {

    const [usuario, setUsuario] = useState<User>(estadoInicial);

    useEffect(() => {

    if (open) {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsuario(usuarioEditar ?? estadoInicial);

    }

}, [usuarioEditar, open]);

  const formularioValido =
    usuario.name.trim() !== "" &&
    usuario.username.trim() !== "" &&
    usuario.email.trim() !== "" &&
    usuario.phone.trim() !== "";
    
    const cambiarDireccion = (
      campo: keyof Address,
      valor: string
    ) => {
        setUsuario({
            ...usuario,
            address: {
                ...usuario.address,
                [campo]: valor,
            },
        });
    };

    const cambiarGeo = (
      campo: "lat" | "lng",
      valor: string
    ) => {
        setUsuario({
            ...usuario,
            address: {
                ...usuario.address,
                geo: {
                    ...usuario.address.geo,
                    [campo]: valor,
                },
            },
        });
    };


    const cambiarEmpresa = (
      campo: keyof Company,
      valor: string
    ) => {
        setUsuario({
            ...usuario,
            company: {
                ...usuario.company,
                [campo]: valor,
            },
        });
    };
    const cambiarCampo = (campo: keyof User, valor: string) => {
      setUsuario({
            ...usuario,
            [campo]: valor
        });
    };

    
    return (
       <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
      {usuarioEditar ? "Editar Usuario" : "Nuevo Usuario"}
    </DialogTitle>
    
    <DialogContent dividers>
      <Grid container spacing={2}>
        
        {/* ──────────────────────────────────
            INFORMACIÓN PERSONAL 
           ────────────────────────────────── */}
        <Grid size={12}>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
            Información Personal
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
              fullWidth
              required
              label="Nombre"
              value={usuario.name}
              error={usuario.name.trim() === ""}
              helperText={
                  usuario.name.trim() === ""
                      ? "El nombre es obligatorio"
                      : ""
              }
              onChange={(e) => cambiarCampo("name", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
              fullWidth
              required
              label="Usuario"
              value={usuario.username}
              error={usuario.username.trim() === ""}
              helperText={
                  usuario.username.trim() === ""
                      ? "El usuario es obligatorio"
                      : ""
              }
              onChange={(e) => cambiarCampo("username", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
              fullWidth
              required
              label="Correo"
              value={usuario.email}
              error={usuario.email.trim() === ""}
              helperText={
                  usuario.email.trim() === ""
                      ? "El correo es obligatorio"
                      : ""
              }
              onChange={(e) => cambiarCampo("email", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
              fullWidth
              required
              label="Teléfono"
              value={usuario.phone}
              error={usuario.phone.trim() === ""}
              helperText={
                  usuario.phone.trim() === ""
                      ? "El teléfono es obligatorio"
                      : ""
              }
              onChange={(e) => cambiarCampo("phone", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Sitio Web"
            value={usuario.website}
            onChange={(e) => cambiarCampo("website", e.target.value)}
          />
        </Grid>

        {/* Espacio estético */}
        <Grid size={12} sx={{ mt: 2 }} />

        {/* ──────────────────────────────────
            DIRECCIÓN 
           ────────────────────────────────── */}
        <Grid size={12}>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
            Dirección
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Calle"
            value={usuario.address.street}
            onChange={(e) => cambiarDireccion("street", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Suite"
            value={usuario.address.suite}
            onChange={(e) => cambiarDireccion("suite", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ciudad"
            value={usuario.address.city}
            onChange={(e) => cambiarDireccion("city", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Código Postal"
            value={usuario.address.zipcode}
            onChange={(e) => cambiarDireccion("zipcode", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Latitud"
            value={usuario.address.geo.lat}
            onChange={(e) => cambiarGeo("lat", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Longitud"
            value={usuario.address.geo.lng}
            onChange={(e) => cambiarGeo("lng", e.target.value)}
          />
        </Grid>

        {/* Espacio estético */}
        <Grid size={12} sx={{ mt: 2 }} />

        {/* ──────────────────────────────────
            EMPRESA 
           ────────────────────────────────── */}
        <Grid size={12}>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
            Empresa
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Nombre Empresa"
            value={usuario.company.name}
            onChange={(e) => cambiarEmpresa("name", e.target.value)}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Catch Phrase"
            value={usuario.company.catchPhrase}
            onChange={(e) => cambiarEmpresa("catchPhrase", e.target.value)}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="BS"
            value={usuario.company.bs}
            onChange={(e) => cambiarEmpresa("bs", e.target.value)}
          />
        </Grid>

      </Grid>
    </DialogContent>

    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} color="inherit">
        Cancelar
      </Button>
      <Button
        variant="contained"
        disabled={!formularioValido}
        onClick={async () => {

          await onGuardar(usuario);

        }}
    >
        {usuarioEditar ? "Guardar Cambios" : "Crear Usuario"}
      </Button>
    </DialogActions>
  </Dialog>
    );
}