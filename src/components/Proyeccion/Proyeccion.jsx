import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRecetas, postProyeccion, getNull } from '../../redux/actions';
import { IconButton, OutlinedInput, Button, TextField, Select, MenuItem, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Accordion, AccordionSummary, AccordionDetails, Typography, tableCellClasses } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { exportToExcel } from '../../helpers/helpers';
import NavBarDashboard from '../NavBarDashboard/NavBarDashboard';
import NavBar from '../NavBar/NavBar'
import excelIcon from "../../assets/excel.png"

const Proyeccion = () => {
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const insumosProyectados1 = useSelector((state) => state.insumosProyectados);
  const recetas = useSelector((state) => state.recetas);

  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false)
  const [input, setInput] = useState({
    proyeccion: [],
  });

  const [receta, setReceta] = useState({
    recetaId: '',
    name: '',
    cantidad: '',
  });

  const [auxInput, setAuxInput] = useState({
    auxProyeccion: [],
  });
  const [selectedRecetaName, setSelectedRecetaName] = useState('');

  useEffect(() => {
    return () => {
      dispatch(getNull());
    };
  }, []);

  useEffect(() => {
    dispatch(getAllRecetas());
  }, [dispatch]);

  const handleChange2 = (event) => {
    event.preventDefault();
    if (event.target.name === 'recetaId' || event.target.name === 'cantidad') {
      const number = event.target.value;
      setReceta({
        ...receta,
        [event.target.name]: number,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(postProyeccion(input));
    setInput({
      proyeccion: [],
    });
    setFlag(true)
  };

  const handlerClick = async (e) => {
    e.preventDefault();

    const nombreReceta = recetas.find((e) => e.id === Number(receta.recetaId));

    const nuevaReceta = {
      ...receta,
      name: nombreReceta,
    };
    setSelectedRecetaName(nombreReceta.name);
    input.proyeccion.push(nuevaReceta);
    auxInput.auxProyeccion.push(nuevaReceta);

    setReceta({
      recetaId: 0,
      cantidad: '',
      name: '',
    });
  };

  const handlerClickRefresh = async (e) => {
    e.preventDefault();
    location.reload();
  };

  const handleExportToExcel = () => {
    const insumosData = insumosProyectados1.map((e) => {
      return {
        idInsumo: e.idInsumo,
        nombreInsumo: e.nombreInsumo,
        costoFinal: e.costoFinal,
        cantidadTotal: e.cantidadTotal,
        stockReal: e.stockReal,
        insumosRestantes: e.insumosRestantes,
      };
    });
    const csvData = [...insumosData];
    exportToExcel(csvData, 'insumos');
  };


  const costoTotal = insumosProyectados1?.reduce((acc, currentValue) => acc + currentValue.costoFinal, 0)

  const valorDelStock = costoTotal?.toLocaleString('en', {
    style: 'currency',
    currency: 'UYU',
  });

  return (
    <>
      <NavBar />
      <NavBarDashboard />
      <form style={{ marginTop: '70px' }} onSubmit={handleSubmit}>
        <FormControl >
          <Select
            disabled={flag}
            sx={{ m: 0.5, width: 300, height: 56 }}
            displayEmpty
            name="recetaId"
            value={receta.recetaId}
            onChange={handleChange2}
            input={<OutlinedInput />}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem disabled value="">
              <span>Nombre de la Receta</span>
            </MenuItem>
            {recetas?.map((e, i) => (
              <MenuItem key={i} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>

        </FormControl>
        <TextField
          disabled={flag}
          sx={{ m: 0.5, width: 300, height:'56' }}
          name="cantidad"
          type="number"
          variant="outlined"
          label="Cantidad a proyectar"
          onChange={handleChange2}
          value={receta.cantidad}
          inputProps={{ min: 0, inputMode: 'numeric' }}
        />


        <div>
          <Button
            disabled={!receta.cantidad || !receta.recetaId}
            onClick={handlerClick}
            sx={{
              width: 300,
              height: 56, 
              paddingRight: '25px',
              paddingLeft: '25px',
              marginBottom: '10px',
              m: 0.5,
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
            Agregar receta
          </Button>

          <Button
            disabled={input.proyeccion.length === 0}
            type="submit"
            sx={{
              width: 300,
              height: 56, 
              paddingRight: '25px',
              paddingLeft: '25px',
              marginBottom: '10px',
              m: 0.5,
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
            Calcular
          </Button>
        </div>

        <Button
          onClick={handlerClickRefresh}
          sx={{
            width: 300,
            height: 56, 
            m: 0.5,
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
          Realizar otro Calculo
        </Button>
        {/* <br></br> */}
        {/* <Button
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

          variant="contained"
          onClick={handleExportToExcel}
        >
          Exportar a Excel
        </Button> */}
        <br></br>
        <br></br>

        <div style={{ fontWeight: 'bold', color: "black" }}>
          Costo Proyeccion: {valorDelStock ? valorDelStock : 'No disponible'}
        </div>
        <br></br>


        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ textAlign: "center" }}>Id Receta </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>Nombre Receta </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>Cantidad </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    <IconButton variant="contained" onClick={handleExportToExcel}>
                      <img src={excelIcon} alt="Exportar a Excel" title="Exportar a Excel" style={{ width: "30px", height: "30px", }} />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auxInput.auxProyeccion?.map((e, i) => (
                  <StyledTableRow
                    key={i}
                    value={e}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <StyledTableCell align="center">{e.recetaId}</StyledTableCell>
                    <StyledTableCell align="center">{e.name.name}</StyledTableCell>
                    <StyledTableCell align="center">{e.cantidad}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <br />

        <div>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>

              <Typography variant="h6">
                Ver insumos Totales
              </Typography>

            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id Insumo</TableCell>
                      <TableCell>Nombre Insumo</TableCell>
                      <TableCell align="right">Costo Final</TableCell>
                      <TableCell align="right">Cantidad Total</TableCell>
                      <TableCell align="right">Stock Real</TableCell>
                      <TableCell align="right">Disponible</TableCell>


                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {insumosProyectados1?.map((e, i) => (
                      <TableRow
                        key={i}
                        value={e}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}

                      >
                        <TableCell align="left">{e.idInsumo}</TableCell>
                        <TableCell align="left">{e.nombreInsumo}</TableCell>
                        <TableCell align="right">{Number(e.costoFinal).toFixed(6)}</TableCell>
                        <TableCell align="right">{Number(e.cantidadTotal).toFixed(6)}</TableCell>
                        <TableCell align="right">{e.stockReal}</TableCell>
                        <TableCell align="right" style={{ color: e.insumosRestantes < 0 ? 'red' : 'green' }}>{Number(e.insumosRestantes).toFixed(2)}</TableCell>


                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </div>
      </form>
    </>
  );
}

export default Proyeccion;
