import { GetReports } from "@/EndPoints/user";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReportAlert = () => {
  const [reports, setReports] = useState([]);
  const unreadCount = reports.filter((report) => !report.is_read).length;

  const fetchReports = async () => {
    try {
      const response = await GetReports();
      if (response.success) {
        setReports(response.reports);
      }
    } catch (error) {
      toast.error("Error fetching reports");
    }
  };
  useEffect(() => {
    const checkWidget = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        clearInterval(checkWidget);
      }
    }, 500);

    // Initial fetch
    fetchReports();

    return () => clearInterval(checkWidget);
  }, [location.pathname]); // This will refetch when the route changes
  return (
    <Link
      to="/user/reports"
      state={{ reports }} // Pass data via state
      aria-label="View Reports"
    >
      <div className="relative">
        <Bell className="w-5 h-5 text-gray-600" /> {/* Changed from w-6/h-6 */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ReportAlert;
