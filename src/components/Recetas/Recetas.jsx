import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import style from "../Insumos/Insumos.module.css";
import Receta from "../Receta/Receta";
import { getAllRecetas, postPreciosAct } from "../../redux/actions";
import NavBar from "../NavBar/NavBar";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { Grid } from '@material-ui/core';
import { Buffer } from "buffer";



const Recetas = () => {
  const dispatch = useDispatch();
  const recetas = useSelector((state) => state.recetas);
  const token = localStorage.getItem('token')

  const ses = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());

  useEffect(() => {
    dispatch(getAllRecetas());
  }, [dispatch]);

  const handlerAct = () => {
    dispatch(postPreciosAct())
    location.reload()
  }

  return (
    <>
      <div>
        <div className={style.navBar}>
          <NavBar />
        </div>

        <Link to={"/receta/form"} style={{ textDecoration: "none" }}>
          <div style={{ display: (ses.role !== 'Admin' ? 'none' : ''), margin: '8px' }} >
            <Button variant="contained">
              Crear Receta
            </Button>

          </div>
        </Link>

        <div>
          <Button variant="contained" onClick={handlerAct}>
            Actualizar Precios
          </Button>
        </div>
        <br />



        <Grid
          container
          justifyContent="center"
          spacing={8}
          columns={{ xs: 20, sm: 5, md: 2 }}
        >

          {recetas?.map((e, i) => {
            return <Grid item xs={12} sm={6} md={4} lg={3} key={i} ><Receta
              key={i}
              id={e.id}
              name={e.name}
              costoPorReceta={e.costoPorReceta}
              imgUrl={e.imgUrl}
            /></Grid>
          })}
        </Grid>
        </div>
  


    </>
  );
};

export default Recetas;
