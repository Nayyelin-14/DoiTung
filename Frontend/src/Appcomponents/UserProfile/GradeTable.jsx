import { useState, useEffect } from "react";
import React from "react";
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
import { useTranslation } from "react-i18next";

const GradeTable = ({ userId }) => {
  const [scores, setScores] = useState([]);
  const [openRows, setOpenRows] = useState({});

  const fetchUserScores = async () => {
    const response = await GetUserScores(userId);

    setScores(response);
  };

  useEffect(() => {
    fetchUserScores();
  }, []);

  const toggleRow = (courseId) => {
    setOpenRows((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const { t } = useTranslation();

  const {
    grade_reports,
    course_name,
    enrolled_at,
    quiz_title,
    quiz_scores,
    Attempts,
    Score,
    test_title,
    test_scores,
    no_quiz,
    no_test,
  } = t("grade", { returnObjects: true });
  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">{grade_reports}</h1>
      </div>
      <TableContainer
        component={Paper}
        className="w-5/6 mx-auto mt-6 shadow-lg rounded-lg"
      >
        <Table>
          <TableHead>
            <TableRow className="bg-gray-700">
              <TableCell sx={{ width: "10%" }}></TableCell>

              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  width: "45%",
                  textAlign: "center",
                }}
              >
                {course_name}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  width: "45%",
                  textAlign: "center",
                }}
              >
                {enrolled_at}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((course) => (
              <React.Fragment key={course.courseId}>
                {/* Parent Row */}
                <TableRow className="border-b">
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>
                    <IconButton
                      onClick={() => toggleRow(course.courseId)}
                      size="small"
                    >
                      {openRows[course.courseId] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "45%",
                      fontWeight: "semibold",
                      textAlign: "center",
                    }}
                  >
                    {course.courseName}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "45%",
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    {new Date(course.enrolled_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>

                {/* Expandable Row */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ padding: 0 }}>
                    <Collapse
                      in={openRows[course.courseId]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        sx={{ padding: 2, backgroundColor: "background.paper" }}
                      >
                        {/* Quiz Scores Table */}
                        <h3 className="text-base font-bold my-2 mx-auto w-[80%]">
                          {quiz_scores}
                        </h3>
                        <Table size="small">
                          <TableHead>
                            <TableRow className="bg-customGreen">
                              <TableCell
                                sx={{
                                  width: "30%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {quiz_title}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "20%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {Attempts}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "20%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {Score}
                              </TableCell>
                              {/* <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Date</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {course.quizAttempts.length > 0 ? (
                              course.quizAttempts.map((quiz) => (
                                <TableRow key={quiz.quizTitle}>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {quiz.quizTitle}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {quiz.attemptNumber}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {quiz.score}
                                  </TableCell>
                                  {/* <TableCell sx={{ textAlign: 'center' }}>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell> */}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  sx={{
                                    textAlign: "center",
                                    color: "text.secondary",
                                  }}
                                >
                                  {no_quiz}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>

                        {/* Test Scores Table */}
                        <h3 className="text-base font-bold mb-2 mt-4 mx-auto w-[80%]">
                          {test_scores}
                        </h3>
                        <Table size="small">
                          <TableHead>
                            <TableRow className="bg-customGreen">
                              <TableCell
                                sx={{
                                  width: "30%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {test_title}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "20%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {Attempts}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "20%",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {Score}
                              </TableCell>
                              {/* <TableCell sx={{ width: '30%', textAlign: 'center', color: 'white' }}>Date</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {course.testAttempts.length > 0 ? (
                              course.testAttempts.map((test) => (
                                <TableRow key={test.testTitle}>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {test.testTitle}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {test.attemptNumber}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {test.score}
                                  </TableCell>
                                  {/* <TableCell sx={{ textAlign: 'center' }}>{new Date(test.createdAt).toLocaleDateString()}</TableCell> */}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  sx={{
                                    textAlign: "center",
                                    color: "text.secondary",
                                  }}
                                >
                                  {no_test}
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
