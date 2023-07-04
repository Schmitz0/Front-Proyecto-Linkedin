import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

export default function UserStatus() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const name = localStorage.getItem('name')
  const imgUrl = localStorage.getItem('imgUrl')

  const handleSubmit = (e) => {
    e.preventDefault
    swal({
      title: `${name.split(" ")[0]} ¿Está seguro que quiere cerrar sesión?` ,
      icon: "warning",
      buttons: true,
    })
      .then((logout) => {
        if (logout) {
          localStorage.clear()
          swal(`La sesion de ${name} fue cerrada con éxito`, {
            icon: "success",
            timer: 1000,
            showButton: false
          }).then(
            () => { (navigate(`/`)) }
          )
        }
      });
  }

  return (
    <>

      <div >
        <Link to="/perfil">
          <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name ? name : ''}
          </Typography>
        </Link>
        
        
        <Button 
          sx={{ my: 1, color: 'white', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}
          onClick={handleSubmit}>
          Cerrar sesión
        </Button>

        {/* <img src={imgUrl ? imgUrl : ''} alt="" style={{ height:'50px', width:'50px', borderRadius:'30px', border:'solid lightBlue 1px'}} /> */}

      </div>
    </>
  );
}
