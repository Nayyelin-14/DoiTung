import React from "react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);
const CoursesData = ({ courseCount, draftCount, completeCount }) => {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const total = (completeCount || 0) + (courseCount || 0) + (draftCount || 0);

    if (total === 0) {
      setChartData({
        labels: ["No Data"],
        datasets: [
          {
            label: "Count",
            data: [1],
            backgroundColor: ["#e0e0e0"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData({
        labels: ["Completed", "Total", "Drafts"],
        datasets: [
          {
            label: "Count",
            data: [completeCount || 0, courseCount || 0, draftCount || 0],
            backgroundColor: ["green", "blue", "yellow"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [courseCount, draftCount, completeCount]);

  return (
    <div className="w-full h-[400px] p-4 bg-white border border-gray-300/60 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Course Status Overview</h2>
      <div className="relative w-full h-[300px] ">
        {chartData && (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesData;
