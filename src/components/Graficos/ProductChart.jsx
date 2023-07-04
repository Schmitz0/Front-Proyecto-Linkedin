import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ProductPriceChart.css';

const ProductPriceChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data?.map((item) => item.nombre);
    const prices = data?.map((item) => item.precio);
    const stocks = data?.map((item) => Number(item.stock));

    const maxPrice = Math.max(...prices);
    const maxStock = Math.max(...stocks);

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Precio',
            data: prices,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-price', // Asignar un ID único al eje "y" para el precio
          },
          {
            label: 'Stock',
            data: stocks,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-stock', // Asignar un ID único al eje "y" para el stock
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Stock/precio',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          'y-axis-price': {
            type: 'linear',
            position: 'right',
            ticks: {
              callback: function (value, index, values) {
                return value + ' $';
              },
              beginAtZero: true,
              max: maxPrice, // Usar el valor máximo del precio
            },
          },
          'y-axis-stock': {
            type: 'linear',
            position: 'left',
            ticks: {
              callback: function (value, index, values) {
                return value + ' stock';
              },
              beginAtZero: true,
              max: maxStock, // Usar el valor máximo del stock
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
         onHover: (event, chartElements) => {
          if (chartElements.length > 0 && chartElements[0]) {
            const dataIndex = chartElements[0].index;
            const stock = stocks[dataIndex];
            const price = prices[dataIndex];

            const tooltipModel = chartElements[0].element.tooltipModel;
            if (tooltipModel) {
              tooltipModel.title[0].text = `Nombre: ${labels[dataIndex]}`;

              // Establecer el estilo del texto del stock en rosado
              tooltipModel.body[0].lines[1].fontColor = 'rgba(255, 99, 132, 1)';

              // Establecer el estilo del texto del precio en celeste
              tooltipModel.body[0].lines[0].fontColor = 'rgba(54, 162, 235, 1)';

              tooltipModel.body[0].lines = [`Precio: ${price}`, `Stock: ${stock}`];

              chartInstanceRef.current.tooltip.update();
            }
          } else {
            chartInstanceRef.current.tooltip.setActiveElements([], {
              xAlign: 'center',
              yAlign: 'top',
            });

            chartInstanceRef.current.tooltip.update();
          }
        },
        
        onClick: (event, chartElements) => {
          if (chartElements.length > 0 && chartElements[0]) {
            const dataIndex = chartElements[0].index;
            const stock = stocks[dataIndex];
            const price = prices[dataIndex];
            console.log(`Nombre: ${labels[dataIndex]}, Precio: ${price}, Stock: ${stock}`);
          }
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ProductPriceChart;
