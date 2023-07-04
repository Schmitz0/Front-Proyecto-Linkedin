import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@mui/material/CardMedia';

const useStyles = makeStyles({
  container: {
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
  info: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
  },
  quantity: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '60px',
    left: '0',
    right: '0',
  },
});

const Usuario = (props) => {
  const classes = useStyles();

  return (
    <>
      <Card sx={{ width: '320px', height: '420px', position: 'relative' }}>
        <div className={classes.container}>

          <CardMedia
            component="img"
            image={props.imgUrl}
            alt="item"
            sx={{ width: 'auto', maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>

        <div >
          <CardContent><b>{props.name}</b></CardContent>
        </div>
        <div >
          <Typography>Rol: {props.role}</Typography>
        </div>
        <div >
          <Typography>{props.email}</Typography>
        </div>

      </Card>

    </>
  );
};

export default Usuario;
