import { React, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import style from "../Insumos/Insumos.module.css"
import Insumo from "../Insumo/Insumo";
import NavBar from "../NavBar/NavBar"
import { deleteInsumo, getAllInsumos } from "../../redux/actions";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const Insumos = ()=>{

  const dispatch = useDispatch()
  
  const insumos = useSelector((state)=>state.insumos)
  

  useEffect(() => { dispatch(getAllInsumos()) }, [dispatch])

  const handlerClickDelete = (event, id) => {
    event.preventDefault();
    swal({
      title: "Esta seguro?",
      text: "Esta función solo debe utilizarse para borrar Insumos recién creados erróneamente!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          dispatch(deleteInsumo(id)).then(()=>{(dispatch(getAllInsumos()))})
          swal("Poof! Tu insumo fue borrado!", {
            icon: "success",
          });
        } else {
          swal("Tranquilo, todo bien!");
        }
        
      });
  }


  const exportToExcel = (csvData, fileName) => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const formattedDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const newFileName = `${fileName}_${formattedDate}${fileExtension}`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, newFileName);
  };
  
 const handleExportToExcel = () => {
    const csvData = insumos.map((insumo) => {
      return {
        id: insumo.id,
        nombre: insumo.nombre,
        precio: insumo.precio,
        cantidad: insumo.cantidad,
        proveedor: insumo.proveedor,
      };
    });
  
    exportToExcel(csvData, 'insumos');
  };

  return (
    <>
      <div className={style.navBar}>
      <NavBar />
      <Button  style={{right:10, marginBottom:10}} variant="contained" onClick={handleExportToExcel}>
      Exportar a Excel
    </Button>
   
      <Link to={"/insumos/form"} style={{ textDecoration: 'none' }}>	
          <div className={style.boton}>
            <Button style={{right:10}} variant="contained">Crear Insumo</Button>
          </div>
      </Link>
      <br></br>
    
      </div>
      
      <br></br>

      <div className={style.mainContainer}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell align="right">Id</TableCell>
                  <TableCell >Nombre </TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
              {insumos?.map((e,i) =>{
                return <Insumo
                          key={i}
                          id={e.id}
                          nombre={e.nombre}
                          precio={e.precio}
                          stock={e.stock}
                          categoria={e.categoria}
                          unidad={e.unidad}
                          descripcion={e.descripcion}
                          proveedor={e.proveedor}
                          imgUrl={e.imgUrl}
                          handlerClickDelete={(event) => handlerClickDelete(event, e.id)}
                        >
                        </Insumo>
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        <br></br>
      </div>
    </>
  )
}

export default Insumos;