import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateQuiz } from "@/EndPoints/quiz";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const QuizForm = ({
  children,
  moduleID,
  setQuestForm,
  setQuiz,
  onQuizCreated,
  setLessonURL,
}) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("moduleID", moduleID);

    try {
      setCreating(true);
      const response = await CreateQuiz(formData);
      const lastQuiz = response.quizzes.at(-1);

      if (response.success) {
        toast.success(response.message);
        reset();
        setQuiz(lastQuiz);
        onQuizCreated();
        setLessonURL(null);
        setQuestForm((prev) => !prev);
        setOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent style={{ height: "280px" }}>
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <label className="block text-sm font-medium mt-5 mb-2">
                  Quiz Title
                </label>
                <Input
                  placeholder="Quiz"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className={cn(
                  creating ? "bg-gray-400" : "bg-primary",
                  "w-full"
                )}
                disabled={creating}
              >
                {creating ? "Creating...." : "Create Quiz"}
              </Button>
            </form>
          </DialogHeader>
          <DialogDescription>
            Please provide the details for the new Quiz.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizForm;
