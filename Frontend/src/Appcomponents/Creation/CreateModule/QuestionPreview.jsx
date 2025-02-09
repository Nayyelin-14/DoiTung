import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Check, Plus } from "lucide-react";
import { GetQuestions } from "@/EndPoints/courses";
import { toast } from "sonner";

export default function QuestionPreview({ Quiz, setPreview }) {
  const [editing, setEditing] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({});
  const [questions, setQuestions] = useState([]);
  const ID = Quiz.quiz_id;
  console.log(ID);

  const handleEditClick = (question) => {
    setEditing(question.question_id);
    setEditedQuestion({ ...question, options: JSON.parse(question.options) });
  };

  const addOption = () => {
    setEditedQuestion({ ...editedQuestion, options: [...editedQuestion.options, ""] });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleConfirmEdit = () => {
    onEdit(editedQuestion);
    setEditing(null);
  };
  
  const onEdit = () => {

  }

  const onDelete = () => {

  }

  const fetchQuestions = async() => {
    const response = await GetQuestions(ID);
    if(response.success){
        setQuestions(response.quizQuestions);
    }
  }

  useEffect(()=>{
    fetchQuestions();
  }, []);

  return (
    <div className="w-[90%] lg:w-[60%] space-y-4">
        <h1 className="text-xl">Title: <span className="font-bold">{Quiz.title}</span></h1>
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
                <input
                  type="text"
                  value={editedQuestion.question_text}
                  onChange={(e) =>
                    setEditedQuestion({ ...editedQuestion, question_text: e.target.value })
                  }
                  className="border rounded w-full p-2"
                />
                {editedQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="border rounded w-full p-2"
                  />
                ))}
                <Button onClick={addOption} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Option
                </Button>
                <p className="font-bold">Correct Answer:</p>
                <input
                  type="text"
                  value={editedQuestion.correctOption}
                  onChange={(e) =>
                    setEditedQuestion({ ...editedQuestion, correctOption: e.target.value })
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
                <p className="text-gray-500">Options: {JSON.parse(question.options).join(", ")}</p>
                <p className="text-gray-500">Correct Answer: {question.correctOption}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Button onClick={()=>{setPreview(prev => !prev)}} className="w-full bg-gray-600 text-white mt-2">Done</Button>
    </div>
  );
}
