import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Proveedor = (props) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ width: 350 }}>
        <CardContent>
          <Typography><b>Proveedor:</b> {props.nombre}</Typography>
          <Typography><b>Nombre del contacto:</b> {props.nombreContacto}</Typography>
          <Typography><b>Email:</b> {props.email}</Typography>
          <Typography><b>Teléfono:</b> {props.telefono}</Typography>
          <Typography><b>Dirección:</b> {props.direccion}</Typography>
          <Typography><b>Código postal:</b> {props.codigoPostal}</Typography>
          <Typography><b>Descripción:</b> {props.descripcion}</Typography>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Proveedor;
