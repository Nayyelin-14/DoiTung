import { useState, useEffect } from "react";
import React from 'react';
import { Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { GetUserScores } from "@/EndPoints/quiz";

const GradeTable = ({ userId }) => {
  const [scores, setScores] = useState([]);
  const [openRows, setOpenRows] = useState({});

  const fetchUserScores = async () => {
    const response = await GetUserScores(userId);
    console.log("API Response:", response); // Log to check if it's an array
    setScores(response);
  };

  useEffect(() => {
    fetchUserScores();
  }, []);

  const toggleRow = (courseId) => {
    setOpenRows((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  return (
    <>
    <div>
      <h1 className="text-xl font-semibold">Grade Reports</h1>
    </div>
    <TableContainer component={Paper} className="w-5/6 mx-auto mt-6 shadow-lg rounded-lg">
  <Table>
    <TableHead>
      <TableRow className="bg-gray-700">
        <TableCell sx={{ width: '10%' }}></TableCell> {/* Empty cell for the expand/collapse button */}
        <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '45%', textAlign: 'center', }}>Course Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '45%', textAlign: 'center' }}>Enrolled At</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {scores.map((course) => (
        <React.Fragment key={course.courseId}>
          {/* Parent Row */}
          <TableRow className="border-b">
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              <IconButton onClick={() => toggleRow(course.courseId)} size="small">
                {openRows[course.courseId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </TableCell>
            <TableCell sx={{ width: '45%', fontWeight: 'semibold', textAlign: 'center' }}>{course.courseName}</TableCell>
            <TableCell sx={{ width: '45%', color: 'text.secondary', textAlign: 'center' }}>
              {new Date(course.enrolled_at).toLocaleDateString()}
            </TableCell>
          </TableRow>

          {/* Expandable Row */}
          <TableRow>
            <TableCell colSpan={3} sx={{ padding: 0 }}>
              <Collapse in={openRows[course.courseId]} timeout="auto" unmountOnExit>
                <Box sx={{ padding: 2, backgroundColor: 'background.paper' }}>
                  {/* Quiz Scores Table */}
                  <h3 className="text-base font-bold my-2 mx-auto w-[80%]">Quiz Scores</h3>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="bg-gray-700">
                        <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Quiz Title</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center', color: 'white' }}>Attempts</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center', color: 'white' }}>Score</TableCell>
                        {/* <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Date</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.quizAttempts.length > 0 ? (
                        course.quizAttempts.map((quiz) => (
                          <TableRow key={quiz.quizTitle}>
                            <TableCell sx={{ textAlign: 'center' }}>{quiz.quizTitle}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{quiz.attemptNumber}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{quiz.score}</TableCell>
                            {/* <TableCell sx={{ textAlign: 'center' }}>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell> */}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            No quiz attempts
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Test Scores Table */}
                  <h3 className="text-base font-bold mb-2 mt-4 mx-auto w-[80%]">Test Scores</h3>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="bg-gray-700">
                        <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Test Title</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center', color: 'white' }}>Attempts</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center', color: 'white' }}>Score</TableCell>
                        {/* <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Date</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.testAttempts.length > 0 ? (
                        course.testAttempts.map((test) => (
                          <TableRow key={test.testTitle}>
                            <TableCell sx={{ textAlign: 'center' }}>{test.testTitle}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{test.attemptNumber}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{test.score}</TableCell>
                            {/* <TableCell sx={{ textAlign: 'center' }}>{new Date(test.createdAt).toLocaleDateString()}</TableCell> */}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            No test attempts
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</>
  );
};

export default GradeTable;
