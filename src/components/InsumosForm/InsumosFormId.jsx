import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { getAllProveedores, getInsumoDetalle, putInsumo } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import style from '../InsumosForm/InsumosForm.module.css';
import { useNavigate, useParams } from 'react-router-dom';

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

const InsumosForm = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getInsumoDetalle(id));
  }, [dispatch,id]);

  useEffect(() => {
    dispatch(getAllProveedores());
  }, [dispatch]);
  
  const insumosGlobal = useSelector((state) => state.insumos);
  const insumoDetalle = useSelector((state)=>state.insumoDetalle)
  const proveedoresGlobal = useSelector((state) => state.proveedores);
  
  const categoria = insumosGlobal.map((e) => e.categoria);
  const categorias = [...new Set(categoria)];
  
  const unidad = insumosGlobal.map((e) => e.unidad);
  const unidades = [...new Set(unidad)];
  
  const proveedores = proveedoresGlobal.map((e) => e.nombre);

  
  const [input, setInput] = useState({
    nombre: '',
    precio: '',
    stock: '',
    stockCritico:'',
    categoria: '',
    unidad: '',
    descripcion: '',
    proveedor: '',
    imagen: '',
  });
  
 
  useEffect(() => {
    setLoading(true);
    if (insumoDetalle ) {
  setInput({
    nombre: insumoDetalle?.nombre,
    precio: insumoDetalle?.precio,
    stock: insumoDetalle?.stock,
    stockCritico:insumoDetalle?.stockCritico,
    categoria: ``,
    unidad: ``,
    descripcion: insumoDetalle?.descripcion,
    proveedor: ``,
    imagen: insumoDetalle?.imgUrl,
  })
} 
setLoading(false)
},[insumoDetalle])
    
    const handleChange = (event) => {
      event.preventDefault();
      if (event.target.name === 'precio' || event.target.name === 'stock') {
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
    dispatch(putInsumo(id,input));
    navigate("/insumos");
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
                  Editar todos los campos
                </Typography>
              </div>
              <div className={style.selectContainer}>
                <Box>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="nombre"
                    variant="outlined"
                    label="nombre..."
                    onChange={handleChange}
                    value={input.nombre}
                    />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="precio"
                    type='number'
                    variant="outlined"
                    label="Precio..."
                    onChange={handleChange}
                    value={input.precio}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="stock"
                    type='number'
                    variant="outlined"
                    label="Stock..."
                    onChange={handleChange}
                    value={input.stock}                    
                    />
                       <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="stockCritico"
                    type='number'
                    variant="outlined"
                    label="Stock Critico..."
                    onChange={handleChange}
                    value={input.stockCritico}                  
                  />

                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: 67 }}
                      displayEmpty
                      name="categoria"
                      label="Categoria"
                      value={input.categoria}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                      >
                      <MenuItem disabled value="">
                        <span>{insumoDetalle?.categoria}</span>
                      </MenuItem>
                      {categorias?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: 67 }}
                      displayEmpty
                      name="unidad"
                      value={input.unidad}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                      >
                      <MenuItem disabled value="">
                        <span>{insumoDetalle?.unidad}</span>
                      </MenuItem>
                      {unidades?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="descripcion"
                    variant="outlined"
                    label="Descripcion..."
                    multiline
                    onChange={handleChange}
                    value={input.descripcion}
                    rows={2}
                    />

			<FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: 67 }}
                      displayEmpty
                      name="proveedor"
                      value={input.proveedor}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                      >
                      <MenuItem  value="">
                        <span>{insumoDetalle?.proveedor}</span>
                      </MenuItem>
                      {proveedores?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="imagen"
                    variant="outlined"
                    label="Imagen..."
                    onChange={handleChange}
                    value={input.imagen}                    
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

export default InsumosForm;

