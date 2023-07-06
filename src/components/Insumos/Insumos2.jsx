import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import style from '../Insumos/Insumos.module.css';
import SumarStock from './SumarStock';
import RestarStock from './RestarStock';
import { deleteInsumo, getAllInsumos, getInsumoBajoStock } from '../../redux/actions';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Grid, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { exportToExcel } from '../../helpers/helpers';
import excelIcon from "../../assets/excel.png"
import { Buffer } from 'buffer';


export default function DataTable(props) {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.insumos);
  const [refreshTable, setRefreshTable] = React.useState(false);
  const [insumosBajoStock, setInsumosBajoStock] = React.useState([]);
  const bajoStock = useSelector((state) => state.bajoStock);
  const [toggle, setToggle] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isButtonClicked, setButtonClicked] = React.useState(false);


  const token = localStorage.getItem('token')

  const ses = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());

  const changeToggle = () => {
    setToggle(!toggle);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [isContentLoaded, setIsContentLoaded] = React.useState(false);

  React.useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getInsumoBajoStock());
    setIsContentLoaded(true);
  }, [refreshTable, dispatch]);

  const handleStockChange = () => {
    setRefreshTable((prev) => !prev);
  };

  const filterByBajoStock = (insumos) => {
    return insumos?.filter((insumo) => insumo.stock < bajoStock);
  };

  const handleFiltrarBajoStock = () => {
    const insumos = filterByBajoStock(bajoStock);
    setInsumosBajoStock(insumos);
    changeToggle();
  };

  const handlerClickDelete = (e, rowId) => {
    swal({
      title: "¿Está seguro?",
      text: "¡Esta función solo debe utilizarse para borrar Insumos recién creados erróneamente!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteInsumo(rowId)).then(() => {
          dispatch(getAllInsumos());
        });
        swal(`El insumo de id ${rowId} ha sido borrado`, {
          icon: "success",
        });
      } else {
        swal(`El insumo de id ${rowId} no fue borrado`);
      }
    });
  };

  const handleExportToExcel = () => {
    const csvData = rows.map((insumo) => {
      return {
        id: insumo.id,
        nombre: insumo.nombre,
        precio: insumo.precio,
        cantidad: insumo.stock,
        proveedor: insumo.proveedor,
      };
    });
    exportToExcel(csvData, "insumos");
  };

  const columns3 = [
    {
      field: "exportar",
      headerName: "Exportar",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 60,
      headerClassName: style.exportar,
      renderHeader: () => (
        <IconButton
          variant="contained"
          onClick={handleExportToExcel}
          style={{ marginRight: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={excelIcon}
            alt="Exportar a Excel"
            title="Exportar a Excel"
            style={{ width: "30px", height: "30px" }}
          />
        </IconButton>
      ),
      renderCell: (params) => (<div className={style.ids}>{params.row.id}</div>),
    },

    { field: "nombre", headerName: "Nombre", width: 220 },
    { field: "categoria", headerName: "Categoria", width: 90 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <p style={{ color: Number(params?.row?.stock) <= Number(params?.row?.stockCritico) ? 'red' : 'green' }}>
          {Number(params.row.stock).toFixed(2)} {params.row.unidad}
        </p>
      ),
    },
    {
      field: "stockCritico",
      headerName: "Stock crítico",
      width: 90,
      type: "number",
    },
    {
      field: "precio",
      headerName: "Precio",
      type: "number",
      width: 70,
      renderCell: (params) => {
        const precio = Number(params.row.precio).toFixed(2);
        const precioConSimbolo = `$ ${precio}`;
        return <p>{precioConSimbolo}</p>;
      },
    },
    {
      field: "editar",
      headerName: "Editar",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 70,
      renderCell: (params) => (
        <Link to={`/insumos/form/${params.row.id}`}>
          <IconButton key={params.row.id} sx={{ color: "blue" }}>
            <ModeEditIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: "borrar",
      headerName: "Borrar",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 70,
      renderCell: (params) => {
        if (ses.role !== "Admin") return null;

        return (
          <IconButton
            key={params.row.id}
            onClick={() => handlerClickDelete(params.row.e, params.row.id)}
          >
            <DeleteIcon sx={{ color: "blue" }} />
          </IconButton>
        );
      },
    },
    {
      field: "agregar",
      headerName: "Agregar",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 75,
      renderCell: (params) => (
        <SumarStock id={params.row.id} onStockChange={handleStockChange} />
      ),
    },
    {
      field: "restar",
      headerName: "Restar",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 70,
      renderCell: (params) => (
        <RestarStock id={params.row.id} onStockChange={handleStockChange} />
      ),
    },
  ];

  let columns1 = columns3;
  if (ses.role !== "Admin") {
    columns1 = columns3.filter(
      (e) => e.field !== "borrar" && e.field !== "editar"
    );
  }
  const columns2 = [
    { field: "nombre", headerName: "Nombre", width: 140 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      width: 80,
      renderCell: (params) => (
        <p>
          {params.row.stock} {params.row.unidad}
        </p>
      ),
    },
    {
      field: "agregar",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 40,
      renderCell: (params) => (
        <SumarStock id={params.row.id} onStockChange={handleStockChange} />
      ),
    },
    {
      field: "restar",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 40,
      renderCell: (params) => (
        <RestarStock id={params.row.id} onStockChange={handleStockChange} />
      ),
    },
  ];

  React.useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getInsumoBajoStock());
  }, [refreshTable, dispatch]);

  return (
    <>
      <div className={style.pageContainer}>
        <NavBar />
        <div className={style.buttons}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <Button
                style={
                  toggle
                    ? { lineHeight: "1.2", backgroundColor: "green" }
                    : { lineHeight: "1.8", backgroundColor: "red" }
                }
                sx={
                  !isMobile
                    ? { width: "180px", height: "54px", marginX: "16px" }
                    : { width: "100px", height: "60px", marginX: "8px" }
                }
                onClick={handleFiltrarBajoStock}
                variant="contained"
              >
                {!toggle ? "Stock crítico" : "Todos los insumos"}
              </Button>
            </Grid>
            <Grid item>
              <Link to={"/insumos/form"} style={{ textDecoration: "none" }}>
                <Button
                  sx={
                    !isMobile
                      ? { width: "180px", height: "54px" }
                      : { width: "100px", height: "60px" }
                  }
                  variant="contained"
                >
                  Crear Insumo
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>

        <br />


        {isContentLoaded && (
          <div className={style.tableContainer} style={{ width: "100%", height: "100%" }}>
            <Grid
              className={`${style.columns1} ${isMobile ? style.columns2 : ""}`}
              style={{ height: "100%", width: "100%", background: "white" }}
            >
              <DataGrid
                key={props.id}
                rows={toggle ? insumosBajoStock : rows}
                columns={isMobile ? columns2 : columns1}
                pageSize={isMobile ? 10 : 10}
                pageSizeOptions={isMobile ? [10, 25, 50, 100] : [10, 25, 50, 100]}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: isMobile ? 10 : 10,
                    },
                  },
                }}
                style={{ background: "white" }}
              />
            </Grid>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
    </>
  );
}
