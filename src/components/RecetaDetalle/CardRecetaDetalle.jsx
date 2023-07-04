import React from "react";
import { TableCell, TableRow, TableHead, Table } from '@mui/material';


export default function CardRecetaDetalle(props) {
return (
    <>
     
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row">{props.nombre}</TableCell>
        <TableCell align="right">{props.id}</TableCell>
        <TableCell align="right">{props.categoria}</TableCell>
        <TableCell align="right">{props.cantidad}</TableCell>
        <TableCell align="right">{props.unidad}</TableCell>
        <TableCell align="right">{props.costo}</TableCell>
      </TableRow>
    </>
  );
}