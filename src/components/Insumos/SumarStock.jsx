import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, IconButton, TableCell, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import swal from 'sweetalert';
import { postMovimientoInsumo } from "../../redux/actions";


const SumarStock = (props) => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false);
  
  const [input, setInput] = React.useState({
        motivo: '',
        tipoDeMovimiento: "Movimiento de insumo",
        tipo: "",
        insumos: [{
          id: props.id,
          cantidad: "",
        }
        ]
      })

  const handleClickOpen = () => {
    setOpen(true);
  };

    const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSum = (event) => {
    setInput({
      ...input,
      tipo: 'suma',
      [event.target.name]: event.target.value,
    });
  };

  const handleActualizar = () => {
    dispatch(postMovimientoInsumo(input))
		.then(() => {
      props.onStockChange(props.id)
      handleClose();
    })
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
        <IconButton key={props.id} value={props.id} onClick={handleClickOpen} sx={{ color: 'blue', }}><AddIcon/></IconButton>

				  <Dialog open={open} onClose={handleClose}>

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
              <Button onClick={handleActualizar} disabled={!input.motivo} >Actualizar</Button>
            </DialogActions>
          </Dialog>
          </>
          )
        }

export default SumarStock