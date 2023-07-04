import * as React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAllRemitos, postAllRemitos, deleteRemito, getAllUsuarios } from "../../redux/actions";
import PropTypes from "prop-types";
import { Box, Button, TextField, InputAdornment, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, tableCellClasses } from "@mui/material";
import { makeStyles } from "@mui/styles";
import NavBar from "../NavBar/NavBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from '@mui/icons-material/Refresh';
import style from "../Remitos/Remitos.module.css";
import moment from "moment-timezone";
import { styled } from "@mui/material/styles";
import moment1 from "moment";
import { exportToExcel } from "../../helpers/helpers";
import excelIcon from "../../assets/excel.png"


function Row({ row }) {
  const insumos = row.Insumos || [];
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const usuarios = useSelector((state)=>state.usuarios);
  const dispatch = useDispatch();


  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlerClickDelete = (e) => {
    swal({
      title: "Esta seguro?",
      text: "Esta función solo debe utilizarse para borrar Remitos creados erróneamente!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteRemito(e)).then(() => {
          dispatch(getAllRemitos());
        });
        swal(`Poof! El remito de id ${e} fue borrado!`, {
          icon: "success",
        });
      } else {
        swal(`El remito de id ${e} NO fue borrado!`);
      }
    });
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            sx={!isMobile ?
              { width: '10px' } :
              { width: '5px', height: '4px' }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="right" scope="row">{row.numeroRemito}</TableCell>

        <TableCell align="center">{row.Proveedor.nombre}</TableCell>
        {!isMobile && <TableCell align="center">{new Date(row.createdAt).toLocaleDateString("es-AR")}</TableCell>}

        <TableCell align="center">
          {moment
            .tz(row.fecha, "America/Argentina/Buenos_Aires")
            .format("DD/MM/YYYY")}
        </TableCell>

        {!isMobile && (
          <TableCell align="center">
            {usuarios.filter((usuario) => usuario.id === Number(row.usuario))[0]?.name || ""}
            </TableCell>
        )}

        {!isMobile && (
          <TableCell align="center">
            <IconButton onClick={() => handlerClickDelete(row.id)}>
              <DeleteIcon sx={{ color: "blue" }} />
            </IconButton>
          </TableCell>
        )}

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Insumos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: "steelblue", fontWeight: "bold" }}>Id</TableCell>
                    <TableCell align="center" sx={{ color: "steelblue", fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell align="center" sx={{ color: "steelblue", fontWeight: "bold" }}>Precio</TableCell>
                    <TableCell align="center" sx={{ color: "steelblue", fontWeight: "bold" }}>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insumos.map((insumo, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" component="th" scope="row">{insumo.id}</TableCell>
                      <TableCell align="center">{insumo.nombre}</TableCell>
                      <TableCell align="center">{parseFloat(insumo.precio)}</TableCell>
                      <TableCell align="center">{parseFloat(insumo.RemitoInsumo.cantidad)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    createAt: PropTypes.number,
    fecha: PropTypes.string,
    Insumos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string,
        precio: PropTypes.number,
      })
    ),
    Proveedores: PropTypes.arrayOf(
      PropTypes.shape({
        nombre: PropTypes.string,
      })
    ),
  }),
};

const useStyles = makeStyles((theme) => ({
  datePicker: {
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      filter: "invert(1)",
    },
  },
}));

export default function CollapsibleTable() {
  const classes = useStyles();
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

  const rows = useSelector((state) => state.remitos);

  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = React.useState("");
  const [searchId, setSearchId] = React.useState("");
  const [isFiltered, setIsFiltered] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false);
  const [isButtonClicked, setButtonClicked] = React.useState(false);
  const [filter, setFilter] = React.useState({
    filters: {
      fechaMin: "",
      fechaMax: "",
    },
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    dispatch(getAllUsuarios());
    dispatch(getAllRemitos());
  }, [dispatch]);

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
      : rows?.filter((row) =>
        row.Proveedor.nombre.toLowerCase().includes(searchValue.toLowerCase())
      );
  const filtro2 =
    searchId.length !== 0
      ? rows?.filter((row) => row.numeroRemito.includes(searchId))
      : rows;
  let filteredRows = filtro2 !== "" ? filtro2 : rows;
  filteredRows =
    filtro1 !== ""
      ? filteredRows?.filter((row) =>
        row.Proveedor.nombre.toLowerCase().includes(searchValue.toLowerCase())
      )
      : filteredRows;

  const handleSubmit = (e) => {
    e.preventDefault();

    let filteredRows = rows;

    if (filter?.filters.fechaMin !== "" && filter?.filters.fechaMax !== "") {
      const fechaMinValue = moment1(filter?.filters.fechaMin, "DD/MM/YYYY")
        .toDate()
        .getTime();
      const fechaMaxValue = moment1(filter?.filters.fechaMax, "DD/MM/YYYY")
        .toDate()
        .getTime();

      filteredRows = filteredRows?.filter((row) => {
        const fechaRemito = moment1(row.fechaRemito, "DD/MM/YYYY").toDate().getTime();
        return fechaRemito >= fechaMinValue && fechaRemito <= fechaMaxValue;
      });
    }
    dispatch(postAllRemitos(filter));
    setIsFiltered(true)
  };

  const handleExportToExcel = () => {
    const flattenedData = rows.reduce((acc, row) => {
      row.Insumos.forEach((insumo) => {
        const flattenedRow = {
          id: row.id,
          numeroRemito: row.numeroRemito,
          fecha: moment(row.fecha).format("DD/MM/YYYY"),
          proveedor: row.Proveedor.nombre,
          insumo_id: insumo.id,
          insumo_nombre: insumo.nombre,
          insumo_precio: insumo.precio,
          insumo_cantidad: insumo.RemitoInsumo.cantidad,
        };
        acc.push(flattenedRow);
      });
      return acc;
    }, []);
    exportToExcel(flattenedData, "remito");
  };


  return (
    <>
      <NavBar />

      <div
        style={{ display: "flex", justifyContent: "center", columnGap: "20px" }}
      >
        <Link to={"/remito/form"} style={{ textDecoration: "none" }}>
          <Button
            className={style.boton}
            variant="contained">
            Ingresar Remito
          </Button>
        </Link>
      </div>

      <br />
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <div>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ margin: '8px', width: '160px' }}
            // id="search"
            label="Nro. de remito"
            variant="outlined"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ margin: '8px', width: !isMobile ? '260px' : '160px' }}
            label="Proveedor..."
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>


        <div
          style={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            label="Fecha Minima"
            type="date"
            InputLabelProps={{ shrink: true }}
            className={style.customTextfield}
            variant="outlined"
            style={{ margin: '8px', width: '160px' }}
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
            label="Fecha Maxima"
            type="date"
            style={{ margin: '8px', width: '160px' }}
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
          <Link style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Filtrar entre fechas
            </Button>
          </Link>

          <Button
            sx={{
              margin: "4px",
              border: "solid",
              borderRadius: "5px",
              borderWidth: "1px",
              height: "37px",
            }}
            onClick={() => {
              setFilter({
                filters: {
                  fechaMin: "",
                  fechaMax: ""
                },
              });
              setIsFiltered(false);
              dispatch(getAllRemitos())
              setIsFiltered(true);
            }}
          >
            <RefreshIcon />
          </Button>
        </div>

        <br />

        <div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>
                    <IconButton variant="contained" onClick={handleExportToExcel}>
                      <img src={excelIcon} alt="Exportar a Excel" title="Exportar a Excel" style={{ width: "30px", height: "30px", }} />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="right">Remito nº</StyledTableCell>
                  <StyledTableCell align="center">Nombre proveedor</StyledTableCell>
                  {!isMobile && (<StyledTableCell align="center">Creado el</StyledTableCell>)}
                  <StyledTableCell align="center">Fecha remito</StyledTableCell>
                  {!isMobile && (<StyledTableCell align="center">Usuario</StyledTableCell>)}
                  {!isMobile && (<StyledTableCell align="center">Borrar</StyledTableCell>)}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {!isFiltered &&
                  rows?.map((row, i) => (
                    <React.Fragment key={i}>
                      <Row
                        row={{ ...row, Insumos: convertirPrecioANumero(row.Insumos) }}
                      />
                    </React.Fragment>
                  ))}
                {isFiltered &&
                  filteredRows?.map((row, i) => (
                    <React.Fragment key={i}>
                      <Row
                        row={{ ...row, Insumos: convertirPrecioANumero(row.Insumos) }}
                      />
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
