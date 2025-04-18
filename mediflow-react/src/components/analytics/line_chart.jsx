import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, title, xKey, yKeys, colors, height = 300 }) => {
  // Transform the data for Chart.js
  const chartData = {
    labels: data.map(item => {
      // Format date strings like "2025-04-12" to "04/12"
      if (xKey === 'date' && item[xKey].includes('-')) {
        return item[xKey].split('-').slice(1).join('/');
      }
      return item[xKey];
    }),
    datasets: yKeys.map((key, index) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
      data: data.map(item => item[key]),
      backgroundColor: colors[index],
      borderColor: colors[index],
      tension: 0.4,
      fill: false
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9' // Light text color for dark theme
        }
      },
      title: {
        display: !!title,
        text: title,
        color: '#f1f5f9'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#94a3b8' // Light gray text for axis labels
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} redraw />
      </div>
    </div>
  );
};

export default LineChart;
