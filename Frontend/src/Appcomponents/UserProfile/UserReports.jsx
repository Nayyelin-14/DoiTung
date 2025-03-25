import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { markReportAsRead } from "@/EndPoints/user";

const UserReports = () => {
  const location = useLocation();
  const [openCollapsibles, setOpenCollapsibles] = useState({});

  // Get reports from location state with empty array fallback
  const reports = location.state?.reports || [];
  const [updatedReports, setUpdatedReports] = useState(reports);

  const toggleCollapsible = (reportId) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const handleMarkAsRead = async (reportID) => {
    console.log("hello");
    const response = await markReportAsRead(reportID);
    if (response.success) {
      setUpdatedReports(response.reports);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Notifications & Reports</h1>

      {updatedReports.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No reports available</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Return to dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-3 h-[550px]">
          {updatedReports.map((report) => (
            <Collapsible
              key={report.report_id}
              open={openCollapsibles[report.report_id] || false}
              onOpenChange={() => {
                toggleCollapsible(report.report_id);
                handleMarkAsRead(report.report_id);
              }}
              className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    {!report.is_read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                    <h3
                      className={`text-lg ${
                        !report.is_read ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {report.subject}
                    </h3>
                  </div>
                  {openCollapsibles[report.report_id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {report.contents}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Created: {new Date(report.created_at).toLocaleString()}
                    </span>
                    <span>{report.admin_id ? "Admin" : "System"} response</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReports;
