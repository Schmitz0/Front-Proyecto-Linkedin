import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteMovimiento, getAllInsumos, getAllMovimientos, postAllMovimientos, postStockHistorial, postControlInsumo, getAllUsuarios } from "../../redux/actions";
import { FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, OutlinedInput, MenuItem, Box, InputAdornment, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, tableCellClasses, TableRow, Typography, Paper, Button, Select } from "@mui/material";
import style from "../StockHistorial/StockHistorial.module.css"
import moment from "moment-timezone";
import NavBar from "../../components/NavBar/NavBar";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import moment1 from "moment";
import { makeStyles } from "@mui/styles";
import { exportToExcel } from "../../helpers/helpers";
import styles from "../Movimientos/Movimientos.module.css";
import excelIcon from "../../assets/excel.png";
import check from "../../assets/check.png";

const useStyles = makeStyles((theme) => ({
  datePicker: {
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      filter: "invert(1)",
    },
  },
  checkButton: {
    backgroundColor: '#f2f2f2',
    display: 'flex',
    justifyContent: 'center',
  },
}));

function Row({ row }) {
  const classes = useStyles();
  const usuarios = useSelector((state)=>state.usuarios)
  // console.log(usuarios);
  const insumos = row.Insumos || [];
  // console.log(insumos);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [movimientos, setMovimientos] = React.useState([]);
  const [selectedInsumo, setSelectedInsumo] = React.useState({
    id: null,
    nombre: "",
    stockFinal: "",
  });

  // console.log(selectedInsumo);
  const [isMobile, setIsMobile] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickOpen2 = (insumo, InsumoId) => {
    setSelectedInsumo({ id: InsumoId, nombre: insumo.nombre, stockFinal: "" });
    setOpen2(true);
  };
  const actualizarMovimientos = async () => {
    const response = await dispatch(getAllMovimientos({ estado: false }));
    setMovimientos(response);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleEditarInsumo = () => {
    const insumoCopia = { ...selectedInsumo };
    const id = insumoCopia.id;
    const data = {
      ...row,
      InsumoId: insumoCopia.id,
      stockFinal: insumoCopia.stockFinal,
    };

    dispatch(postControlInsumo(id, data));

    setOpen(false);
    swal({
      icon: "success",
      title: "Editado con éxito",
    }).then(() => {
      window.location.reload();
    });
    setOpen2(false);
  };

  const handleStockFinalChange = (event) => {
    setSelectedInsumo((prevInsumo) => ({
      ...prevInsumo,
      stockFinal: Number(event.target.value),
    }));
  };

  const [controlStock, setControlStock] = React.useState({
    id: row.id,
    tipoDeMovimiento: "Control de stock",
    motivo: row.motivo,
    insumos: [insumos],
    estado: false,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    actualizarMovimientos();
  }, []);

  const handlerClickDelete = (e) => {
    swal({
      title: "Esta seguro?",
      text: "Esta función solo debe utilizarse para borrar movimientos creados erróneamente!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteMovimiento(e)).then(() => {
          dispatch(getAllMovimientos());
        });
        swal(`El insumo de id ${e} fue borrado con éxito`, {
          icon: "success",
        });
      } else {
        swal(`El insumo de id ${e} NO fue borrado`);
      }
    });
  };

  const cleanStockValue = (value) => {
    const cleanValue =
      typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) : 0;

    return isNaN(cleanValue) ? 0 : cleanValue;
  };
  const handleClickSuccess = async (event) => {
    const { id } = row;
    await dispatch(postStockHistorial(id));
    await actualizarMovimientos();
    navigate('/movimientos');
  };

  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          display: { xs: "none", md: "contents" },
        }}
      >         
        <TableCell  sx={{ backgroundColor: "#f2f2f2" }} >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell
          align="center"
          sx={{ backgroundColor: "#f2f2f2" }}
          scope="row"
        >
          {row.id}
        </TableCell>

        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
          {row.tipoDeMovimiento}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
          {Number(row.cantidadProducida)}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
          {row.motivo}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
          {moment
            .tz(row.createdAt, "America/Argentina/Buenos_Aires")
            .format("DD/MM/YYYY")}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
        {usuarios.filter((usuario) => usuario.id === row.usuario)[0]?.name || ""}
        </TableCell>
        <TableCell  className={classes.checkButton}
          style={{
            display: "flex",
            justifyContent: "center",         
            
          }}
        >
          <IconButton
            variant="contained"
            onClick={() => handleClickSuccess(row.id)}
          >
            <img
              src={check}
              alt="Confirmar control"
              title="Confirmar control"
              style={{ width: "20px", height: "20px" }}
            />
          </IconButton>
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f2f2f2" }} align="center">
          <IconButton onClick={() => handlerClickDelete(row.id)}>
            <DeleteIcon sx={{ color: "blue" }} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* TABLA RESUMIDA */}

      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          display: { xs: "contents", md: "none" },
        }}
      >
        <TableCell>
          <IconButton
            sx={{ width: "5px" }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="right" scope="row">
          {row.id}
        </TableCell>

        <TableCell align="center">{row.tipoDeMovimiento}</TableCell>
        <TableCell align="center">{Number(row.cantidadProducida)}</TableCell>
        <TableCell align="center">
          {moment
            .tz(row.createdAt, "America/Argentina/Buenos_Aires")
            .format("DD/MM/YYYY")}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                marginLeft: "15px",
                padding: 1,
                border: "1px solid lightgrey",
                borderRadius: "4px",
              }}
            >
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "steelblue",
                        fontWeight: "bold",
                      }}
                      align="center"
                    >
                      Id
                    </TableCell>
                    <TableCell sx={{ color: "steelblue", fontWeight: "bold" }} align="center">
                      Nombre del insumo
                    </TableCell>
                    <TableCell
                      sx={{ color: "steelblue", fontWeight: "bold" }}
                      align="center"
                    >
                      Precio
                    </TableCell>
                    <TableCell
                      sx={{ color: "steelblue", fontWeight: "bold" }}
                      align="center"
                    >
                      Stock Previo
                    </TableCell>
                    <TableCell
                      sx={{ color: "steelblue", fontWeight: "bold" }}
                      align="center"
                    >
                      Diferencia
                    </TableCell>
                    <TableCell
                      sx={{ color: "steelblue", fontWeight: "bold" }}
                      align="center"
                    >
                      Stock Final
                    </TableCell>
                    <TableCell
                      sx={{ color: "steelblue", fontWeight: "bold" }}
                      align="center"
                    >
                      Editar
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {insumos?.map((insumo, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {insumo.id}
                      </TableCell>
                      <TableCell align="center">{insumo.nombre}</TableCell>
                      <TableCell align="center">
                        {Number(insumo?.precio.toFixed(2))}
                      </TableCell>
                      <TableCell align="center">
                        {Number(
                          parseFloat(
                            insumo?.MovimientoInsumo?.stockPrevio
                          ).toFixed(2)
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color:
                            insumo?.MovimientoInsumo?.diferencia < 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {Number(
                          parseFloat(
                            insumo?.MovimientoInsumo?.diferencia
                          ).toFixed(2)
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {Number(
                          parseFloat(
                            insumo?.MovimientoInsumo?.stockFinal
                          ).toFixed(2)
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          sx={{ color: "black" }}
                          onClick={() => handleClickOpen2(insumo, insumo.id)}
                        >
                          <ModeEditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog open={open2} onClose={handleClose2}>
        <FormControl>
          <DialogTitle>EDITAR STOCK</DialogTitle>
          <DialogContent>
            <TextField value={selectedInsumo?.nombre} fullWidth />
            <TextField
              margin="dense"
              type="number"
              label="Editar cantidad stock"
              fullWidth
              variant="standard"
              name="cantidad"
              value={selectedInsumo?.stockFinal}
              onChange={handleStockFinalChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2}>Cancelar</Button>
            <Button onClick={handleEditarInsumo}>Editar stock</Button>
          </DialogActions>
        </FormControl>
      </Dialog>
    </>
  );
}

export default function CollapsibleTable() {
  const classes = useStyles();
  const insumosGlobal = useSelector((state) => state.insumos);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 12,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const rows = useSelector((state) => state.movimientos);
  // console.log(rows);
  const movis = ["Control de stock", "Movimiento de insumo", "Receta"];
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

  const dispatch = useDispatch();

  const [isFiltered, setIsFiltered] = React.useState(true);
  const [filteredRows1, setFilteredRows1] = React.useState(rows);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchId, setSearchId] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);
  const [isButtonClicked, setButtonClicked] = React.useState(false);
  const [filter, setFilter] = React.useState({
    filters: {
      fechaMin: "",
      fechaMax: "",
      insumo: "",
    },
  });

  const [pageLoaded, setPageLoaded] = React.useState(false);

  useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getAllUsuarios());
    if (!pageLoaded) {
      dispatch(getAllMovimientos({ estado: false }));
      setPageLoaded(true);
    }
  }, [dispatch, pageLoaded]);

  const convertirPrecioANumero = (insumos) => {
    return insumos.map((insumo) => {
      return {
        ...insumo,
        precio: Number(insumo.precio),
      };
    });
  };

  const filtro1 =
    searchValue.length === 0
      ? rows
      : rows.filter((row) =>
          row.tipoDeMovimiento.toLowerCase().includes(searchValue.toLowerCase())
        );
  const filtro2 =
    searchId.length !== 0
      ? rows.filter((row) => Number(row.id) === Number(searchId))
      : rows;
  let filteredRows = filtro2 !== "" ? filtro2 : rows;
  filteredRows =
    filtro1 !== ""
      ? filteredRows?.filter((row) =>
          row.tipoDeMovimiento.toLowerCase().includes(searchValue.toLowerCase())
        )
      : filteredRows;

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedFilteredRows = rows;

    if (searchValue !== "") {
      updatedFilteredRows = updatedFilteredRows.filter((row) =>
        row.tipoDeMovimiento.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (searchId !== "") {
      updatedFilteredRows = updatedFilteredRows.filter(
        (row) => Number(row.id) === Number(searchId)
      );
    }

    if (filter.filters.fechaMin !== "" && filter.filters.fechaMax !== "") {
      const fechaMin = moment(filter.filters.fechaMin, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
      const fechaMax = moment(filter.filters.fechaMax, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );

      updatedFilteredRows = updatedFilteredRows.filter((row) => {
        const fechaRemito = moment(row.createdAt, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );
        return fechaRemito >= fechaMin && fechaRemito <= fechaMax;
      });
    }

    setFilteredRows1(updatedFilteredRows);
    dispatch(postAllMovimientos(filter));
  };

  const handleExportToExcel = () => {
    const flattenedData = rows.reduce((acc, row) => {
      row.Insumos.forEach((insumo) => {
        const flattenedRow = {
          id: row.id,
          tipoDeMovimiento: row.tipoDeMovimiento,
          createAt: moment(row.createAt).format("DD/MM/YYYY"),
          cantidadProducida: Number(row.cantidadProducida),
          motivo: row.motivo,
          insumo_id: insumo.id,
          insumo_nombre: insumo.nombre,
          insumo_precio: insumo.precio,
          insumo_cantidad: insumo.MovimientoInsumo.cantidad,
        };
        acc.push(flattenedRow);
      });
      return acc;
    }, []);
    exportToExcel(flattenedData, "movimiento");
  };

  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <div
          style={{ gap: 4 }}
          // className={styles.filtrosFechasContainer}
        >
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ width: 330, margin: "5px" }}
            id="search"
            label="Buscar por ID de movimiento"
            variant="outlined"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>

        <div className={styles.filtrosFechasContainer}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TextField
              // className={classes.datePicker}
              style={{
                margin: "5px",
                width: "160px",
                backgroundColor: "white",
              }}
              label="Fecha Minima"
              type="date"
              InputLabelProps={{ shrink: true }}
              className={style.customTextfield}
              variant="outlined"
              value={
                filter.filters.fechaMin
                  ? moment1(filter.filters.fechaMin, "DD-MM-YYYY").format(
                      "YYYY-MM-DD"
                    )
                  : ""
              }
              onChange={(e) =>
                setFilter({
                  ...filter,
                  filters: {
                    ...filter.filters,
                    fechaMin: moment1(e.target.value).format("DD-MM-YYYY"),
                  },
                })
              }
              inputProps={{
                min: "yyyy-MM-dd",
                max: filter.filters.fechaMax || "yyyy-MM-dd",
              }}
            />

            <TextField
              // className={classes.datePicker}
              style={{
                margin: "5px",
                width: "160px",
                backgroundColor: "white",
              }}
              label="Fecha Maxima"
              type="date"
              InputLabelProps={{ shrink: true }}
              className={style.customTextfield}
              variant="outlined"
              value={
                filter.filters.fechaMax
                  ? moment1(filter.filters.fechaMax, "DD-MM-YYYY").format(
                      "YYYY-MM-DD"
                    )
                  : ""
              }
              onChange={(e) =>
                setFilter({
                  ...filter,
                  filters: {
                    ...filter.filters,
                    fechaMax: moment1(e.target.value).format("DD-MM-YYYY"),
                  },
                })
              }
              inputProps={{
                min: filter.filters.fechaMin || "yyyy-MM-dd",
                max: "yyyy-MM-dd",
              }}
            />
          </div>

          <div>
            <Select
              sx={{ m: 1, width: "330px", backgroundColor: "white" }}
              displayEmpty
              name="nombre"
              value={filter.filters.insumo ? filter.filters.insumo : ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  filters: {
                    ...filter.filters,
                    insumo: e.target.value,
                  },
                })
              }
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                <span>Filtrar por insumos entre fechas</span>
              </MenuItem>
              {insumosGlobal?.map((e, i) => (
                <MenuItem key={i} value={e.nombre}>
                  {e.nombre}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <Link style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  width: "257px",
                  padding: "4px",
                  margin: "4px",
                  color: "white",
                }}
                variant="contained"
                onClick={handleSubmit}
              >
                Filtrar por fecha
              </Button>
            </Link>

            <Button
              sx={{
                margin: "4px",
                border: "solid",
                borderRadius: "5px",
                borderWidth: "1px",
                height: "33px",
              }}
              onClick={() => {
                setFilter({
                  filters: {
                    fechaMin: "",
                    fechaMax: "",
                  },
                });
                setIsFiltered(false);
                dispatch(getAllMovimientos({estado:false}));
                setIsFiltered(true);
              }}
            >
              <RefreshIcon />
            </Button>
          </div>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <StyledTableRow sx={{ display: { md: "contents", xs: "none" } }}>
              <StyledTableCell>
                <IconButton variant="contained" onClick={handleExportToExcel}>
                  <img
                    src={excelIcon}
                    alt="Exportar a Excel"
                    title="Exportar a Excel"
                    style={{ width: "30px", height: "30px" }}
                  />
                </IconButton>
              </StyledTableCell>
              <StyledTableCell>Id movimiento</StyledTableCell>
              <StyledTableCell align="center">
                Tipo de Movimiento
              </StyledTableCell>
              <StyledTableCell align="center">
                Cantidad Producida
              </StyledTableCell>
              <StyledTableCell align="center">Motivo</StyledTableCell>
              <StyledTableCell align="center">Fecha Movimiento</StyledTableCell>
              <StyledTableCell align="center">Usuario</StyledTableCell>
              <StyledTableCell align="center">
                Confirmar Control
              </StyledTableCell>
              <StyledTableCell align="center">Borrar</StyledTableCell>
            </StyledTableRow>

            <StyledTableRow sx={{ display: { xs: "contents", md: "none" } }}>
              <StyledTableCell />
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="center">Tipo de Mov</StyledTableCell>
              <StyledTableCell align="center">
                Cantidad Producida
              </StyledTableCell>
              {/* <StyledTableCell align="center">Motivo</StyledTableCell> */}
              <StyledTableCell align="center">Fecha Movimiento</StyledTableCell>
              {/* <StyledTableCell align="center">Usuario</StyledTableCell>
              <StyledTableCell align="center">Borrar</StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!isFiltered &&
              rows?.map((row, i) => (
                <React.Fragment key={i}>
                  <Row
                    row={{
                      ...row,
                      Insumos: convertirPrecioANumero(row.Insumos),
                    }}
                  />
                </React.Fragment>
              ))}
            {isFiltered &&
              filteredRows?.map((row, i) => (
                <React.Fragment key={i}>
                  <Row
                    row={{
                      ...row,
                      Insumos: convertirPrecioANumero(row.Insumos),
                    }}
                  />
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      <br />
      <br />
    </>
  );
}
