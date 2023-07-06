import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { getAllInsumos, getAllProveedores, getAllRecetas, postReceta, } from "../../redux/actions";
import { TableCell, TableRow, TableHead, Table, Paper, TableContainer, TableBody } from '@mui/material';
import NavBar from "../NavBar/NavBar";
import style from "./FormRecetaDetalle.module.css";
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, Typography, FormControl } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const FormReceta = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getAllProveedores());
    dispatch(getAllRecetas());
  }, [dispatch, useState]);

  const recetas = useSelector((state) => state.recetas);
  const insumosGlobal = useSelector((state) => state.insumos);
  const proveedoresGlobal = useSelector((state) => state.proveedores);

  const categoria = insumosGlobal.map((e) => e.categoria);
  const categorias = [...new Set(categoria)];

  const unidad = insumosGlobal.map((e) => e.unidad);
  const unidades = [...new Set(unidad)];

  const proveedores = proveedoresGlobal.map((e) => e.nombre);

  const [receta, setReceta] = useState({
    name: "",
    imgUrl:"",
    insumos: [],
  });

  const [insumox, setInsumox] = useState([])
  const [submitted, setSubmitted] = useState(false);
  const [areAllFieldsComplete, setAreAllFieldsComplete] = useState(false);

  const [state, setState] = useState({
    nombre: "",
    id: "",
    cantidad: "",
    // costoPorBotella: "",
    // costo: "",
    // precio: "",
  });

  const insumosDisponibles = insumosGlobal.filter(ig => !insumox.map(i => i.nombre).includes(ig.nombre));

  const handleChange = (event) => {
    event.preventDefault();
    let recetaName = event.target.value.toUpperCase();
    if (recetas.some(receta => receta.name === recetaName)) {
      setReceta({
        ...receta,
        [event.target.name]: recetaName,
        recetaError: true,
        recetaErrorMessage: `El nombre de la receta "${recetaName}" ya existe.`,
      });
    }
    else if (event.target.name === "name") {
      setReceta({
        ...receta,
        [event.target.name]: recetaName,
        recetaError: false,
        recetaErrorMessage: ``,
      });
      const { name } = receta;
      const { cantidad, id } = state;
      const fieldsComplete = name.trim() !== '' && cantidad.trim() !== '' && id.trim() !== '';
      setAreAllFieldsComplete(fieldsComplete);
      
    }
    
      
   
  };

  // const handleChangeImg = (event) => {
  //   event.preventDefault();
  //   if (event.target.name === "imgUrl") {
  //     setReceta({
  //       ...receta,
  //       [event.target.name]: event.target.value,
  //     });
  //   }
  // };

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
      event.target.name === "cantidad" 
      // || event.target.name === "costoPorBotella" 
      // || event.target.name === "costo" 
      // || event.target.name === "precio"
    ) {
      const number = Number(event.target.value);
      setState({
        ...state,
        [event.target.name]: number,
      });
    }
  };

  const handlerClick = (e) => {
    e.preventDefault();
    setSubmitted(true);
  
      if (state){
      const newInsumo = {
        id: state.id,
        nombre: state.nombre,
        cantidad: state.cantidad,
        // costoPorBotella: state.costoPorBotella,
        // costo: state.costo,
        // precio: state.precio,
      };
  
      setInsumox([...insumox, newInsumo]);
      setState({
        id: '',
        nombre: '',
        cantidad: '',
        // costoPorBotella: '',
        // costo: '',
        // precio: '',
      });
      if(submitted === true) {
        setSubmitted(false)
      }
    }
    
  };


  const HandleSubmit = async (e) => {
    e.preventDefault();
    receta.insumos = insumox;
  
    swal({
      title: 'Esta seguro de crear una nueva receta?',
      text: 'Revise haber ingresado todos los insumos necesarios.',
      icon: 'warning',
      buttons: true,
      // dangerMode: true,
    }).then((create) => {
      if (create ) {
        dispatch(postReceta(receta));
        swal(`La receta fue creada con éxito`, {
          icon: 'success',
        }).then(() => {
          navigate(`/produccion`);
        });
      } else {
        swal('Puede seguir agregando insumos en la receta');
      }
    });
  };
  return (
    <>
      <div>
        <NavBar />

        <Link to={'/produccion'} style={{ textDecoration: 'none' }}>
            <Button>
              <ArrowBackIcon /> Atrás 
            </Button>
          </Link> 

        <form onSubmit={HandleSubmit}>
          <FormControl sx={{ m: 1.5, alignItems: "center" }}>
            {/* <div>
              <Typography
                textAlign="center"
                sx={{
                  m: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "roboto",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Crear nueva receta
              </Typography>
            </div> */}
            <div className={style.inputContainer}>
              <Box>
                <TextField
                  sx={{ m: 1, width: 300}}
                  required

                  name="name"
                  variant="outlined"
                  placeholder="Nombre de la receta..."
                  label="Nombre de la receta"
                  value={receta.name}
                  onChange={handleChange}
                  error={submitted && receta.name === ''}
                  helperText={submitted && receta.name === '' ? 'Este campo es requerido' : ''}
                />
                <Typography>
                  <br/>
                  Agregar insumos:
                </Typography>

                {/* <TextField
                  sx={{ m: 1, width: 300 }}
                  name="imgUrl"
                  variant="outlined"
                  placeholder="Imagen de la receta..."
                  label="Imagen de la receta"
                  value={receta.imgUrl}
                  onChange={handleChangeImg}
                  InputLabelProps={{ shrink: true }}
                /> */}

                <FormControl name="nombre" value={state.nombre}>
                  <Select
                    sx={{ m: 1, width: 300, height: 56 }}
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
                    <MenuItem sx={{textAlign:"left"}} disabled value="">
                      <span>Nombre del insumo</span>
                    </MenuItem>
                    {insumosDisponibles?.map((e, i) => (
                      <MenuItem key={i} value={e.id}>
                        {e.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ m: 1, width: 300 }}
                  name="cantidad"
                  type="number"
                  variant="outlined"
                  placeholder="Cantidad..."
                  label="Cantidad..."
                  onChange={handleChange2}
                  value={state.cantidad}
                  inputProps={{ min: 0 }}
                   error={submitted && state.cantidad === ''}
                  helperText={submitted && state.cantidad === '' ? 'Este campo es requerido' : ''}
                  />
              </Box>
            </div>

            <Button
              className={style.boton}
              // disabled={!state.nombre || !state.cantidad ||!receta.name}
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
              Agregar &nbsp;<b>{state.nombre}</b>&nbsp; a la receta
            </Button>

            <div className={style.mainContainer}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Id</TableCell>
                      <TableCell>Nombre </TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insumox?.map((e, i) => (

                      <TableRow key={i} value={e} sx={{ "&:last-child td, &:last-child th": { border: 0 }, }}>
                        <TableCell align="right">{e.id}</TableCell>
                        <TableCell align="left">{e.nombre}</TableCell>
                        <TableCell align="right">{e.cantidad}</TableCell>
                        {/* <TableCell align="right">{e.costoPorBotella}</TableCell> */}
                        {/* <TableCell align="right">{e.costo}</TableCell> */}
                        {/* <TableCell align="right">{e.precio}</TableCell> */}
                      </TableRow>

                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>


            <div className={style.botonContainer}>
              <Button
                disabled={ insumox.length <= 0 || receta.name.length<1 }
                className={style.boton}
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
                Crear nueva receta
              </Button>
            </div>
          </FormControl>
        </form>
      </div>

    </>
  );
};

export default FormReceta;
