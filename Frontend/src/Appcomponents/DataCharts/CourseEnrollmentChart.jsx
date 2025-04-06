import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
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
import { enrollmentdata } from "@/EndPoints/datacount";

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

const CourseEnrollmentChart = () => {
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await enrollmentdata();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //   setChartData({
  //     labels: data.map((entry) => entry.enrollment_date), // Dates
  //     datasets: [
  //       {
  //         label: "New Enrollments",
  //         data: data.map((entry) => entry.enrollments), // Enrollment counts
  //         borderColor: "#007bff",
  //         backgroundColor: "rgba(0,123,255,0.3)",
  //         tension: 0.4, // Smooth line
  //         fill: true,
  //       },
  //     ],
  //   });
  //   return (
  //     <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
  //       <h2 className="text-lg font-semibold mb-3">Course Enrollment Trends</h2>
  //       {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
  //     </div>
  //   );
};

export default CourseEnrollmentChart;
