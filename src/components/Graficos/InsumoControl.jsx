import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './ProductPriceChart.css';

const InsumoControl = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data?.map((item) => item.nombre);
    const cantidad = data?.map((item) => item.cantidad);

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: cantidad,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        animation: {
          duration: 0, // Desactivar animación estableciendo la duración en 0
        },
        plugins: {
          title: {
            display: true,
            text: 'Control de insumos',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
            suggestedMin: 0,
            ticks: {
              stepSize: 1, // Set the step size for y-axis ticks if needed
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="chart-container2">
      <canvas ref={chartRef} />
    </div>
  );
};

export default InsumoControl;
