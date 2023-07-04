import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { getAllProveedores, getInsumoDetalle, putInsumo } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import style from '../InsumosForm/InsumosForm.module.css';
import { useParams } from 'react-router-dom';

import {
  OutlinedInput,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

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

const FormRecetaInsumoId = (props) => {


//   const theme = useTheme();

  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(getInsumoDetalle(id));
//   }, [dispatch,id]);

//   useEffect(() => {
//     dispatch(getAllProveedores());
//   }, [dispatch]);
  
//   const insumosGlobal = useSelector((state) => state.insumos);
//   const insumoDetalle = useSelector((state)=>state.insumoDetalle)
//   const proveedoresGlobal = useSelector((state) => state.proveedores);
  
//   const categoria = insumosGlobal.map((e) => e.categoria);
//   const categorias = [...new Set(categoria)];
  
//   const unidad = insumosGlobal.map((e) => e.unidad);
//   const unidades = [...new Set(unidad)];
  
//   const proveedores = proveedoresGlobal.map((e) => e.nombre);
//   console.log(proveedores);
  
  const [input, setInput] = useState({
    nombre: '',
    cantidad: '',
  });
  
 
//   useEffect(() => {
//     setLoading(true);
//     if (insumoDetalle ) {
//   setInput({
//     nombre: insumoDetalle?.nombre,
//     precio: insumoDetalle?.precio,
//     stock: insumoDetalle?.stock,
//     stockCritico:insumoDetalle?.stockCritico,
//     categoria: ``,
//     unidad: ``,
//     descripcion: insumoDetalle?.descripcion,
//     proveedor: ``,
//     imagen: insumoDetalle?.imgUrl,
//   })
// } 
// setLoading(false)
// },[insumoDetalle])
    
    const handleChange = (event) => {
      event.preventDefault();
      if (event.target.name === 'cantidad') {
      const number = Number(event.target.value);
      setInput({
        ...input,
        [event.target.name]: number,
      });
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(putReceta(id,input));
  };
  
  return (
    <>
                  <div>
    {loading
    ?(<h1>Cargando</h1>)
                :(
        <div>
          <NavBar />
          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: 'center' }}>
              <div>
                <Typography
                  textAlign="center"
                  sx={{
                    m: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'roboto',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  >
                  Editar el insumo
                </Typography>
              </div>
              <div className={style.selectContainer}>
                <Box>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    
                    name="nombre"
                    variant="outlined"
                    label="nombre..."
                    onChange={handleChange}
                    value={input.nombre}
                    />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="precio"
                    type='number'
                    variant="outlined"
                    label="Precio..."
                    onChange={handleChange}
                    value={input.precio}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="cantidad"
                    type='number'
                    variant="outlined"
                    label="cantidad..."
                    onChange={handleChange}
                    value={input.cantidad}                    
                    />
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
                  className={style.boton}
                  type="submit"
                  sx={{
                    paddingRight: '25px',
                    paddingLeft: '25px',
                    marginBottom: '10px',
                    color: 'white',
                    borderRadius: '6px',
                    background: '#2779ff',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: '#5151519c',
                      transition: '1s',
                    },
                  }}
                  >
                  Actualizar
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
    )}
      </div>
    </>
  );
};

export default FormRecetaInsumoId;

