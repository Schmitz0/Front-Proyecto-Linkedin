import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from '../NavBar/NavBar.module.css';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, } from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/esencial-color.png';
import UserStatus from '../UserStatus/UserStatus';
import { Buffer } from 'buffer';

//const pages = ['home', 'insumos', 'recetas', 'remito', 'movimientos','stock', 'proveedores','dashboard' ]
// const pagesUser = ['home', 'insumos', 'recetas', 'remito', 'movimientos','stock', 'proveedores' ]
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
let pages = []

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const token = localStorage.getItem('token')

  const ses = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());

  const [pages, setPages] = React.useState([])
  React.useEffect(() => {
    if (ses.role === "User") { setPages(['home', 'insumos', 'produccion', 'remito', 'movimientos', 'stock', 'proveedores']) }
    else if (ses.role === "Admin") { setPages(['home', 'insumos', 'produccion', 'remito', 'movimientos', 'stock', 'proveedores', 'dashboard']) }
  }, [React.useState, setPages])


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar>
      <Container 
      
      disableGutters>
      <Box 
      sx={{ display: "flex", alignItems: "center", justifyContent:'space-between' }}
      >

        <Toolbar className={styles.toolBar} 
        
        disableGutters>
          <Typography
            // variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              padding: '5px',
              display: { xs: 'none', md: 'flex' },
              // fontFamily: 'monospace',
              // fontWeight: 700,
              // letterSpacing: '.3rem',
              // color: 'inherit',
              // textDecoration: 'none',
            }}
          >
            <img src={logo} alt="no hay" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={handleCloseNavMenu}>
                  <Link to={`/${page}`} style={{ textDecoration: 'none' }}>
                    <Typography textAlign="center">{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              // fontFamily: 'monospace',
              // fontWeight: 700,
              // letterSpacing: '.3rem',
              // color: 'inherit',
              // textDecoration: 'none',
            }}
          >
            {/* <img src={logo} alt="no hay" /> */}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, i) => (
              <Link key={i} to={`/${page}`} style={{ textDecoration: 'none' }}>
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    boxShadow: location.pathname === `/${page}` ? '0 0 5px rgba(0, 0, 0, 0.5)' : 'none',
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          
        </Toolbar>
          <Box sx={{  marginLeft:'auto', marginRight:'40px' }}>
            <UserStatus />
          </Box>
        

        </Box>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
