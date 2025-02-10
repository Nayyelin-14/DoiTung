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
import { CreateTest } from "@/EndPoints/quiz";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TestForm = ({
  children,
  courseID,
  setQuestForm,
  setQuiz,
  onTestCreated,
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
      timeLimit: "",
    },
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("courseID", courseID);
    formData.append("timeLimit", values.timeLimit);

    try {
      setCreating(true);
      const response = await CreateTest(formData);
      const Test = response.test[0];
      console.log(Test);
      if (response.success) {
        toast.success(response.message);
        reset();
        setQuiz(Test);
        onTestCreated();
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
        <DialogContent style={{ height: "400px" }}>
          <DialogHeader>
            <DialogTitle>Create Final Test</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <label className="block text-sm font-medium mt-5 mb-2">
                  Test Title
                </label>
                <Input
                  placeholder="Test title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time Limit
                </label>
                <Input
                  placeholder="Time Limit in (minutes)"
                  {...register("timeLimit", {
                    required: "Test Duration is required",
                  })}
                />
                {errors.timeLimit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.timeLimit.message}
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
                {creating ? "Creating...." : "Create Test"}
              </Button>
            </form>
          </DialogHeader>
          <DialogDescription>
            Please provide the details for the Final Test.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestForm;
