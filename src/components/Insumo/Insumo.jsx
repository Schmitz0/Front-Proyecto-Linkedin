import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, IconButton, TableCell, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import swal from 'sweetalert';
import { postMovimientoInsumo } from "../../redux/actions";


const Insumo = (props) => {
  const insumos = useSelector((state) => state.insumos);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    motivo: '',
    tipoDeMovimiento: "Movimiento de insumo",
    tipo: "",
    insumos: [{
      id: props.id,
      cantidad: '',
    }
    ]
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleActualizar = () => {
    dispatch(postMovimientoInsumo(input))
    setOpen(false);
  };

  const handleActualizar1 = () => {
    dispatch(postMovimientoInsumo(input))
    setOpen1(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleChangeSum = (event) => {
    setInput({
      ...input,
      tipo: 'suma',
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeRes = (event) => {
    setInput({
      ...input,
      tipo: 'resta',
      [event.target.name]: event.target.value,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = isNaN(value) ? '' : Number(value);
    setInput(prevState => ({
      ...prevState,
      insumos: [
        {
          ...prevState.insumos[0],
          [name]: newValue,
        },
      ],
    }));
  };

 



  return (
    <>
   
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell align="right">{props?.id}</TableCell>
        <TableCell component="th" scope="row">{props?.nombre}</TableCell>
        <TableCell align="right">{props?.precio}</TableCell>
        <TableCell align="right">{props?.stock}</TableCell>
        <TableCell>
        
          <Link to={`/insumos/form/${props?.id}`}>
            <IconButton
              sx={{
                color: 'var(--black-color)',
              }}
            >
              <ModeEditIcon />
            </IconButton>
          </Link>

          <IconButton
            value={props.id}
            onClick={props.handlerClickDelete}
            sx={{
              color: 'blue',
            }}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton value={props.id} onClick={handleClickOpen} sx={{ color: 'blue', }}>
            <AddIcon />
          </IconButton>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Movimiento de Insumo</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Seleccione la cantidad a modificar
              </DialogContentText>
              <TextField

                margin="dense"
                label="Motivo"
                fullWidth
                variant="standard"
                name="motivo"
                onChange={handleChangeSum}
                value={input.motivo}
              />
              <TextField

                margin="dense"
                label="Cantidad"
                fullWidth
                variant="standard"
                name="cantidad"
                onChange={handleChange}
                value={input.cantidad}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleActualizar}>Actualizar</Button>
            </DialogActions>
          </Dialog>



          <IconButton value={props.id} onClick={handleClickOpen1} sx={{ color: 'blue', }}>
            <RemoveIcon />


          </IconButton>
          <Dialog open={open1} onClose={handleClose1}>
            <DialogTitle>Movimiento de Insumo</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Seleccione la cantidad a modificar.
              </DialogContentText>
              <TextField

                margin="dense"
                label="Motivo"
                fullWidth
                variant="standard"
                name="motivo"
                onChange={handleChangeRes}
                value={input.motivo}
              />
              <TextField

                margin="dense"
                label="Cantidad"
                fullWidth
                variant="standard"
                name="cantidad"
                onChange={handleChange}
                value={input.cantidad}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1}>Cancel</Button>
              <Button onClick={handleActualizar1}>Actualizar</Button>
            </DialogActions>
          </Dialog>

        </TableCell>

      </TableRow>
    </>
  )
}

export default Insumo;


