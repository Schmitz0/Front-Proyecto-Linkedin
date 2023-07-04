import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { postInsumo, getAllInsumos, getAllProveedores } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import style from '../InsumosForm/InsumosForm.module.css';
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, FormControl } from '@mui/material';
import swal from 'sweetalert';
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

const InsumosForm = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getAllProveedores());
  }, [dispatch]);


  const insumosGlobal = useSelector((state) => state.insumos);
  const proveedoresGlobal = useSelector((state) => state.proveedores);

  const categoria = insumosGlobal?.map((e) => e.categoria);
  const categorias = [...new Set(categoria)];

  const unidad = insumosGlobal?.map((e) => e.unidad);
  const unidades = [...new Set(unidad)];

  const proveedores = proveedoresGlobal.map((e) => e.nombre);

const [submitted, setSubmitted] = useState(false);
const [formValid, setFormValid] = useState(false);
  const [input, setInput] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    unidad: '',
    stockCritico: '',
    descripcion: '',
    proveedor: '',
    imagen: '',
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === 'precio' || name === 'stock' || name === 'StockCritico') {
      const number = value;
      setInput((prevInput) => ({
        ...prevInput,
        [name]: number,
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
    if (name === 'nombre' || name === 'stock' || name === 'precio' || name === 'StockCritico') {
      if (value.trim() !== '') {
        setFormValid(true);
      } else {
        setFormValid(false);
      }
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const areAllFieldsComplete = input.nombre.trim() !== '' && input.stock.trim() !== '' && input.precio.trim() !== '' && input.stockCritico.trim() !== '';
  
    if (formValid && areAllFieldsComplete) {
      dispatch(postInsumo(input));
      swal({
        position: 'top-end',
        icon: 'success',
        title: 'Insumo creado correctamente',
        button: true,
      }).then(() => {
        navigate('/insumos');
      });
    } 
  };

  return (
    <>
      <div>
        <div>
          <NavBar />

          <Link to={'/insumos'} style={{ textDecoration: 'none' }}>
            <Button>
              <ArrowBackIcon /> Atrás 
            </Button>
          </Link> 

          <form onSubmit={HandleSubmit}>



            <FormControl sx={{ m: 1.5, alignItems: 'center' }}>
             
              <div className={style.selectContainer}>
                <Box >

                <TextField
                  sx={{ m: 1, width: 300 }}
                  name="nombre"
                  variant="outlined"
                  label="Insumo"
                  onChange={handleChange}
                  value={input.nombre}
                  error={submitted && input.nombre === ''}
                  helperText={submitted && input.nombre === '' ? 'Este campo es requerido' : ''}
                />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    inputProps={{ min: 0 }}
                    name="precio"
                    type='number'
                    variant="outlined"
                    label="Precio"
                    onChange={handleChange}
                    value={input.precio}
                    error={submitted && input.precio === ''}
                  helperText={submitted && input.precio === '' ? 'Este campo es requerido' : ''}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    inputProps={{ min: 0 }}
                    name="stock"
                    type='number'
                    variant="outlined"
                    label="Stock"
                    onChange={handleChange}
                    value={input.stock}
                    error={submitted && input.stock === ''}
                  helperText={submitted && input.stock === '' ? 'Este campo es requerido' : ''} 
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    inputProps={{ min: 0 }}
                    name="stockCritico"
                    type='number'
                    variant="outlined"
                    label="Stock Critico"
                    onChange={handleChange}
                    value={input.stockCritico}
                    error={submitted && input.stockCritico === ''}
                    helperText={submitted && input.stockCritico === '' ? 'Este campo es requerido' : ''}
                  />
                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300 }}
                      displayEmpty
                      name="unidad"
                      label="Unidades de medida"
                      value={input.unidad}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem  disabled value="">
                        <span label="Unidades de medida">Unidades de medida</span>
                      </MenuItem>
                      {unidades?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300 }}
                      displayEmpty
                      name="categoria"
                      value={input.categoria}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        Categorias
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
                      sx={{ m: 1, width: 300 }}
                      displayEmpty
                      name="proveedor"
                      value={input.proveedor}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        Elegir proveedor
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
                    name="descripcion"
                    variant="outlined"
                    placeholder="Descripcion..."
                    label="Descripcion..."
                    multiline
                    onChange={handleChange}
                    value={input.descripcion}
                    rows={1}
                  />


                  {/* <TextField
                    sx={{ m: 1, width: 300 }}
                    name="imagen"
                    variant="outlined"
                    placeholder="Imagen..."
                    multiline
                    onChange={handleChange}
                    value={input.imagen}
                  /> */}
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
                  // disabled={!input.nombre || !input.precio || !input.stock || !input.stockCritico }
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
                  Crear nuevo insumo
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default InsumosForm;
