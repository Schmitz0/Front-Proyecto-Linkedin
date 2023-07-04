import React, { useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import ProductPriceChart from '../../components/Graficos/ProductChart';
import InsumoCantidad from '../../components/Graficos/InsumoCantidad';
import { useDispatch, useSelector } from 'react-redux';
import { getAllInsumos, getInsumoCantidad, getStockPrice, getInsumoControl } from '../../redux/actions';
import { OutlinedInput, MenuItem, Select, TextField, Box } from '@mui/material';
import NavBarDashboard from '../../components/NavBarDashboard/NavBarDashboard';
import style from '../Graficos/Graficos.module.css';
import InsumoControl from '../../components/Graficos/InsumoControl';

const Graficos = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.insumos);
  const controlInsumosPorFecha = useSelector((state) => state.insumosControl);

  const data2 = useSelector((state) => state.graficoInsumoCantidad);
  const stockPrice = useSelector((state) => state.stockPrice);
  let filterData = data;
  let filterData2 = data2;
  let filterData3 = controlInsumosPorFecha;

  const [searchValue, setSearchValue] = React.useState('');
  const [searchValue2, setSearchValue2] = React.useState('');
  const [searchValue3, setSearchValue3] = React.useState('');


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que se suma 1 para obtener el mes actual.

  const [date, setDate] = React.useState({
    filters: {
      year: currentYear.toString(),
      month: currentMonth.toString(),
    },
  });

  const valorDelStock = stockPrice.valorTotal?.toLocaleString('en', {
    style: 'currency',
    currency: 'UYU',
  });

  // filtro
  const movis = ['Envases', 'Alimentos', 'Tapa', 'Empaque'];
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

  if (searchValue !== '') {
    filterData = filterData?.filter((row) =>
      row.categoria.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (searchValue2 !== '') {
    filterData2 = filterData2?.filter((row) =>
      row.categoria.toLowerCase().includes(searchValue2.toLowerCase())
    );
  }

  if (searchValue3 !== '') {
    filterData3 = filterData3?.filter((row) =>
      row.categoria.toLowerCase().includes(searchValue3.toLowerCase())
    );
  }

  useEffect(() => {
    dispatch(getStockPrice());
    dispatch(getAllInsumos());
    dispatch(getInsumoControl(date));
    dispatch(getInsumoCantidad(date));
  }, [date, dispatch]);
  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    setDate((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: Number(value),
      },
    }));
  };

  return (
    <>
      <div style={{ marginTop: '80px' }}>
        <NavBar />

        <NavBarDashboard />
        <Box>
          <div style={{ fontWeight: 'bold', color: 'black' }}>
            Stock Valorizado: {valorDelStock ? valorDelStock : 'No disponible'}
          </div>

          <div className={style.container}>
            <Select
              sx={{ m: 1, width: 300 }}
              displayEmpty
              name="id"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                Filtrar por Categoria
              </MenuItem>
              <MenuItem value="">Mostrar todos los insumos</MenuItem>
              {movis?.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>

            <ProductPriceChart data={filterData} />
          </div>

          <br />
          <br />

          <div className={style.container}>

            <TextField
              sx={{ m: 1, width: 300 }}
              required
              type="number"
              inputProps={{ min: 1, max: 12 }}
              name="month"

              variant="outlined"
              placeholder="Mes..."
              label="Mes"
              value={date.filters.month}
              onChange={handleFiltersChange}
            />
            <TextField
              sx={{ m: 1, width: 300 }}
              required
              type="number"
              inputProps={{ min: 0 }}
              name="year"
              variant="outlined"
              placeholder="Año..."
              label="Año"
              value={date.filters.year}
              onChange={handleFiltersChange}
            />
            <Select
              sx={{ m: 1, width: 300 }}
              displayEmpty
              name="id"
              value={searchValue3}
              onChange={(e) => setSearchValue3(e.target.value)}
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                Filtrar por Categoria
              </MenuItem>
              <MenuItem value="">Mostrar todos los insumos</MenuItem>
              {movis?.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>

            <InsumoControl data={filterData3} />

            <br />
            <br />

            <Select
              sx={{ m: 1, width: 300 }}
              displayEmpty
              name="id"
              value={searchValue2}
              onChange={(e) => setSearchValue2(e.target.value)}
              input={<OutlinedInput />}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                Filtrar por Categoria
              </MenuItem>
              <MenuItem value="">Mostrar todos los insumos</MenuItem>
              {movis?.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>

            <InsumoCantidad data={filterData2} />
          </div>
        </Box>
      </div>
      <br />
      <br />
    </>
  );
};

export default Graficos;
