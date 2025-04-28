import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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

const CourseEnrollmentChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data) return;

    // Convert { "2025-04-06": 2, "2025-04-16": 1 }
    // → [{ date: "2025-04-06", enrollments: 2 }, ...]
    const formatted = Object.entries(data).map(([date, enrollments]) => ({
      date,
      enrollments: Number(enrollments),
    }));

    const enrollmentValues = formatted.map((entry) =>
      Math.round(entry.enrollments)
    );
    const maxY = Math.max(...enrollmentValues);
    const suggestedStep = Math.ceil(maxY / 5); // Show around 5 steps max

    setChartData({
      labels: formatted.map((entry) => entry.date),
      datasets: [
        {
          label: "Enrollments",
          data: enrollmentValues,
          borderColor: "black",
          backgroundColor: "black",
          tension: 0.4,
        },
      ],
      yAxisStep: suggestedStep,
    });
  }, [data]);

  return (
    <div className="w-full h-[400px] p-4 bg-white shadow-md rounded-lg  border border-gray-300/60">
      <h2 className="text-lg font-semibold mb-3">Course Enrollment Trends</h2>
      {chartData && (
        <Line
          className="p-10"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 800,
              easing: "easeOutQuart",
            },
            plugins: {
              tooltip: {
                enabled: true,
                backgroundColor: "#1F2937",
                titleColor: "#F9FAFB",
                bodyColor: "#F9FAFB",
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                  weight: "bold",
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
                callbacks: {
                  title: (context) => `📅 ${context[0].label}`,
                  label: (context) => `Enrollments: ${context.raw}`,
                },
              },
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "black",
                  font: {
                    size: 14,
                    weight: "600",
                  },
                  usePointStyle: true,
                  pointStyle: "circle",
                  padding: 16,
                },
              },
              title: {
                display: false,
              },
            },
            layout: {
              padding: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 10,
              },
            },
            scales: {
              x: {
                grid: {
                  color: "gray",
                },
                ticks: {
                  color: "black",
                  font: {
                    size: 16,
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: "black",
                  stepSize: chartData?.yAxisStep || 1,
                  precision: 0,
                  font: {
                    size: 15,
                  },
                  callback: (value) => (Number.isInteger(value) ? value : null),
                },
                grid: {
                  color: "gray",
                  borderDash: [4, 4],
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default CourseEnrollmentChart;
