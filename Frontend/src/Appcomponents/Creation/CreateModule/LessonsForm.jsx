import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateNewLesson } from "@/EndPoints/courses";
import { cn } from "@/lib/utils";
import { lessonSchema } from "@/types/lessonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LessonsForm = ({
  children,
  moduleID,
  onLessonURLSet,
  onLessonCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [lessonPreview, setLessonPreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      lesson_title: "",
      lesson_content: "",
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("lesson_title", values.lesson_title);
    formData.append("lesson_content", values.lesson_content);
    formData.append("moduleID", moduleID);
    const lessonURL = URL.createObjectURL(values.lesson_content);
    onLessonURLSet(lessonURL);

    try {
      setCreating(true);
      const response = await CreateNewLesson(formData);
      if (response.isSuccess) {
        toast.success(response.message);
        form.reset();
        setLessonPreview(null);
        setOpen(false);
        onLessonCreated();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };
  const onError = (errors) => {
    for (const fields in errors) {
      if (fields === "lesson_content") {
        setLessonPreview(null);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent style={{ height: "420px" }}>
        <DialogTitle>Create lesson</DialogTitle>
        <DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, onError)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="lesson_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduction to ..... "
                        {...field}
                        disabled={creating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lesson_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{!lessonPreview && "Lesson content"}</FormLabel>
                    <FormControl>
                      {!lessonPreview ? (
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            form.setValue("lesson_content", file);
                            if (file) {
                              const videoURL = URL.createObjectURL(file);
                              setLessonPreview(videoURL);
                            }
                          }}
                        />
                      ) : (
                        <div className="relative w-[80%]">
                          <video
                            src={lessonPreview}
                            controls
                            className="w-full max-w-sm mt-2 border rounded h-[200px]"
                          />
                          <Trash
                            size={16}
                            className={cn(
                              `text-red-900 cursor-pointer hover:text-red-700 absolute right-[-15px] bottom-0 ${
                                creating && "cursor-not-allowed  text-red-400"
                              }`
                            )}
                            onClick={() => {
                              setLessonPreview(null);
                              form.setValue("lesson_content", null);
                            }}
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormDescription>
                      Upload a demo video for your course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  creating ? "bg-gray-400" : "bg-primary",
                  "w-full"
                )}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Lesson"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
        <DialogDescription>
          Please provide the details for the new lesson.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default LessonsForm;
