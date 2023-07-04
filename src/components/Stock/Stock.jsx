import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { styled } from "@mui/material/styles";
import { tableCellClasses, TextField, Box, Select, OutlinedInput, MenuItem, Button, TableCell, TableRow, TableHead, Table, Paper, TableContainer, TableBody, IconButton, Typography, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getAllInsumos, postMovimientoInsumo } from "../../redux/actions";

const Stock = () => {
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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const insumosGlobal = useSelector((state) => state.insumos);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllInsumos());
  }, [dispatch]);

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

  const [controlStock, setControlStock] = useState({
    tipoDeMovimiento: "Control de stock",
    motivo: "",
    insumos: [],
  });

  const [insumo, setInsumo] = useState({
    id: "",
    nombre: "",
    cantidad: "",
  });

  const [stockAux, setStockAux] = useState([]);

  const insumosDisponibles = insumosGlobal.filter(
    (ig) => !stockAux.map((i) => i.nombre).includes(ig.nombre)
  );

  const handleChange = (event) => {
    event.preventDefault();
    setControlStock({
      ...controlStock,
      [event.target.name]: event.target.value,
    });
  };

  const handleChange2 = (event) => {
    event.preventDefault();
    if (event.target.name === "id") {
      const number = Number(event.target.value);
      const nombreFinal = insumosGlobal?.filter(
        (e) => e.id === event.target.value
      );

      setInsumo({
        ...insumo,
        [event.target.name]: number,
        nombre: nombreFinal[0].nombre,
      });
    } else if (event.target.name === "cantidad") {
      const number = event.target.value;
      setInsumo({
        ...insumo,
        [event.target.name]: number,
      });
    }
  };

  const handlerClick = (e) => {
    e.preventDefault();
    const nuevoControlInsumo = {
      id: insumo.id,
      nombre: insumo.nombre,
      cantidad: insumo.cantidad,
    };
    setStockAux((prevStockAux) => [...prevStockAux, nuevoControlInsumo]);
    setInsumo({
      id: "",
      nombre: "",
      cantidad: "",
    });
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    controlStock.insumos = stockAux;
    swal({
      title: "Esta seguro de crear este control de stock?",
      text: "Revise haber ingresado todos los insumos correspondientes.",
      icon: "warning",
      buttons: true,
    }).then((create) => {
      if (create) {
        dispatch(postMovimientoInsumo(controlStock));
        swal(`El control de stock fue creado con éxito`, {
          icon: "success",
        }).then(() => {
          navigate(`/stock/historial`);
        });
      } else {
        swal("Puede seguir agregando insumos al control de stock");
      }
    });
  };

  const handlerClickDelete = (index) => {
    const newStockAux = [...stockAux];
    newStockAux.splice(index, 1);
    setStockAux(newStockAux);
  };

  return (
    <>
      <NavBar />
      <Link to={"/stock/historial"} style={{ textDecoration: "none" }}>
        <Button
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
          Ver Historial
        </Button>
      </Link>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <form onSubmit={HandleSubmit}>
          <FormControl sx={{ m: 1.5, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                sx={{ m: 1, width: 350 }}
                name="motivo"
                variant="outlined"
                label="Motivo del control de stock..."
                onChange={handleChange}
                value={controlStock.motivo}
              />
              <Select
                sx={{ m: 1, width: 350 }}
                displayEmpty
                name="id"
                value={insumo.id}
                onChange={handleChange2}
                input={<OutlinedInput />}
                MenuProps={MenuProps}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <span>Nombre Insumo</span>
                </MenuItem>
                {insumosDisponibles?.map((e, i) => (
                  <MenuItem key={i} value={e.id}>
                    {e.nombre}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                sx={{ m: 1, width: 350 }}
                type="number"
                name="cantidad"
                variant="outlined"
                placeholder="Cantidad..."
                label="Cantidad..."
                onChange={handleChange2}
                value={insumo.cantidad}
                inputProps={{ min: 0 }}
              />
            </div>

            <br />

            <Button
              disabled={!insumo.nombre || !insumo.cantidad}
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
              agregar insumo a control de stock
            </Button>
          </FormControl>
          <br />
          <br />
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Nombre </StyledTableCell>
                    <StyledTableCell align="right">Id</StyledTableCell>
                    <StyledTableCell align="right">Cantidad</StyledTableCell>
                    <StyledTableCell align="right">Borrar</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {stockAux?.map((e, i) => (
                    <TableRow
                      key={i}
                      value={e}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{e.nombre}</TableCell>
                      <TableCell align="right">{e.id}</TableCell>
                      <TableCell align="right">{e.cantidad}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handlerClickDelete(i)}
                          sx={{ color: "blue" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div>
            <br></br>
            <Button
              disabled={!controlStock.motivo || stockAux.length <= 0}
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
              Publicar control de stock
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default Stock;
