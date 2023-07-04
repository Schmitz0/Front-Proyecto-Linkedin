import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { emailRegex } from '../../helpers/helpers.js';
import { postUsuario, getAllUsuarios } from "../../redux/actions";
import NavBar from "../NavBar/NavBar"
import NavBarDashboard from "../NavBarDashboard/NavBarDashboard"
import style from "../UsuariosForm/UsuariosForm.module.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, FormControl } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const UsuariosForm = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const usuarios = useSelector((state) => state.usuarios);

	useEffect(() => {
		dispatch(getAllUsuarios());
	}, [dispatch, useState]);


	const roles = ["Admin", "User", "SuperAdmin"];

	const [input, setInput] = useState({
		name: "",
		email: "",
		password: "",
		role: "",
		imgUrl: "",
	})

	const [warning, setWarning] = useState('')


	const handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;

		setInput({
			...input,
			[name]: value,
		});
		// Validar la entrada de correo electrónico
		if (name === 'email') {
			const isValidEmail = emailRegex.test(value);
			setInput({
				...input,
				[name]: value,
				emailError: !isValidEmail,
				emailErrorMessage: isValidEmail ? '' : 'Ingrese un correo electrónico válido',
			});
			if (usuarios.some(u => u.email === value)) {
				//   const emailExists = true;
				setInput({
					...input,
					[name]: value,
					emailError: true,
					emailErrorMessage: `El correo electrónico "${value}" ya está registrado.`,
				});
			}
		}
	};

	const HandleSubmit = async (e) => {
		e.preventDefault();
		dispatch(postUsuario(input))
		swal({
			title: `El usuario ${input.name} fue editado con éxito`,
			icon: "success",
		}).then(
			() => { navigate('/usuarios') })
	};

	return (
		<>
			<div >
				<div >
					<NavBar />
					<NavBarDashboard />


					<form onSubmit={HandleSubmit}>
						<FormControl sx={{ m: 1.5, alignItems: 'center' }}>
						
							<div className={style.selectContainer}>

								<Link to={'/usuarios'} style={{ textDecoration: 'none' }}>
									<Button>
										<ArrowBackIcon /> Atrás 
									</Button>
								</Link> 
								<br/>
                <br/>

								<Box>
									<TextField
										sx={{ m: 1, width: 300 }}
										required
										name='name'
										variant='outlined'
										placeholder='Nombre...'
										onChange={handleChange}
										value={input.name}
									/>
									<TextField
										sx={{ m: 1, width: 300 }}
										required
										name='email'
										variant='outlined'
										placeholder='Email...'
										onChange={handleChange}
										value={input.email}
										error={input.emailError}
										helperText={input.emailErrorMessage}
									/>
									<TextField
										sx={{ m: 1, width: 300 }}
										name="password"
										type="password"
										variant="outlined"
										placeholder="password..."
										label="password..."
										onChange={handleChange}
										value={input.password}
									/>

									<FormControl>
										<Select
											sx={{ m: 1, width: 300 }}
											required
											displayEmpty
											name="role"
											value={input.role}
											onChange={handleChange}
											input={<OutlinedInput />}
											MenuProps={MenuProps}
											inputProps={{ 'aria-label': 'Without label' }}
										>
											<MenuItem disabled value="">
												<span>Rol</span>
											</MenuItem>
											{roles?.map((e, i) => (
												<MenuItem key={i} value={e}>
													{e}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<TextField
										sx={{ m: 1, width: 300 }}
										name='imgUrl'
										variant='outlined'
										placeholder='Imagen...'
										multiline
										onChange={handleChange}
										value={input.imgUrl}
										rows={2}
									/>
								</Box>

							</div>


							<div className={style.botonContainer}>
								<Button
									disabled={!!warning || !input.name || !input.email || !input.role || !emailRegex.test(input.email) || input.emailError}
									className={style.boton}
									pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
									type='submit'
									sx={{
										paddingRight: '25px',
										paddingLeft: '25px',
										marginBottom: '10px',
										color: 'white',
										borderRadius: '6px',
										background: '#2779ff',
										alignItems: 'center',
										'&:hover': {
											backgroundColor: '#5151519c',
											transition: '1s',
										},
									}}
								>
									Submit
								</Button>
							</div>
						</FormControl>
					</form>
				</div>
				{warning ? <p> {warning} <Link to={'/paraaaaCrack'}>Recuperar la contraseña</Link> </p> : null}
			</div>

		</>
	)
}

export default UsuariosForm;