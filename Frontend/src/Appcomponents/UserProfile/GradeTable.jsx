import { useState, useEffect } from "react";
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
    <TableContainer component={Paper} className="w-5/6 mx-auto mt-6 shadow-lg rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-700 text-xl">
            <TableCell></TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Course Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Enrolled At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((course) => (
            <>
              <TableRow key={course.courseId} className="border-b">
                <TableCell>
                  <IconButton onClick={() => toggleRow(course.courseId)}>
                    {openRows[course.courseId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell className="font-semibold">{course.courseName}</TableCell>
                <TableCell className="text-gray-700">
                  {new Date(course.enrolled_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="p-0">
                  <Collapse in={openRows[course.courseId]} timeout="auto" unmountOnExit>
                    <Box className="p-4 bg-gray-50">
                      <h3 className="text-lg font-bold mb-2">Quiz Scores</h3>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Quiz Title</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Attempts</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {course.quizAttempts.length > 0 ? (
                            course.quizAttempts.map((quiz) => (
                              <TableRow key={quiz.quizTitle}>
                                <TableCell>{quiz.quizTitle}</TableCell>
                                <TableCell>{quiz.score}</TableCell>
                                <TableCell>{quiz.attemptNumber}</TableCell>
                                <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500">No quiz attempts</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <h3 className="text-lg font-bold mt-4 mb-2">Test Scores</h3>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Test Title</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Attempts</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {course.testAttempts.length > 0 ? (
                            course.testAttempts.map((test) => (
                              <TableRow key={test.testTitle}>
                                <TableCell>{test.testTitle}</TableCell>
                                <TableCell>{test.score}</TableCell>
                                <TableCell>{test.attemptNumber}</TableCell>
                                <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500">No test attempts</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GradeTable;

