import React from 'react';
import { Link } from 'react-router-dom';
import "../Receta/Receta.css"

const Receta = (props) => {

  return (
    <>
    <div className="receta-container">
      <Link
        to={`/produccion/${props.id}`}
        style={{ textDecoration: 'none', color: 'black' }}
      >

        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={props.imgUrl} style={{ width: "160px", height: "auto", borderRadius: "20px", boxShadow: "-2px 6px 20px 0px rgba(0,0,0,0.75)" }} />
              <p>{props.name}</p>
            </div>
            <div className="flip-card-back">
              <p className="title">{props.name}</p>
              <br/>
              <p>Costo de la receta:</p>
              <p className="title">${Number(props.costoPorReceta).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Link>
      </div>
    </>
  );
};

export default Receta;
