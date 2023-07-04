import {
  POST_REGISTRO_USUARIO,
  SET_NAV_BAR,
  POST_PROYECCION,
  GET_GRAFICO_INSUMO_CANTIDAD,
  GET_ALL_MOVIMIENTO,
  POST_ALL_MOVIMIENTOS,
  USER_LOGIN_SUCCESS,
  POST_USUARIO,
  POST_MOVIMIENTO_INSUMOS,
  GET_ALL_INSUMOS,
  GET_ALL_USUARIOS,
  GET_INSUMO_DETALLE,
  GET_ALL_PROVEEDORES,
  GET_BAJO_STOCK,
  GET_ALL_RECETAS,
  GET_RECETA_DETALLE,
  POST_PROVEEDOR,
  POST_INSUMOS,
  POST_RECETA,
  GET_ALL_REMITOS,
  POST_REMITO,
  GET_RECIPES_BY_NAME,
  POST_ALL_REMITOS,
  GET_STOCK_PRICE,
  GET_NULL,
  GET_INSUMO_CONTROL,
  POST_STOCK_HISTORIAL,
} from "../actions/index.js";

const initialState = {
  insumos: [],
  insumosControl: [],
  graficoInsumoCantidad: [],
  insumosProyectados: [],
  stockPrice: [],
  usuarios: [],
  registroUsuario: [],
  proveedores: [],
  recetas: [],
  recetaDetalle: [],
  insumoDetalle: [],
  remitos: [],
  movimientos: [],
  bajoStock: [],
  pages: [],
  loading: false,
  userInfo: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_INSUMOS:
      return {
        ...state,
        insumos: action.payload,
      };
    case GET_STOCK_PRICE:
      return {
        ...state,
        stockPrice: action.payload,
      };
    case GET_BAJO_STOCK:
      return {
        ...state,
        bajoStock: action.payload,
      };
    case GET_ALL_MOVIMIENTO:
      return {
        ...state,
        movimientos: action.payload,
      };
    case GET_ALL_USUARIOS:
      return {
        ...state,
        usuarios: action.payload,
      };
    case GET_ALL_PROVEEDORES:
      return {
        ...state,
        proveedores: action.payload,
      };
    case GET_ALL_RECETAS:
      return {
        ...state,
        recetas: action.payload,
      };

    case GET_ALL_REMITOS:
      return {
        ...state,
        remitos: action.payload,
      };
    case GET_RECIPES_BY_NAME:
      return {
        ...state,
        loading: false,
        remitos: action.payload,
      };

    case GET_RECETA_DETALLE:
      return {
        ...state,
        recetaDetalle: action.payload,
      };
    case GET_INSUMO_DETALLE:
      return {
        ...state,
        insumoDetalle: action.payload,
      };
    case POST_PROVEEDOR:
      return {
        ...state,
        proveedores: [...state.proveedores, action.payload],
      };
    case POST_INSUMOS:
      return {
        ...state,
        insumos: [...state.insumos, action.payload],
      };

    case POST_RECETA:
      return {
        ...state,
        recetas: [...state.insumos, action.payload],
      };
    case POST_USUARIO:
      return {
        ...state,
        usuarios: [...state.usuarios, action.payload],
      };
    case POST_MOVIMIENTO_INSUMOS:
      return {
        ...state,
      };
    case POST_ALL_MOVIMIENTOS:
      return {
        ...state,
        movimientos: action.payload,
      };
      case POST_STOCK_HISTORIAL:
  return {
    ...state,
    movimientos: [...state.movimientos, action.payload],
  };

      

    case USER_LOGIN_SUCCESS:
      return { ...state, userInfo: action.payload };

    case POST_REMITO:
      return {
        ...state,
        remitos: [...state.remitos, action.payload],
      };

    case POST_ALL_REMITOS:
      return {
        ...state,
        remitos: action.payload,
      };
    case POST_ALL_REMITOS:
      return {
        ...state,
        movimientos: action.payload,
      };

    case POST_PROYECCION:
      return {
        ...state,
        insumosProyectados: action.payload,
      };
    case POST_REGISTRO_USUARIO:
      return {
        ...state,
        registroUsuario: action.payload,
      };
    case GET_NULL:
      return {
        ...state,
        insumosProyectados: action.payload,
      };
    case SET_NAV_BAR:
      return {
        ...state,
        pages: action.payload,
      };
    case GET_GRAFICO_INSUMO_CANTIDAD:
      return {
        ...state,
        graficoInsumoCantidad: action.payload,
      };
    case GET_INSUMO_CONTROL:
      return {
        ...state,
        insumosControl: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
