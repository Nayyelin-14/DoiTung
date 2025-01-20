// <<<<<<< HEAD
import React from "react";
// import { Space, Table, Tag } from 'antd';
// =======

// >>>>>>> cfba196015629d195e242033920a73c83b337191

const GradeTable = () => {
  const courses = [
    {
      id: 1,
      title: "React Basics",
      quizScore: 85,
      testScore: 70,
      progress: 80,
    },
    {
      id: 2,
      title: "Advanced React",
      quizScore: 90,
      testScore: 95,
      progress: 100,
    },
    {
      id: 3,
      title: "Tailwind CSS",
      quizScore: 60,
      testScore: 50,
      progress: 45,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <div className="text-center text-[20px] mb-8 font-semibold">
          Grade Reports
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-pale text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">Course ID</th>
              <th className="py-3 px-6 text-left">Course Title</th>
              <th className="py-3 px-6 text-center">Quizz (Score)</th>
              <th className="py-3 px-6 text-center">Test (Score)</th>
              <th className="py-3 px-6 text-center">Progress (%)</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t hover:bg-gray-100">
                <td className="py-3 px-6">{course.id}</td>
                <td className="py-3 px-6">{course.title}</td>
                <td className="py-3 px-6 text-center">{course.quizScore}</td>
                <td className="py-3 px-6 text-center">{course.testScore}</td>
                <td className="py-3 px-6 text-center">{course.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTable;
