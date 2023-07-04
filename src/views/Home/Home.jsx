import React from 'react';
import "../Home/Home.css"
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';
import BotonRecetaHome from '../../components/BotonRecetaHome/BotonRecetaHome';

const Home = () => {
  const options = useSelector((state) => state.recetas);
  const names = options?.map((e) => e.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) navigate('/login');
  }, [dispatch]);

  return (
    <>

      <NavBar />

      <div className="image">
        <ButtonGroup className="container">

          <BotonRecetaHome
            options={options}
            names={names}
            className="boton"
          />

          <Link to={'/remito/form'}>
            <Button className="boton" variant="contained">
              Ingresar Remito
            </Button>
          </Link>

          <Link to={'/stock'}>
            <Button className="boton" variant="contained">
              Hacer control de stock
            </Button>
          </Link>

        </ButtonGroup>

      </div>
    </>
  );
};

export default Home;
