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
import { CreatNewModule } from "@/EndPoints/courses";
import { moduleSchema } from "@/types/ModuleLessons";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ModuleForm = ({ children, courseID, getModules }) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      module_title: "",
    },
  });
  const handleSubmit = async (values) => {
    // Simulate sending data to an API

    const formData = new FormData();
    formData.append("module_title", values.module_title);
    formData.append("courseID", courseID);
    try {
      const response = await CreatNewModule(formData);
      setCreating(true);
      if (response.isSuccess) {
        toast.success(response.message);
        // const Modules = response.allModules; // Simulated module returned from backend
        getModules(courseID);
        form.reset(); // Reset the form
        setCreating(false);
        setOpen(false);
      } else {
        toast.error(response.message);
        setCreating(false);
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
            <DialogTitle>Create Module</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="module_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module title</FormLabel>
                      <FormControl>
                        <Input placeholder="Module 1 - " {...field} />
                      </FormControl>

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
                  {creating ? "Creating...." : "Create Module"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
          <DialogDescription>
            Please provide the details for the new module.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleForm;
