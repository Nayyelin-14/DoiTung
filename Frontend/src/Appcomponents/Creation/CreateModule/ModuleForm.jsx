import React from "react";
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

const ModuleForm = ({ children, courseID, createModule }) => {
  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      module_title: "",
    },
  });
  const handleSubmit = async (values) => {
    // Simulate sending data to an API
    console.log(values);
    const formData = new FormData();
    formData.append("module_title", values.module_title);
    formData.append("courseID", courseID);
    const response = await CreatNewModule(formData);

    if (response.isSuccess) {
      //       const newModule = await response.json(); // Simulated module returned from backend
      //       createModule(newModule); // Pass the new module back to the parent
      //       form.reset(); // Reset the form
      console.log(response);
    } else {
      console.error("Failed to create module");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
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
                      <FormDescription>
                        Fill the module in order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create Module
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleForm;
