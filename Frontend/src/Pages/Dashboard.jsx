import React, { useEffect, useState } from "react";
import { Box, Boxes, ClockIcon, Users } from "lucide-react";
import AdminSide from "@/Appcomponents/AdminSide/Admin";
import AnalyticCard from "@/Appcomponents/AdminSide/admincomponents/AnalyticCard";
import { dataCount } from "@/EndPoints/datacount";
import { useMediaQuery } from "react-responsive";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";
import CourseEnrollmentChart from "@/Appcomponents/DataCharts/CourseEnrollmentChart";
import CoursesData from "@/Appcomponents/DataCharts/CoursesData";

const Dashboard = () => {
  const [userscount, setUserscount] = useState(0);
  const [coursecount, setCoursecount] = useState(0);
  const [draftcount, setDraftcount] = useState(0);
  const [completecount, setCompletecount] = useState(0);

  const [data, setData] = useState(null);
  const { t } = useTranslation();

  const { Total_courses, Completed_courses, Draft_courses, Total_users } = t(
    "Dashboard",
    {
      returnObjects: true,
    }
  );

  const totalDataCount = async () => {
    try {
      const response = await dataCount();
      console.log(response);
      if (response.isSuccess) {
        setUserscount(response.usersCount);
        setCoursecount(response.courseCount);
        setDraftcount(response.draftCount);
        setCompletecount(response.completeCount);
        setData(response.dailyCounts);
      }
    } catch (error) {}
  };
  useEffect(() => {
    totalDataCount();
  }, []);

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const updateslider = (index) => {
    api?.scrollTo(index);
  };
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView()[0]);
    });
  }, [api]);
  const totalCard = 4;

  return (
    <AdminSide>
      <div>
        {isSmallScreen ? (
          <div className="p-4">
            <Carousel setApi={setApi}>
              <CarouselContent>
                <CarouselItem>
                  <AnalyticCard
                    onClick={() => updateslider(0)}
                    title={Total_courses}
                    count={Number(coursecount)}
                    icon={<Box size={26} />}
                    href="/admin/course_management"
                  />
                </CarouselItem>
                <CarouselItem>
                  <AnalyticCard
                    title={Completed_courses}
                    count={Number(completecount)}
                    icon={<Boxes size={26} />}
                    href="/admin/course_management"
                    onClick={() => updateslider(1)}
                  />
                </CarouselItem>
                <CarouselItem>
                  <AnalyticCard
                    title={Draft_courses}
                    count={Number(draftcount)}
                    icon={<ClockIcon size={26} />}
                    onClick={() => updateslider(2)}
                    href="/admin/course_management"
                  />
                </CarouselItem>
                <CarouselItem>
                  <AnalyticCard
                    title={Total_users}
                    count={Number(userscount)}
                    icon={<Users size={26} />}
                    href="/admin/users_management"
                    onClick={() => updateslider(3)}
                  />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
            <AnalyticCard
              title={Total_courses}
              count={Number(coursecount)}
              icon={<Box size={26} />}
              href="/admin/course_management"
            />
            <AnalyticCard
              title={Completed_courses}
              count={Number(completecount)}
              icon={<Boxes size={26} />}
              href="/admin/course_management"
            />
            <AnalyticCard
              title={Draft_courses}
              count={Number(draftcount)}
              icon={<ClockIcon size={26} />}
              href="/admin/course_management"
            />
            <AnalyticCard
              title={Total_users}
              count={Number(userscount)}
              icon={<Users size={26} />}
              href="/admin/users_management"
            />
          </div>
        )}
        {isSmallScreen && (
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: totalCard }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeIndex === index ? "bg-black" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full xl:w-[96%] flex flex-col xl:flex-row my-5 px-4 gap-5 xl:gap-12  justify-between items-start">
        <div className="w-full xl:w-2/3">
          <CourseEnrollmentChart data={data} />
        </div>
        <div className="w-full xl:w-1/3">
          <CoursesData
            courseCount={coursecount}
            draftCount={draftcount}
            completeCount={completecount}
          />
        </div>
      </div>
    </AdminSide>
  );
};

export default Dashboard;
