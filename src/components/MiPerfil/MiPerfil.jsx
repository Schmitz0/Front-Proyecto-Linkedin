import NavBar from '../NavBar/NavBar';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button, TextField, Card, CardMedia, Typography, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material/';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsuarios, login, putUsuario } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';

const MiPerfil = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const usuarios = useSelector((state) => state.usuarios);
  const [ open, setOpen ] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPass:'',
    newPass:'',
    newPassAgain:'',
    password:''
  })
  const [pass, setPass] = useState({
    password:''
  })
  useEffect(() => {
    dispatch(getAllUsuarios());
  }, [dispatch]);

  const token = localStorage.getItem('token');

  const ses = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());
  const usuario = usuarios.filter((e) => e.email === ses.email);
  // console.log(ses);
  // console.log(usuarios);
  // console.log(usuario);

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswords(
      {
        ...passwords,
        [name]: value,
      },
      )
      console.log(name, value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  
const handleActualizar = () => {
  // localStorage.clear()
  dispatch(login(ses.email, passwords.oldPass))
    .then(() => {
      // const token = localStorage.getItem('token');
      setPass({ password: passwords.newPass });
    })
    .then(() => dispatch(putUsuario(ses.id, pass)))
    .then(() => {
      swal({
        title:`Su contraseña fue actualizada con éxito.`,
        text:`Ingrese a su cuenta nuevamente`,
        icon: "success",
        // timer: 1000,
        showButton: false
      }).then(
        () => { (navigate(`/`)) }
      )
      // console.log(pass.password);
      setOpen(false);
    })
    .catch(error => console.error(error));
};

useEffect(() => {
  if (passwords.newPass) {
    setPass({ password: passwords.newPass });
  }
}, [passwords.newPass]);

  const handleClose = () => {
    setPasswords({
      oldPass:'',
      newPass:'',
      newPassAgain:'',
    })
    setOpen(false);
  };

  return (
    <>
      <NavBar />
      <Card
        sx={{
          padding:'20px',
          marginTop:'0px',
          width: '320px',
          height: '420px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems:'center'
        }}
      >
        <h2>Mi perfil</h2>
        <div>
          <CardMedia
            component="img"
            image={usuario[0]?.imgUrl}
            alt=""
            sx={{ width: 'auto', maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>

        <div>
          <CardContent>
            <b>{ses.name}</b>
          </CardContent>
        </div>
        <div>
          <Typography>Rol: {ses.role}</Typography>
        </div>
        <div>
          <Typography>Email: {ses.email}</Typography>
        </div>
        <div>
          <Button onClick={handleClickOpen}>Cambiar contraseña</Button>
        </div>


        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Actualizar contraseña</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ingrese su contraseña acutal
              </DialogContentText>
              <TextField
                sx={{ m: 1, width: 300 }}
                name="oldPass"
                type="password"
                variant="outlined"
                placeholder="contraseña acutal"
                label="contraseña acutal"
                onChange={handleChange}
                value={passwords.oldPass}
              />
               <DialogContentText>
                Ingrese su nueva contraseña
              </DialogContentText>
              <TextField
                sx={{ m: 1, width: 300 }}
                name="newPass"
                type="password"
                variant="outlined"
                placeholder="nueva contraseña"
                label="nueva contraseña"
                onChange={handleChange}
                value={passwords.newPass}
              />
                <DialogContentText>
                Confirme su nueva contraseña
              </DialogContentText>
              <TextField
                sx={{ m: 1, width: 300 }}   
                name="newPassAgain"
                type="password"
                variant="outlined"
                placeholder="nueva contraseña"
                label="nueva contraseña"
                onChange={handleChange}
                value={passwords.newPassAgain}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button 
              disabled={ !passwords.oldPass ||  !passwords.newPass ||  !passwords.newPassAgain ||
                // Si la contraseña del token es igual a la ingresada
                // Si la contraseña nueva1 es diferente a la contraseña nueva2
                passwords.newPass !== passwords.newPassAgain
              }
              onClick={handleActualizar}>Actualizar</Button>
            </DialogActions>
          </Dialog>





      </Card>
    </>
  );
};

export default MiPerfil;
