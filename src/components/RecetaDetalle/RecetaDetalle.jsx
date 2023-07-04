import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReceta, getRecetaDetalle, postRecetaInsumo, postMovimientoReceta, getAllRecetas, getAllInsumos, putRecetaInsumo, deleteInsumoReceta } from '../../redux/actions/index.js';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar.jsx';
import { DataGrid } from '@mui/x-data-grid';
import { FormControl, MenuItem, OutlinedInput, Select, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { exportToExcel } from '../../helpers/helpers';
import excelIcon from '../../assets/excel.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import style from './RecetaDetalle.module.css';
import styles from '../Insumos/Insumos.module.css';
import { Buffer } from 'buffer';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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

export default function RecetaDetalle(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);
  const [editar, setEditar] = React.useState(false);
  const { id } = useParams();
  const receta = useSelector((state) => state.recetaDetalle);
  const insumos = useSelector((state) => state?.insumos);

  const token = localStorage.getItem('token');

  const ses = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());

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

  const [input, setInput] = useState({
    tipoDeMovimiento: 'Receta',
    motivo: '',
    cantidadProducida: '',
  });

  const [insumoReceta, setInsumoReceta] = useState({
    idPrevio: '',
    idInsumoNuevo: '',
    cantidad: '',
  });

  const [recetaName, setRecetaName] = useState(receta?.name);

  useEffect(() => {
    dispatch(getAllInsumos());
    dispatch(getRecetaDetalle(id));
    setRecetaName(receta?.name);
  }, [dispatch, id, receta?.name, putRecetaInsumo]);

  const rows = receta && receta.Insumos ? receta.Insumos : [];

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = (data) => {
    setInsumoReceta({ idPrevio: data });
    setOpen2(true);
  };

  const handleClickOpen3 = (data) => {
    setOpen3(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleChange = (event) => {
    if (event.target.name === 'cantidadProducida') {
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

  const handleRecetaName = async () => {
    try {
      const newName = await swal({
        title: 'Escriba el nuevo nombre de la receta:',
        content: 'input',
        button: {
          text: 'Guardar',
          closeModal: false,
        },
      });
      if (!newName) {
        swal.close();
        return;
      }
      setRecetaName(newName);
      await dispatch(putRecetaInsumo(id, { name: newName }));
      await dispatch(getAllRecetas());
      await swal({
        title: `Nombre de la receta reemplazado exitosamente`,
        timer: 6000,
        icon: 'success',
        button: {},
      });

      swal.close();
    } catch (error) {
      swal('Oh noes!', 'The AJAX request failed!', 'error');
      console.error(error);
      swal.close();
    }
  };

  const handleChangeInsumo = (event) => {
    const { name, value } = event.target;
    setInsumoReceta((prevInsumoReceta) => ({
      ...prevInsumoReceta,
      [name]: Number(value),
    }));
  };

  // console.log(InsumoReceta);
  const handleExportToExcel = () => {
    const csvData = [
      { receta: receta.name },
      ...rows.map((insumo) => ({
        id: insumo.id,
        nombre: insumo.nombre,
        categoria: insumo.categoria,
        cantidad: Number(insumo.InsumoReceta.cantidad).toFixed(6),
        costo: Number(insumo.InsumoReceta.costo).toFixed(2),
      })),
    ];
    exportToExcel(csvData, 'insumos');
  };

  const handleProducir = () => {
    dispatch(getAllInsumos());
    dispatch(postMovimientoReceta(input, id));
    setOpen(false);
    swal({
      icon: 'success',
      title: `${input.cantidadProducida} unidades de ${receta.name} producidas con éxito`,
    }).then(() => {
      // window.location.reload();
    });
    navigate('/movimientos');
  };

  const handleEditarInsumo = (insumoReceta) => {
    const idPrevio = Number(insumoReceta.idPrevio);
    console.log(id, insumoReceta);

    dispatch(deleteInsumoReceta(Number(id), idPrevio)).then(() => {
      dispatch(postRecetaInsumo(Number(id), insumoReceta));
    });
    setOpen(false);
    swal({
      icon: 'success',
      title: 'Editado con éxito',
    }).then(() => {
      window.location.reload();
    });
    setOpen2(false);
  };
  const handleEditarInsumo1 = (insumoReceta) => {
    const idPrevio = Number(insumoReceta.idPrevio);
    console.log(id, insumoReceta);
    dispatch(postRecetaInsumo(Number(id), insumoReceta));
    setOpen(false);
    swal({
      icon: 'success',
      title: 'Editado con éxito',
    }).then(() => {
      window.location.reload();
    });
    setOpen3(false);
  };
  const handlerClickDelete = (id) => {
    swal({
      title: `Esta seguro de borrar la receta de ${receta.name} ?`,
      text: 'Esta función solo debe utilizarse para borrar Recetas creadas erróneamente!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteReceta(id)).then(() => {
          dispatch(getAllRecetas());
        });
        swal(`Poof! La receta de id ${receta.name} fue borrada!`, {
          icon: 'success',
        }).then(() => navigate('/produccion'));
      } else {
        swal('La receta NO fue borrada');
      }
    });
  };

  const handleChangeSelect = (event) => {
    setInsumoReceta((prevState) => ({
      ...prevState,
      idInsumoNuevo: event.target.value,
    }));
  };

  const handleChangeTextField = (event) => {
    setInsumoReceta((prevState) => ({
      ...prevState,
      cantidad: event.target.value,
    }));
  };

  const handlerDeleteInsumo = (e, rowId) => {
    // console.log(id, rowId);

    swal({
      title: '¿Está seguro?',
      text: `Está por borrar el insumo ${rowId} de ${receta.name}!`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteInsumoReceta(id, rowId)).then(() => {
          dispatch(getRecetaDetalle(id));
        });
        swal(`¡El insumo de id ${rowId} fue borrado!`, {
          icon: 'success',
        });
      } else {
        swal(`¡El insumo de id ${rowId} NO fue borrado!`);
      }
    });
  };

  const columns1 = [
    {
      field: 'exportar',
      headerName: 'Exportar',
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 60,
      headerClassName: style.exportar,
      renderHeader: () => (
        <IconButton
          variant="contained"
          onClick={handleExportToExcel}
          style={{
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={excelIcon}
            alt="Exportar a Excel"
            title="Exportar a Excel"
            style={{ width: '30px', height: '30px' }}
          />
        </IconButton>
      ),
      renderCell: (params) => <div className={styles.ids}>{params.row.id}</div>,
    },
    { field: 'nombre', headerName: 'Nombre', width: 220 },
    { field: 'categoria', headerName: 'Categoria', width: 90 },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      type: 'number',
      disableColumnMenu: true,
      hideSortIcons: true,
      sorteable: false,
      width: 200,
      renderCell: (params) => {
        const aux = Number(params.row.InsumoReceta.cantidad).toFixed(2);
        return <p>{aux}</p>;
      },
    },
    {
      field: 'costo',
      headerName: 'Costo',
      disableColumnMenu: true,
      hideSortIcons: true,
      sorteable: false,
      type: 'number',
      width: 200,
      renderCell: (params) => {
        // console.log(params.row.InsumoReceta);
        const aux = Number(params.row.InsumoReceta.costo).toFixed(2);
        return <p>{aux}</p>;
      },
    },
    {
      field: 'editar',
      headerName: 'Editar',
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 70,
      renderCell: (params) => (
        // !editar ? null :
        
        <IconButton
          onClick={() => handleClickOpen2(params.row.id)}
          key={params.row.id}
          disabled={!editar}
          sx={{ color: 'blue' }}
        >
          <ModeEditIcon />
        </IconButton>
        
      ),
    },

    {
      field: 'borrar',
      headerName: 'Borrar',
      sortable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 70,
      renderCell: (params) => {
        if (ses.role !== 'Admin') return null;

        return (
          <IconButton
            key={params.row.id}
            disabled={!editar}
            onClick={() => handlerDeleteInsumo(params.row.e, params.row.id)}
          >
            <DeleteIcon sx={{ color: editar ? 'blue' : 'ligthGrey' }} />
          </IconButton>
        );
      },
    },
  ];

  const columns2 = [
    { field: 'nombre', headerName: 'Nombre', width: 160 },
    {
      field: 'cantidad',
      headerName: 'cantidad',
      type: 'number',
      disableColumnMenu: true,
      hideSortIcons: true,
      sorteable: false,
      width: 80,
      renderCell: (params) => {
        const aux = Number(params.row.InsumoReceta.cantidad).toFixed(6);
        return <p>{aux}</p>;
      },
    },
    {
      field: 'costo',
      headerName: 'costo',
      disableColumnMenu: true,
      hideSortIcons: true,
      sorteable: false,
      type: 'number',
      width: 80,
      renderCell: (params) => {
        const aux = Number(params.row.InsumoReceta.costo).toFixed(2);
        return <p>{aux}</p>;
      },
    },
  ];
console.log(editar);
  return (
    <>
      <NavBar />

      <Link to={'/produccion'} style={{ textDecoration: 'none' }}>
        <ArrowBackIcon />
      </Link>
      
        <h1>{receta?.name && recetaName}</h1>

   
      <div 
      style={{
        display: "flex",
        flexDirection: isMobile ? 'column' : 'row' ,
        alignItems: "center",
        justifyContent: "center",
        marginBottom:'16px',
      }}
      >

      <Button
        onClick={handleClickOpen}
        value={id}
        sx={{
          width: '300px',
          paddingRight: '25px',
          paddingLeft: '25px',
          margin: '5px',
          color: 'white',
          borderRadius: '6px',
          background: '#2779ff',
          alignItems: 'center',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#0011ff', transition: '1s' },
        }}
      >
        Producir
      </Button>

      <Button
        onClick={()=>(setEditar(!editar))}
        value={id}
        sx={{
          width: '300px',
          paddingRight: '25px',
          paddingLeft: '25px',
          margin: '5px',
          color: 'white',
          borderRadius: '6px',
          background: editar? '#2779ff': '#b2b2b2',
          alignItems: 'center',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#0011ff', transition: '5s' },
        }}
      >
        Editar receta {editar? 'activado' : 'desactivado'}
      </Button>
      </div>
      {editar && 
      <>

<Button
        onClick={handleRecetaName}
        // value={name}
        sx={{
          width: '300px',
          paddingRight: '25px',
          paddingLeft: '25px',
          margin: '5px',
          color: 'white',
          borderRadius: '6px',
          background: '#2779ff',
          alignItems: 'center',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#0011ff', transition: '1s' },
        }}
        >
        Editar nombre de la receta
      </Button>
   
      <Button
        onClick={handleClickOpen3}
        sx={{
          width: '300px',
          paddingRight: '25px',
          paddingLeft: '25px',
          margin: '5px',
          color: 'white',
          borderRadius: '6px',
          background: '#2779ff',
          alignItems: 'center',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#0011ff', transition: '1s' },
        }}
      >
        Agregar Insumo
      </Button>

              {ses.role === 'Admin' ? (
                <Button
                  onClick={handlerClickDelete}
                  value={id}
                  sx={{
                    width: '300px',
                    paddingRight: '25px',
                    paddingLeft: '25px',
                    margin: '5px',
                    color: 'white',
                    borderRadius: '6px',
                    background: 'red',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'brown', transition: '1s' },
                  }}
                >
                  Eliminar receta
                </Button>
              ) : null}
                 </>
}  
      
                

      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Fabricación de producto</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Seleccione la cantidad a producir.
            </DialogContentText>
            <TextField
              margin="dense"
              label="Motivo"
              fullWidth
              variant="standard"
              name="motivo"
              onChange={handleChange}
              value={input.motivo}
            />
            <TextField
              margin="dense"
              type="number"
              label="Cantidad a producir"
              fullWidth
              variant="standard"
              name="cantidadProducida"
              onChange={handleChange}
              value={input.cantidadProducida}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              disabled={!input.cantidadProducida || !input.motivo}
              onClick={handleProducir}
            >
              Producir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={open2} onClose={handleClose2}>
          <FormControl>
            <DialogTitle>EDITAR O AGREGAR INSUMO</DialogTitle>
            <DialogContent>
              <Select
                sx={{ m: 1, width: 300, height: 56 }}
                displayEmpty
                name="idInsumoNuevo"
                value={insumoReceta.idInsumoNuevo || ''}
                onChange={handleChangeSelect}
                input={<OutlinedInput />}
                MenuProps={MenuProps}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem sx={{ textAlign: 'left' }} disabled value="">
                  <span>Nombre del insumo</span>
                </MenuItem>
                {insumos?.map((e, i) => (
                  <MenuItem key={i} value={e.id}>
                    {e.nombre}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                margin="dense"
                type="number"
                label="Cantidad del insumo en la receta"
                fullWidth
                variant="standard"
                name="cantidad"
                onChange={handleChangeTextField}
                value={insumoReceta.cantidad || ''}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose2}>Cancelar</Button>
              <Button onClick={() => handleEditarInsumo(insumoReceta)}>
                Editar o agregar insumo
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={open3} onClose={handleClose3}>
          <FormControl>
            <DialogTitle>AGREGAR CANTIDAD INSUMO</DialogTitle>
            <DialogContent>
              <Select
                sx={{ m: 1, width: 300, height: 56 }}
                displayEmpty
                name="idInsumoNuevo"
                value={insumoReceta.idInsumoNuevo || ''}
                onChange={handleChangeSelect}
                input={<OutlinedInput />}
                MenuProps={MenuProps}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem sx={{ textAlign: 'left' }} disabled value="">
                  <span>Nombre del insumo</span>
                </MenuItem>
                {insumos?.map((e, i) => (
                  <MenuItem key={i} value={e.id}>
                    {e.nombre}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                margin="dense"
                type="number"
                label="Cantidad del insumo en la receta"
                fullWidth
                variant="standard"
                name="cantidad"
                onChange={handleChangeTextField}
                value={insumoReceta.cantidad || ''}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose3}>Cancelar</Button>
              <Button onClick={() => handleEditarInsumo1(insumoReceta)}>
                Agregar cantidad
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </Box>

      <Box container="true" spacing={2} sx={{ marginTop:'16px', width: '100%' }}>
        {!isMobile ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
            <DataGrid
              key={props.id}
              rows={rows}
              columns={columns1}
              pageSize={5}
              pageSizeOptions={[5, 10, 50, 100]}
              rowsPerPageOptions={[5]}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              width: '100%',
            }}
          >
            <DataGrid
              key={props.id}
              rows={rows}
              columns={columns2}
              pageSize={5}
              pageSizeOptions={[5, 10, 50, 100]}
              rowsPerPageOptions={[5]}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <br></br>
      <br></br>
      <br></br>
    </>
  );
}
