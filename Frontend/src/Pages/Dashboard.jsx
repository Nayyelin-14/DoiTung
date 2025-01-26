import React, { useEffect, useState } from "react";
import { Box, Boxes, ClockIcon, Users } from "lucide-react";
import AdminSide from "@/Appcomponents/AdminSide/Admin";
import AnalyticCard from "@/Appcomponents/AdminSide/admincomponents/AnalyticCard";
import { dataCount } from "@/EndPoints/datacount";

const Dashboard = () => {
  const [userscount, setUserscount] = useState(0);
  const [coursecount, setCoursecount] = useState(0);
  const [draftcount, setDraftcount] = useState(0);
  const [completecount, setCompletecount] = useState(0);
  const totalDataCount = async () => {
    try {
      const response = await dataCount();
      if (response.isSuccess) {
        setUserscount(response.usersCount);
        setCoursecount(response.courseCount);
        setDraftcount(response.draftCount);
        setCompletecount(response.completeCount);
      }
    } catch (error) {}
  };
  useEffect(() => {
    totalDataCount();
  }, []);
  return (
    <AdminSide>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
          <AnalyticCard
            title={"Total Courses"}
            count={Number(coursecount)}
            icon={<Box size={26} />}
            href="/admin/course_management"
          />
          <AnalyticCard
            title={"Completed courses"}
            count={Number(completecount)}
            icon={<Boxes size={26} />}
            href="/admin/course_management"
          />
          <AnalyticCard
            title={"Draft courses"}
            count={Number(draftcount)}
            icon={<ClockIcon size={26} />}
            href="/admin/course_management"
          />
          <AnalyticCard
            title={"Total Users"}
            count={Number(userscount)}
            icon={<Users size={26} />}
            href="/admin/users_management"
          />
        </div>
      </div>
    </AdminSide>
  );
};

export default Dashboard;
