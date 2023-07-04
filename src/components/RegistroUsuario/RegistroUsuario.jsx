import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import style from '../Usuarios/Usuarios.module.css';
import moment from "moment-timezone"
import { deleteMovimiento, getAllInsumos, getAllMovimientos, postRegistroUsuario, postAllMovimientos, getAllUsuarios } from '../../redux/actions';
import { TextField, OutlinedInput, MenuItem, Box, InputAdornment, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, tableCellClasses, TableRow, Typography, Paper, Button, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavBar from '../NavBar/NavBar';
import NavBarDashboard from '../NavBarDashboard/NavBarDashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import eye from "../../assets/eye.png"

const RegistroUsuario = () => {
  const dispatch = useDispatch();
  const usuarios = useSelector((state) => state.registroUsuario);
  // console.log(usuarios);
  useEffect(() => {
    dispatch(getAllUsuarios());
  }, [dispatch]);

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

  return (
    <>
      <div
        style={{ display: 'flex', alignItems: 'items' }}
        className={style.navBar}
      >
        <NavBar />
        <NavBarDashboard />
      </div>

      <div className={style.mainContainer}>

          <Link to={'/usuarios'} style={{ textDecoration: 'none' }}>
            <Button>
              <ArrowBackIcon /> Atrás 
            </Button>
          </Link> 
          <br/>
          
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Id</StyledTableCell>
                  <StyledTableCell align="center">Tipo de movimiento </StyledTableCell>
                  <StyledTableCell align="center">Motivo</StyledTableCell>
                  <StyledTableCell align="center">Fecha</StyledTableCell>
                  <StyledTableCell align="center">Tipo de operación</StyledTableCell>
                  <StyledTableCell align="center">Ver Movimientos</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {usuarios?.map((e, i) => (
                  <StyledTableRow
                    key={i}
                    value={e}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <StyledTableCell align="center">{e.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {e.tipoDeMovimiento}
                    </StyledTableCell>
                    <StyledTableCell align="center">{e.motivo}</StyledTableCell>
                    <StyledTableCell align="center">
                      {moment
                        .tz(e.createdAt, 'America/Argentina/Buenos_Aires')
                        .format('DD/MM/YYYY')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {e.tipoDeOperacion}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Link to={`/movimientos`}>
                      <IconButton
                      onClick={()=>handlerClickUser(e.id)}
                      >
                        <img
                          src={eye}
                          alt="ver registro"
                          title="ver registro"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </IconButton>
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </>
  );
};

export default RegistroUsuario;
