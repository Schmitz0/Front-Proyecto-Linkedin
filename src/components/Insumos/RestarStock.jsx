import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, IconButton, TableCell, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import swal from 'sweetalert';
import { postMovimientoInsumo } from "../../redux/actions";


const RestarStock = (props) => {
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

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleActualizar1 = () => {
    dispatch(postMovimientoInsumo(input))
		.then(() => {
      props.onStockChange(props.id)
      handleClose1();
    })
  };

  const handleClose1 = () => {
    setOpen1(false);
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
          </>
          )
        }

export default RestarStock;