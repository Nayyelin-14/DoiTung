import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Check, Plus } from "lucide-react";
import { DeleteQuestion, EditQuestion, GetQuestions } from "@/EndPoints/quiz";
import { toast } from "sonner";

export default function QuestionPreview({ Quiz, setPreview, setQuestForm }) {
  const [editing, setEditing] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({});
  const [questions, setQuestions] = useState([]);

  const ID = Quiz?.quiz_id || Quiz?.test_id;
  console.log(ID);

  const handleEditClick = (question) => {
    setEditing(question.question_id);
    setEditedQuestion({ ...question, options: JSON.parse(question.options) });
  };

  const addOption = () => {
    setEditedQuestion({
      ...editedQuestion,
      options: [...editedQuestion.options, ""],
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleConfirmEdit = () => {
    onEdit(editedQuestion); // Pass `editedQuestion` correctly
    setEditing(null);
  };

  const onEdit = async (editedQuestion) => {
    const payload = {
      ...editedQuestion,
      options: JSON.stringify(editedQuestion.options), // Convert array to string
    };

    console.log("Sending Edited Question:", payload); // Debugging

    try {
      const response = await EditQuestion(payload);
      if (response.success) {
        toast.success("Question Edited");
        fetchQuestions();
      } else {
        toast.error(response.message || "Failed to edit question");
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error(
        error.message || "An error occurred while editing the question"
      );
    }
  };

  const onDelete = async (questionID) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (confirmDelete) {
      try {
        const response = await DeleteQuestion(questionID);
        if (response.success) {
          toast.success("Question Deleted successfully!");
          fetchQuestions();
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const fetchQuestions = async () => {
    const response = await GetQuestions(ID);
    if (response.success) {
      if (response.quizQuestions.length > 0) {
        setQuestions(response.quizQuestions);
      } else {
        setQuestions(response.testQuestions);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [Quiz]);

  return (
    <div className="w-[90%] lg:w-[60%] mx-auto p-4 bg-white space-y-4">
      <h1 className="text-xl">
        Title: <span className="font-bold">{Quiz.title}</span>
      </h1>
      {questions.map((question) => (
        <Card key={question.question_id} className="p-4 relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleEditClick(question)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(question.question_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent>
            {editing === question.question_id ? (
              <div className="space-y-2">
                <p className="font-medium">Question: </p>
                <input
                  type="text"
                  value={editedQuestion.question_text}
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="border rounded w-full p-2"
                />
                <p className="font-medium mb-2">Options:</p>
                {editedQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="border rounded w-full p-2"
                  />
                ))}
                <Button
                  onClick={addOption}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Option
                </Button>
                <p className="font-medium">Correct Answer:</p>
                <input
                  type="text"
                  value={editedQuestion.correctOption}
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      correctOption: e.target.value,
                    })
                  }
                  className="border rounded w-full p-2"
                />
                <Button onClick={handleConfirmEdit} variant="success">
                  <Check className="w-4 h-4 mr-2" /> Confirm Edit
                </Button>
              </div>
            ) : (
              <div>
                <p className="font-bold">{question.question_text}</p>
                <p className="text-gray-500">
                  Options: {JSON.parse(question.options).join(", ")}
                </p>
                <p className="text-gray-500">
                  Correct Answer: {question.correctOption}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <div className="sticky bottom-0 pb-8 bg-white">
        <Button
          onClick={() => {
            setPreview((prev) => !prev);
            setQuestForm((prev) => !prev);
          }}
          className="w-full bg-customGreen text-white mt-2"
        >
          Add New Question
        </Button>
        <Button
          onClick={() => {
            setPreview((prev) => !prev);
          }}
          className="w-full bg-gray-950 text-white mt-2"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
