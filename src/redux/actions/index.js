import axios from "axios";

export const GET_ALL_INSUMOS = "GET_ALL_INSUMOS";
export const GET_ALL_USUARIOS = "GET_ALL_USUARIOS";
export const GET_ALL_PROVEEDORES = "GET_ALL_PROVEEDORES";
export const GET_ALL_RECETAS = "GET_ALL_RECETAS";
export const GET_RECETA_DETALLE = "GET_RECETA_DETALLE";
export const POST_PROVEEDOR = "POST_PROVEEDOR";
export const POST_INSUMOS = "POST_INSUMOS"; 
export const POST_USUARIO = "POST_USUARIO";
export const GET_INSUMO_DETALLE = "GET_INSUMO_DETALLE";
export const PUT_INSUMO = "PUT_INSUMO";
export const PUT_RECETA_INSUMO = "PUT_RECETA_INSUMO";
export const PUT_USUARIO = "PUT_USUARIO";
export const PUT_PROVEEDOR = "PUT_PROVEEDOR";
export const POST_RECETA = "POST_RECETA";
export const POST_MOVIMIENTO_INSUMOS = "POST_MOVIMIENTO_INSUMOS";
export const POST_MOVIMIENTO_INSUMOS_SUMA = "POST_MOVIMIENTO_INSUMOS_SUMA";
export const POST_MOVIMIENTO_RECETA = "POST_MOVIMIENTO_RECETA";
export const GET_ALL_REMITOS = "GET_ALL_REMITOS";
export const POST_REMITO = "POST_REMITO";
export const GET_RECIPES_BY_NAME = "GET_RECIPES_BY_NAME";
export const POST_ALL_REMITOS = "POST_ALL_REMITOS";
export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";
export const USER_LOGOUT = "USER_LOGOUT";
// export const USER_SIGNIN = 'USER_SIGNIN';
export const GET_ALL_MOVIMIENTO = "GET_ALL_MOVIMIENTO";
export const POST_ALL_MOVIMIENTOS = "POST_ALL_MOVIMIENTOS";
export const GET_STOCK_PRICE = "GET_STOCK_PRICE";
export const GET_BAJO_STOCK = "GET_BAJO_STOCK";
export const POST_PROYECCION = "POST_PROYECCION";
export const GET_NULL = "GET_NULL";
export const SET_NAV_BAR = "SET_NAV_BAR";
export const GET_GRAFICO_INSUMO_CANTIDAD = "GET_GRAFICO_INSUMO_CANTIDAD";
export const GET_INSUMO_CONTROL = "GET_INSUMO_CONTROL";
export const  POST_STOCK_HISTORIAL =" POST_STOCK_HISTORIAL"

const app = "https://back-proyect-linkedin-production.up.railway.app";
// const app = "http://localhost:3001";

// const token = localStorage.getItem('token');

axios.defaults.baseURL = app;

// Interceptor para agregar el token en el encabezado de las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token de tu almacenamiento (puedes ajustarlo según tu implementación)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Agrega el token en el encabezado
    }
    const name = localStorage.getItem("name"); // Obtén el usuario de tu almacenamiento (puedes ajustarlo según tu implementación)
    if (name) {
      config.headers["Name"] = name; // Agrega el usuario en el encabezado o cuerpo de la solicitud
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllInsumos = () => {
  return async function (dispatch) {
    const insumos = await axios.get(`${app}/insumo`);
    return dispatch({ type: GET_ALL_INSUMOS, payload: insumos.data });
  };
};
export const getInsumoBajoStock = () => {
  return async function (dispatch) {
    const insumos = await axios.get(`${app}/insumo/stock`);
    return dispatch({ type: GET_BAJO_STOCK, payload: insumos.data });
  };
};

export const getStockPrice = () => {
  return async function (dispatch) {
    const stockPrice = await axios.get(`${app}/dashboard`);
    return dispatch({ type: GET_STOCK_PRICE, payload: stockPrice.data });
  };
};

export const getAllUsuarios = () => {
  return async function (dispatch) {
    const usuarios = await axios.get(`${app}/usuario`);
    return dispatch({ type: GET_ALL_USUARIOS, payload: usuarios.data });
  };
};

export function getInsumoDetalle(id) {
  return async function (dispatch) {
    try {
      const insumoDetalle = await axios.get(`${app}/insumo/${id}`);
      return dispatch({
        type: GET_INSUMO_DETALLE,
        payload: insumoDetalle.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export const getAllProveedores = () => {
  return async function (dispatch) {
    const proveedores = await axios.get(`${app}/proveedor`);
    return dispatch({ type: GET_ALL_PROVEEDORES, payload: proveedores.data });
  };
};

export const getAllRecetas = () => {
  return async function (dispatch) {
    const recetas = await axios.get(`${app}/receta`);
    return dispatch({ type: GET_ALL_RECETAS, payload: recetas.data });
  };
};

export const getAllRemitos = () => {
  return async function (dispatch) {
    const insumos = await axios.get(`${app}/remito`);
    return dispatch({ type: GET_ALL_REMITOS, payload: insumos.data });
  };
};

export const getAllMovimientos = (data) => {
  return async function (dispatch) {
    const movimientos = await axios.post(`${app}/movimiento/estado`,data);
    return dispatch({ type: GET_ALL_MOVIMIENTO, payload: movimientos.data });
  };
};

export function getRecetaDetalle(id) {
  return async function (dispatch) {
    try {
      const recetaDetalle = await axios.get(`${app}/receta/${id}`);
      return dispatch({
        type: GET_RECETA_DETALLE,
        payload: recetaDetalle.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export const postProveedor = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/proveedor`, values);
      return { type: POST_PROVEEDOR, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};

export const postInsumo = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/insumo`, values);
      return { type: POST_INSUMOS, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};
export const postReceta = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/receta`, values);
      return { type: POST_RECETA, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};
export const postStockHistorial = (id) => {
  return async function () {
    try {
      await axios.post(`${app}/movimiento/historial/${id}`);
      return { type: POST_STOCK_HISTORIAL };
    } catch (error) {
      console.log(error);
    }
  };
};

export const postUsuario = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/usuario`, values);
      return { type: POST_USUARIO, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};

export const putInsumo = (id, data) => {
  return async function () {
    try {
      await axios.put(`${app}/insumo/${id}`, data);
      return { type: PUT_INSUMO };
    } catch (error) {
      console.log(error);
    }
  };
};

export const putRecetaInsumo = ( id, data ) => {
  console.log(id, data.name);
  return async function () {
    try {
      await axios.put(`${app}/receta/${id}`, data);
      return { type: PUT_RECETA_INSUMO };
    } catch (error) {
      console.log(error);
    }
  };
};

export const postRecetaInsumo = (  id, data ) => {
  return async function () {
    try {
      await axios.post(`${app}/receta/${id}`, data);
      return "ahi vamos";
    } catch (error) {
      console.log(error);
    }
  };
};
export const postControlInsumo = (id,data) => {
  return async () => {
    try {
      await axios.post(`${app}/movimiento/historial/control/${id}`,data);
      console.log("Solicitud POST exitosa");
    } catch (error) {
      console.log(error);
    }
  };
};

export const putProveedor = (id, data) => {
  return async function () {
    try {
      await axios.put(`${app}/proveedor/${id}`, data);
      return { type: PUT_PROVEEDOR };
    } catch (error) {
      console.log(error);
    }
  };
};

export const putUsuario = (id, data) => {
  return async function () {
    try {
      await axios.put(`${app}/usuario/${id}`, data);
      return { type: PUT_USUARIO };
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteInsumo = (id) => {
  return async function () {
    try {
      await axios.delete(`${app}/insumo/${id}`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteInsumoReceta = (id, rowId) => {

  return async function () {
    try {
      await axios.delete(`${app}/receta/${id}`, { data: { insumoId: rowId } });
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteReceta = (id) => {
  return async function () {
    try {
      await axios.delete(`${app}/receta/${id}`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};
export const deleteUsuario = (id) => {
  return async function () {
    try {
      await axios.delete(`${app}/usuario/${id}`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};
export const postMovimientoInsumo = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/movimiento`, values);
      return { type: POST_MOVIMIENTO_INSUMOS, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};

export const postMovimientoReceta = (values, id) => {
  console.log(values);
  return async function () {
    try {
      await axios.post(`${app}/movimiento/${id}`, values);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const postRemito = (values) => {
  return async function () {
    try {
      await axios.post(`${app}/remito`, values);
      return { type: POST_REMITO, payload: { ...values } };
    } catch (error) {
      console.log(error);
    }
  };
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await axios.post(`${app}/users/login`, {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("imgUrl", data.imgUrl);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRemitoByName = (name) => {
  return async function (dispatch) {
    try {
      dispatch(loading());
      const allRecipesByName = await axios.get(`${app}/remito?name=${name}`);
      return dispatch({
        type: GET_RECIPES_BY_NAME,
        payload: allRecipesByName.data,
      });
    } catch (error) {
      return dispatch({
        type: GET_RECIPES_BY_NAME,
        payload: [],
      });
    }
  };
};

export const postAllRemitos = (values) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(`${app}/remito/filters`, values);
      dispatch({ type: POST_ALL_REMITOS, payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteRemito = (id) => {
  return async function () {
    try {
      await axios.delete(`${app}/remito/${id}`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteMovimiento = (id) => {
  return async function () {
    try {
      await axios.delete(`${app}/movimiento/${id}`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const postAllMovimientos = (values) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(`${app}/movimiento/filters`, values);
      dispatch({ type: POST_ALL_MOVIMIENTOS, payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const postPreciosAct = () => {
  return async function () {
    try {
      const response = await axios.put(`${app}/receta/precios`);
      return "Gracias";
    } catch (error) {
      console.log(error);
    }
  };
};

export const postProyeccion = (input) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(`${app}/dashboard`, input);
      dispatch({ type: POST_PROYECCION, payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getNull = () => {
  return async function (dispatch) {
    return dispatch({ type: GET_NULL, payload: null });
  };
};
export const setNavBar = () => {
  return async function (dispatch) {
    return dispatch({ type: SET_NAV_BAR, payload: null });
  };
};

export const getInsumoCantidad = (data) => {
  return async function (dispatch) {
    const insumos = await axios.post(`${app}/dashboard/insumoCantidad`, data);
    return dispatch({
      type: GET_GRAFICO_INSUMO_CANTIDAD,
      payload: insumos.data,
    });
  };
};

export const getInsumoControl = (date) => {
  return async function (dispatch) {
    const insumos = await axios.post(`${app}/dashboard/insumoControl`, date);
    return dispatch({ type: GET_INSUMO_CONTROL, payload: insumos.data });
  };
};
