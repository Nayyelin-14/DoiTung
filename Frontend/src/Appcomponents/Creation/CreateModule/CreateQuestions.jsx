import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateQuestion } from '@/EndPoints/courses';
import { toast } from "sonner";
import { Plus } from "lucide-react";

const CreateQuestions = ({ Quiz, setQuestForm, setPreview }) => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctOption, setCorrectOption] = useState("");
    const [questionNum, setQuestionNum] = useState(1);
  
    const addOption = () => {
      setOptions([...options, ""]);
    };
  
    const handleOptionChange = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };
  
    const handleSubmit = async () => {
        const quizID = Quiz.quiz_id;
      const payload = {
        quizID,
        question_text: questionText,
        options: JSON.stringify(options),
        correctOption,
      };
      console.log("Submitting: ", payload);
      // You can replace this with an API call
      const response = await CreateQuestion(payload);
      if (response.success) {
        toast.success("New Question Added!");
        setQuestionText("");
        setOptions(["", ""]);
        setCorrectOption("");
        setQuestionNum(questionNum + 1);
      } else {
        toast.error(response.message);
      }
    };
  
    return (
      <div className="w-[90%] lg:w-[60%] mx-auto p-4 bg-white">
        {console.log(Quiz)}
        <h1 className="text-xl mb-4">Title: <span className='font-bold'>{Quiz.title}</span></h1>
        {/* <h2 className="text-xl font-semibold mb-4">{Quiz.quiz_id}</h2> */}
        <p>Question - {questionNum}</p>
        <Input
          type="text"
          placeholder="Enter question text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mb-3"
        />
        {console.log("questionText:", questionText)}
        <div>
          <p className="font-medium mb-2">Options:</p>
          {options.map((option, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mb-2"
            />
          ))}
          <Button onClick={addOption} variant="outline" className="w-full mt-2">
          <Plus className="w-4 h-4 mr-2" /> Add Option
          </Button>
        </div>
        <p className="font-medium mt-4">Correct Answer:</p>
        <Input
          type="text"
          placeholder="Enter correct answer"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          className="mb-3"
        />
        <Button onClick={handleSubmit} className="w-full bg-green-500 text-white mt-2">
          Add Question
        </Button>
        <Button onClick={()=>{
        setPreview(prev => !prev);
        setQuestForm(prev => !prev);
      }} className="w-full bg-gray-600 text-white mt-2">Preview</Button>
        <Button onClick={()=>{setQuestForm(prev => !prev)}} className="w-full bg-gray-600 text-white mt-2">Done</Button>
      </div>
    );
}

export default CreateQuestions