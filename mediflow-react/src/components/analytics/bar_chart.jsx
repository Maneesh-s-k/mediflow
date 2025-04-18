import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, title, nameKey, valueKey, targetKey, maxValue = null, color = 'blue' }) => {
  // Calculate max value if not provided
  const calculatedMax = maxValue || Math.max(...data.map(item => 
    Math.max(item[valueKey], item[targetKey] || 0)
  )) * 1.1; // Add 10% padding
  
  // Map colors to Chart.js format
  const getColor = (colorName) => {
    const colors = {
      'blue': 'rgb(59, 130, 246)',
      'green': 'rgb(16, 185, 129)',
      'amber': 'rgb(245, 158, 11)',
      'red': 'rgb(239, 68, 68)'
    };
    return colors[colorName] || colors.blue;
  };
  
  const chartData = {
    labels: data.map(item => item[nameKey]),
    datasets: [
      {
        label: valueKey.charAt(0).toUpperCase() + valueKey.slice(1),
        data: data.map(item => item[valueKey]),
        backgroundColor: getColor(color),
        borderColor: getColor(color),
        borderWidth: 1
      }
    ]
  };
  
  // Add target dataset if targetKey is provided
  if (targetKey) {
    chartData.datasets.push({
      label: 'Target',
      data: data.map(item => item[targetKey]),
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      borderWidth: 2,
      pointStyle: 'dash',
      pointRadius: 0,
      borderDash: [5, 5]
    });
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9'
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
        max: calculatedMax,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#94a3b8'
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
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} redraw />
      </div>
    </div>
  );
};

export default BarChart;
