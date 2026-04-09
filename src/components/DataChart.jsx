import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DataChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="container-lg py-5">
        <h3 className="text-center mb-4">Data Visualization</h3>
        <div className="alert alert-info text-center">
          No data available for visualization
        </div>
      </div>
    );
  }

  // Process data for charts
  const categoryTotals = data.reduce((acc, item) => {
    const category = item.category || 'Unknown';
    acc[category] = (acc[category] || 0) + (parseFloat(item.price || item.value || 0));
    return acc;
  }, {});

  const dateValues = data
    .filter(item => item.date && (item.price || item.value))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      month: new Date(item.date).toISOString().slice(0, 7), // YYYY-MM format
      year: new Date(item.date).getFullYear(),
      value: parseFloat(item.price || item.value || 0)
    }));

  // Aggregate data by month
  const monthlyData = dateValues.reduce((acc, item) => {
    const monthKey = item.month; // YYYY-MM format
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: item.month,
        year: item.year,
        date: item.date,
        total: 0,
        count: 0
      };
    }
    acc[monthKey].total += item.value;
    acc[monthKey].count += 1;
    return acc;
  }, {});

  // Convert to array and sort by month
  const sortedMonthlyData = Object.values(monthlyData)
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // Bar chart data for category totals
  const barChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      label: 'Total Price by Category',
      data: Object.values(categoryTotals),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Line chart data for values over time
  const lineChartData = {
    labels: sortedMonthlyData.map(item => item.date),
    datasets: [{
      label: 'Monthly Expenses (Average: ' + (sortedMonthlyData.reduce((sum, item) => sum + item.total, 0) / sortedMonthlyData.length || 0).toFixed(2) + ')',
      data: sortedMonthlyData.map(item => item.total),
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      tension: 0.1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Analytics',
      },
    },
  };

  const hasMonthlyData = sortedMonthlyData.length > 0;

  return (
    <div className="container-lg py-5">
      <h3 className="text-center mb-5">Data Visualization</h3>
      
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Category Totals</h4>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {hasMonthlyData && (
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title text-center mb-3">Monthly Expenses</h4>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataChart;
