import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { emailRegex } from "../../helpers/helpers.js";
import { login } from "../../redux/actions/index.js";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Typography, TextField } from "@mui/material";
import logo from "../../assets/esencial-color.png";
import style from "../Login/LoginScreen.module.css";

export default function LoginScreen(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  // const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      swal({
        title: 'Los campos no pueden estar vacíos',
        icon: 'warning',
      });
      return;
    }
    if (!emailRegex.test(email)) {
      swal({
        title: 'Debe ingresar un email válido',
        icon: 'warning',
      });
      return;
    }

    await dispatch(login(email, password));
    localStorage.getItem('token') ? navigate('/home') : swal({
      title: 'Los datos de inicio de sesion no son validos!',
      icon: 'warning',
    });
    return;
  };

  return (
    <div className={style.container}>
      <div className={style.containerForm}>
        <form className={style.form} onSubmit={submitHandler}>
          <img src={logo} className={style.formTitle} />
          <div className={style.inputContainer}>

            <input
              required
              type="text"
              placeholder="Ingrese su email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />


            <span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </div>
          <div className={style.inputContainer}>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingrese su contraseña..."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <span onClick={toggleShowPassword}>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </div>

          <button
            style={{ right: 10, marginBottom: 10 }}
            className={`${style.submit} ${email && password && style.active}`}
            type="submit"
            disabled={!email || !password}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
