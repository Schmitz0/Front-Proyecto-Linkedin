import React, { useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavBarDashboard from '../../components/NavBarDashboard/NavBarDashboard';
// import Graficos from '../Graficos/Graficos';
import Usuarios from '../../components/Usuarios/Usuarios';

const Dashboard = () => {

  return (
    <>
      <div style={{display:'flex' , flexDirection:'column'}}>
        <NavBar />
        <NavBarDashboard />
        {/* <Graficos/> */}
        <Usuarios/>
      </div>
    </>
  );
};

export default Dashboard;