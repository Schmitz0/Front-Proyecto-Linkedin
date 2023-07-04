import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecetaDetalle, postMovimientoReceta } from '../../redux/actions/index.js';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar.jsx';
import { Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {
  TableCell,
  TableRow,
  TableHead,
  Table,
  Paper,
  TableBody,
  TableContainer,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardRecetaDetalle from './CardRecetaDetalle.jsx';
import style from './RecetaDetalle.module.css';

export default function RecetaDetalle(props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const detail = useSelector((state) => state.recetaDetalle);

  const [input, setInput] = useState({
    tipoDeMovimiento: "Receta",
    motivo: "",
    cantidadProducida: "",
  })

  useEffect(() => {
    dispatch(getRecetaDetalle(id));
  }, [dispatch, id]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    if (event.target.name === "cantidadProducida") {
      const number = Number(event.target.value)
      setInput({
        ...input,
        [event.target.name]: number,
      })
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
    }
  };
  const handleActualizar = () => {
    dispatch(postMovimientoReceta(input, id))
    setOpen(false);
  };


  return (
    <>
      <NavBar />

      <Link to={'/recetas'} style={{ textDecoration: 'none' }}>
        <ArrowBackIcon />
      </Link>

      <h1>{detail.name}</h1>

      <Button
        className={style.boton}
        onClick={handleClickOpen}
        value={id}
        sx={{
          paddingRight: "25px",
          paddingLeft: "25px",
          marginBottom: "10px",
          color: "white",
          borderRadius: "6px",
          background: "#2779ff",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "#5151519c",
            transition: "1s",
          },
        }}
      >
        producir
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creacion de producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione la cantidad a producir.
          </DialogContentText>
          <TextField

            margin="dense"
            label="Motivo"
            fullWidth
            variant="standard"
            name="motivo"
            onChange={handleChange}
            value={input.motivo}
          />
          <TextField

            margin="dense"
            label="Cantidad Producida"
            fullWidth
            variant="standard"
            name="cantidadProducida"
            onChange={handleChange}
            value={input.cantidadProducida}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleActualizar}>Actualizar</Button>
        </DialogActions>
      </Dialog>

      <div className={style.mainContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre </TableCell>
                <TableCell align="right">Id</TableCell>
                <TableCell align="right">Categoría</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Unidad de medida</TableCell>
                <TableCell align="right">Costo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.Insumos?.map((e, i) => {
                return (
                  <CardRecetaDetalle
                    key={i}
                    id={e.id}
                    nombre={e.nombre}
                    categoria={e.categoria}
                    cantidad={e.InsumoReceta.cantidad}
                    unidad={e.unidad}
                    costo={e.InsumoReceta.costo}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>

      </div>

    </>
  );
}
