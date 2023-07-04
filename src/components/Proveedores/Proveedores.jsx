import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import style from '../Proveedores/Proveedores.module.css';
import { deleteProveedor, getAllProveedores } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import { IconButton, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Grid } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Proveedor from '../Proveedor/Proveedor';
import DeleteIcon from "@mui/icons-material/Delete";

const Proveedores = () => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;


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
  const proveedores = useSelector((state) => state.proveedores);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProveedores());
  }, [dispatch]);

  const handlerClickDelete = (e) => {
    swal({
      title: "¿Está seguro?",
      text: `Esta función borrará al proveedor ${e.nombre} en forma permanente`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteProveedor(e.id)).then(() => {
          dispatch(getAllProveedores());
        });
        swal(`El proveedor ${e.nombre} de id ${e.id} ha sido borrado`, {
          icon: "success",
        });
      } else {
        swal(`El proveedor ${e.nombre} de id ${e.id} NO fue borrado`);
      }
    });
  };

  return (
    <>
      <div
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >


        <NavBar />


        <Link to={'/proveedores/form'} style={{ textDecoration: 'none' }}>

          <Button style={{ marginTop: 5, marginBottom: 20 }} variant="contained">
            Crear nuevo proveedor
          </Button>

        </Link>

        <br />

        <div>
          <div
            className={style.navBar}
          >
            <TableContainer
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
              component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Id</StyledTableCell>
                    <StyledTableCell>Nombre Proveedor</StyledTableCell>
                    <StyledTableCell>Nombre Contacto</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Telefono</StyledTableCell>
                    <StyledTableCell>Dirección</StyledTableCell>
                    <StyledTableCell>Código Postal</StyledTableCell>
                    <StyledTableCell>Descripcion</StyledTableCell>
                    <StyledTableCell sx={{maxWidth:"25px"}}>Editar</StyledTableCell>
                    <StyledTableCell >Borrar</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {proveedores?.map((e, i) => (
                    <StyledTableRow
                      key={i}
                      value={e}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <StyledTableCell align="left">{e.id}</StyledTableCell>
                      <StyledTableCell align="left">{e.nombre}</StyledTableCell>
                      <StyledTableCell align="left">
                        {e.nombreContacto}
                      </StyledTableCell>
                      <StyledTableCell align="left">{e.email}</StyledTableCell>
                      <StyledTableCell align="left">{e.telefono}</StyledTableCell>
                      <StyledTableCell align="left">{e.direccion}</StyledTableCell>
                      <StyledTableCell 
                        align="left"
                        sx={{width:"20px"}}
                      >{e.codigoPostal}</StyledTableCell>
                      <StyledTableCell align="left">
                        {e.descripcion}
                      </StyledTableCell>
                      <StyledTableCell 
                      sx={{maxWidth:"25px"}}
                      align="left">
                        <Link to={`/proveedores/form/${e.id}`}>
                          <IconButton key={e.id} sx={{ color: 'blue' }}>
                            <ModeEditIcon />
                          </IconButton>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell 
                      sx={{maxWidth:"25px"}}
                      align="left">
                        <IconButton
                          onClick={() => handlerClickDelete(e, i)}
                          sx={{ color: "blue" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


            <Grid
              container
              justifyContent="center"
              spacing={2}
              display={{ xs: 'flex', md: 'none' }}
            >

              {proveedores?.map((e, i) => {
                return <Grid item key={i} ><Proveedor
                  key={i}
                  id={e.id}
                  nombre={e.nombre}
                  nombreContacto={e.nombreContacto}
                  email={e.email}
                  telefono={e.telefono}
                  direccion={e.direccion}
                  codigoPostal={e.codigoPostal}
                  descripcion={e.descripcion}
                /></Grid>
              })}
            </Grid>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
    </>
  );
};

export default Proveedores;
