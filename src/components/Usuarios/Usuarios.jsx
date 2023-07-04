import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUsuario, getAllUsuarios } from "../../redux/actions";
import { Link } from "react-router-dom";
import style from "../Usuarios/Usuarios.module.css"
import NavBarDashboard from "../NavBarDashboard/NavBarDashboard"
import NavBar from "../NavBar/NavBar"
import { Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, tableCellClasses, Box } from '@mui/material';
import swal from 'sweetalert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Usuario from "../Usuario/Usuario";

const Usuarios = () => {

  const dispatch = useDispatch()
  const usuarios = useSelector((state) => state.usuarios)

  useEffect(() => { dispatch(getAllUsuarios()) }, [dispatch])

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

  const handlerClickDelete = (event, id, name) => {
    event.preventDefault();
    swal({
      title: `Esta seguro de borrar al usuario "${name}"?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          dispatch(deleteUsuario(id)).then(() => { (dispatch(getAllUsuarios())) })
          swal("El usuario fue borrado con éxito!", {
            icon: "success",
          });
        } else {
          swal(`El usuario ${name} NO fue borrado`);
        }
      });
  }

  return (
    <>
      <div
        style={{ display: 'flex', alignItems: "items" }}
        className={style.navBar}>
        <NavBar />
        <NavBarDashboard />

      </div>

      <div

        className={style.mainContainer}>

        <Link to={"/usuarios/form"} style={{ textDecoration: 'none' }}>
          <div className={style.boton}>
            <Button style={{ right: 10 }} variant="contained">Crear nuevo usuario</Button>
          </div>
        </Link>

        <br />

        <Box
          sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
        >

          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="right">Id</StyledTableCell>
                  <StyledTableCell >Nombre </StyledTableCell>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Rol</StyledTableCell>
                  <StyledTableCell align="left">Foto</StyledTableCell>
                  <StyledTableCell align="left">Editar</StyledTableCell>
                  <StyledTableCell align="left">Borrar</StyledTableCell>
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
                    <StyledTableCell align="right">{e.id}</StyledTableCell>
                    <StyledTableCell align="left">{e.name}</StyledTableCell>
                    <StyledTableCell align="left">{e.email}</StyledTableCell>
                    <StyledTableCell align="left">{e.role}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Box
                        component="img"
                        sx={{
                          height: 70,
                          width: 70,
                          maxHeight: { xs: 67, md: 67 },
                          maxWidth: { xs: 67, md: 67 },
                        }}
                        alt="No hay foto"
                        src={e.imgUrl}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Link to={`/usuarios/form/${e.id}`}>
                        <IconButton key={e.id} sx={{ color: 'blue' }}>
                          <ModeEditIcon />
                        </IconButton>
                      </Link>
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <IconButton
                        value={e.id}
                        onClick={() => handlerClickDelete(event, e.id, e.name)}
                        sx={{
                          color: 'blue',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Grid
          container
          justifyContent="center"
          spacing={8}
          display={{ xs: 'flex', md: 'none' }}
        >

          {usuarios?.map((e, i) => {
            return <Grid item key={i} ><Usuario
              key={i}
              id={e.id}
              name={e.name}
              email={e.email}
              role={e.role}
              imgUrl={e.imgUrl}
            /></Grid>
          })}
        </Grid>

      </div>
    </>
  )
}

export default Usuarios;