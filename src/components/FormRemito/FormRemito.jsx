import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { getAllInsumos, getAllProveedores, getInsumoDetalle, postRemito } from "../../redux/actions";
import { TableCell, TableRow, TableHead, Table, Paper, TableContainer, TableBody } from "@mui/material";
import NavBar from "../NavBar/NavBar";
import style from "./FormRemitoDetalle.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, Typography, FormControl } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { format } from "date-fns";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  datePicker: {
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      filter: "invert(1)",
    },
  },
}));

const FormReceta = () => {
  const classes = useStyles();
  const theme = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getAllProveedores());
  }, [dispatch]);

  const insumosGlobal = useSelector((state) => state.insumos);
  const insumoDetalle = useSelector((state) => state.insumoDetalle);
  const proveedoresGlobal = useSelector((state) => state.proveedores);

  const categoria = insumosGlobal.map((e) => e.categoria);
  const categorias = [...new Set(categoria)];

  const unidad = insumosGlobal.map((e) => e.unidad);
  const unidades = [...new Set(unidad)];

  const proveedores = proveedoresGlobal.map((e) => e.nombre);

  const [submitted, setSubmitted] = useState(false);
  const [areAllFieldsComplete, setAreAllFieldsComplete] = useState(false);

  const [input, setInput] = useState({
    proveedorId: "",
    numeroRemito: "",
    fecha: "",
    insumos: [],
  });
  const [state, setState] = useState({
    nombre: "",
    id: "",
    cantidad: "",
    precio: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange2 = (event) => {
    event.preventDefault();
    if (event.target.name === "id") {
      const number = Number(event.target.value);
      const nombreFinal = insumosGlobal?.filter(
        (e) => e.id === event.target.value
      );

      setState({
        ...state,
        [event.target.name]: number,
        nombre: nombreFinal[0].nombre,
      });
    } else if (
      event.target.name === "cantidad" ||
      event.target.name === "v" ||
      event.target.name === "precio"
    ) {
      const number = Number(event.target.value);
      setState({
        ...state,
        [event.target.name]: number,
      });
    }
  };

  const handleChange = (event) => {
    event.preventDefault();

    if (
      // event.target.name === "numeroRemito" ||
      event.target.name === "proveedorId"
    ) {
      const number = Number(event.target.value);
      setInput({
        ...input,
        [event.target.name]: number,
      });
    } else if (event.target.name === "fecha") {
      const dateValue = event.target.value;
      const [year, month, day] = dateValue.split("-");
      const selectedDate = new Date(year, month - 1, day); 

      setInput({
        ...input,
        fecha: format(selectedDate, "dd/MM/yyyy"), 
      });
      setSelectedDate(selectedDate); 
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
      
      const {id, cantidad, precio} = state
      const { proveedorId,  numeroRemito } = input;
      const fieldsComplete = numeroRemito.trim() !== '' && proveedorId.trim() !== '' && id.trim() !== '' && cantidad.trim() !== '' && precio.trim() !== '';
      setAreAllFieldsComplete(fieldsComplete);
    }
  };

  const handlerClick = async (e) => {
    e.preventDefault();
    setSubmitted(true);
  
    if (state.nombre === "" || state.cantidad === "" || state.precio === "") {
      console.log('No se pueden procesar los datos debido a campos incompletos.');
      return;
    }
  
    input.insumos.push(state);
    setState({
      id: "",
      nombre: "",
      cantidad: "",
      precio: "",
    });
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(postRemito(input));
    swal({
      title: "Esta seguro de crear un nuevo remito?",
      text: "Revise haber ingresado todos los insumos necesarios.",
      icon: "warning",
      buttons: true,
      // dangerMode: true,
    }).then((create) => {
      if (create) {
        dispatch(postRemito(input));
        swal(`El remito fue creado con éxito`, {
          icon: "success",
        }).then(() => {
          navigate(`/remito`);
        });
      } else {
        swal("Puede seguir agregando insumos al remito");
      }
    });
  };

  return (
    <>
      <div>
        <div>
          <NavBar />
          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: "center" }}>
              
              <div className={style.selectContainer}>
                {/* <Typography
                  textAlign="center"
                  sx={{
                    m: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "roboto",
                    fontWeight: 700,
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Ingresar remito
                </Typography> */}
                <Box>
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    type="text"
                    inputProps={{ min: 0 }}
                    name="numeroRemito"
                    variant="outlined"
                    placeholder="Numero de Remito..."
                    label="Numero de Remito"
                    onChange={handleChange}
                    value={input.numeroRemito}
                    error={submitted && input.numeroRemito === ''}
                    helperText={submitted && input.numeroRemito === '' ? 'Este campo es requerido' : ''}
                  />

                  <FormControl name="nombre" value={input.proveedorId}>
                    <Select
                      sx={{ m: 1, width: 300, height: "auto" }}
                      displayEmpty
                      name="proveedorId"
                      value={input.proveedorId}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ "aria-label": "Without label" }}
                      error={submitted && input.proveedorId === ''}
                      helperText={submitted && input.proveedorId === '' ? 'Este campo es requerido' : ''}
                    >
                      <MenuItem disabled value="">
                        <span>Nombre Proveedor</span>
                      </MenuItem>
                      {proveedoresGlobal?.map((e, i) => (
                        <MenuItem key={i} value={e.id}>
                          {e.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    // className={classes.datePicker}
                    sx={{ m: 1, width: 300 }}
                    required
                    name="fecha"
                    type="date"
                    variant="outlined"
                    placeholder="Fecha de carga..."
                    className={style.customTextfield}
                    onChange={handleChange}
                    value={
                      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                    } // Formatear la fecha seleccionada como "yyyy-MM-dd" para el valor del TextField
                    InputLabelProps={{
                      shrink: selectedDate !== null, // Encoger la etiqueta si hay una fecha seleccionada
                    }}
                   
                   
                  />
                  <FormControl name="nombre" value={state.nombre}>
                    <Select
                      sx={{ m: 1, width: 300, height: "auto" }}
                      displayEmpty
                      name="id"
                      value={state.id}
                      onChange={handleChange2}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ "aria-label": "Without label" }}
                      error={submitted && state.id === ''}
                      helperText={submitted && state.id === '' ? 'Este campo es requerido' : ''}
                    >
                      <MenuItem disabled value="">
                        <span>Nombre del insumo</span>
                      </MenuItem>
                      {insumosGlobal?.map((e, i) => (
                        <MenuItem key={i} value={e.id}>
                          {e.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    type="number"
                    inputProps={{ min: 0 }}
                    name="cantidad"
                    variant="outlined"
                    placeholder="Cantidad..."
                    label="Cantidad"
                    onChange={handleChange2}
                    value={state.cantidad}
                    error={submitted && state.cantidad === ''}
                      helperText={submitted && state.cantidad === '' ? 'Este campo es requerido' : ''}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="precio"
                    type="number"
                    inputProps={{ min: 0 }}
                    variant="outlined"
                    placeholder="Precio..."
                    label="Precio"
                    onChange={handleChange2}
                    value={state.precio}
                    error={submitted && state.precio === ''}
                      helperText={submitted && state.precio === '' ? 'Este campo es requerido' : ''}
                  />
                </Box>
              </div>

              <Button
                className={style.boton}
                // disabled={
                //   !state.id || !state.nombre || !state.cantidad || !state.precio
                // }
                onClick={handlerClick}
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
                Agregar insumos
              </Button>

              <div className={style.mainContainer}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">Id</TableCell>
                        <TableCell>Nombre </TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Precio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {input.insumos?.map((e, i) => (
                        <TableRow
                          key={i}
                          value={e}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="right">{e.id}</TableCell>
                          <TableCell align="left">{e.nombre}</TableCell>
                          <TableCell align="right">{e.cantidad}</TableCell>
                          <TableCell align="right">{e.precio}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className={style.botonContainer}>
                <Button
                  className={style.boton}
                  disabled={
                    !input.insumos.length ||
                    !input.proveedorId ||
                    !input.numeroRemito ||
                    !input.fecha
                  }
                  type="submit"
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
                  Ingresar remito
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormReceta;
