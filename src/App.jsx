import { Route, Routes } from "react-router-dom";
import Home from '../src/views/Home/Home.jsx';
import './App.css';
import Proveedores from "./components/Proveedores/Proveedores.jsx";
import Recetas from "./components/Recetas/Recetas.jsx";
import RecetaDetalle from "./components/RecetaDetalle/RecetaDetalle.jsx";
import ProveedoresForm from "./components/ProveedoresForm/ProveedoresForm.jsx"
import InsumosForm from "./components/InsumosForm/InsumosForm.jsx";
import InsumosFormId from "./components/InsumosForm/InsumosFormId.jsx";
import ProveedoresFormId from "./components/ProveedoresForm/ProveedoresFormId.jsx";
import Usuarios from "./components/Usuarios/Usuarios.jsx";
import UsuariosForm from "./components/UsuariosForm/UsuariosForm.jsx";
import UsuariosFormEdit from "./components/UsuariosForm/UsuariosFormEdit.jsx";
import FormReceta from "./components/FormReceta/FormReceta.jsx";
import FormRecetaInsumoId from "./components/FormReceta/FormRecetaInsumoId.jsx";
import DataTable from "./components/Insumos/Insumos2.jsx"
import Remitos from "./components/Remitos/Remitos.jsx";
import LoginScreen from "./views/Login/LoginScreen.jsx";
import FormRemito from "./components/FormRemito/FormRemito.jsx"
import ViewMovimientos from "./views/ViewMovimientos/ViewMovimientos.jsx";
import Stock from "./components/Stock/Stock.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import Graficos from "./views/Graficos/Graficos.jsx"
import Proyeccion from "./components/Proyeccion/Proyeccion.jsx";
import StockHistorial from "./components/StockHistorial/StockHistorial.jsx"
import MiPerfil from "./components/MiPerfil/MiPerfil.jsx";
import AuthGuard from "./AuthGuard/AuthGuard.jsx";
 

function App() {

  return (
    <div className="App App-Header">
      <Routes>

          <Route exact path="/" element={<LoginScreen />}/>
          <Route exact path="*" element={<>NOT FOUND</>}/>


        {/* <Route element={<AuthGuard/>}>
        </Route> */}
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route exact path="/usuarios" element={<Usuarios />}/>
          <Route exact path="/usuarios/form" element={<UsuariosForm />}/>
          <Route exact path="/usuarios/form/:id" element={<UsuariosFormEdit />}/>
          <Route exact path="/graficos" element={<Graficos />}/>
          <Route exact path="/receta/form" element={<FormReceta />}/>

          <Route exact path="/proyeccion" element={<Proyeccion />}/>
          <Route exact path="/proveedores/form/:id" element={<ProveedoresFormId />}/>
          <Route exact path="/insumos" element={<DataTable />}/>
          <Route exact path="/home" element={<Home />}/>
          <Route exact path="/insumos/form" element={<InsumosForm />}/>
          <Route exact path="/insumos/form/:id" element={<InsumosFormId />}/>
          <Route exact path="/proveedores" element={<Proveedores />}/>
          <Route exact path="/proveedores/form" element={<ProveedoresForm />}/>
          <Route exact path="/remito" element={<Remitos />}/>
          <Route exact path="/remito/form" element={<FormRemito />}/>
          <Route exact path="/produccion" element={<Recetas />}/>
          {/* <Route exact path="/receta/insumo/:id" element={<FormRecetaInsumoId />}/> */}
          <Route exact path="/produccion/:id" element={<RecetaDetalle />}/>
          <Route exact path="/movimientos" element={<ViewMovimientos />}/>
          <Route exact path="/stock" element={<Stock />}/>
          <Route exact path="/stock/historial" element={<StockHistorial />}/>
          <Route exact path="/perfil" element={<MiPerfil/>}/>
      </Routes>
    </div>
  )
}

export default App
