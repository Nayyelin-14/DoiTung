import React, { useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/types/CourseSchema";
import { Trash } from "lucide-react";
import { CreatNewCourse } from "@/EndPoints/courses";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Tiptap from "./Tiptap";

const CourseForm = () => {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      overview: "",
      thumbnail: null,
      courseDemo: null,
    },
  });

  const onSubmit = async (values) => {
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("description", values.description);
    formdata.append("overview", values.overview);
    formdata.append("category", values.category);
    formdata.append("thumbnail", values.thumbnail);
    formdata.append("courseDemo", values.courseDemo);

    setIsloading(true);
    try {
      const response = await CreatNewCourse(formdata);

      if (response.isSuccess) {
        toast.success(response.message);

        const courseID = response.NewCourse[0].course_id;

        navigate(
          `/admin/course_management/createcourse/${courseID}/createlessons`
        );
        form.reset();

        setIsloading(false);
      } else {
        toast.error(response.message);
        setIsloading(false);
      }
    } catch (error) {
      toast.error(error.message);
      form.reset();
    } finally {
      setIsloading(false);
    }
  };

  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <AdminSide>
      <div className=" my-5 flex flex-col gap-5 w-[60%] md:max-w-5xl mx-auto ">
        <h1 className="font-semibold text-xl">Create New Course</h1>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
              {/* Course Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      Course Title
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <Input
                          type="text"
                          id="title"
                          placeholder="Enter course title..."
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      Category
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full  items-center gap-1.5">
                        <Input
                          type="text"
                          id="category"
                          placeholder="Enter category..."
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a category for the course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Description */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Textarea
                        id="description"
                        placeholder="Enter course description..."
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be publicly displayed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* what u will learn */}
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    What they will be learning
                  </FormLabel>
                  <FormControl>
                    {/* field ka formcontrol loke htr dk state , properties twy ko control tr  */}
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormDescription>
                    Provide a overview for the course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  */}

            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2">
              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <>
                    <FormItem className="text-md font-medium">
                      <FormLabel>{!imagePreview && "Thumbnail"}</FormLabel>
                      <FormControl>
                        {!imagePreview ? (
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input
                              id="thumbnail"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                form.setValue("thumbnail", file || null); // Manually set the value in the form state
                                if (file) {
                                  const imgURL = URL.createObjectURL(file);
                                  setImagePreview(imgURL); // Set image preview URL
                                } else {
                                  setImagePreview(null); // Clear preview if no file selected
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-bold">Thumbnail Preview:</h3>
                            <div className="w-fit p-1 relative">
                              <img
                                src={imagePreview}
                                alt="Thumbnail Preview"
                                className="w-[50px] max-w-sm mt-2 border rounded-full h-[50px]"
                              />
                              <Trash
                                size={16}
                                className="text-red-900 cursor-pointer hover:text-red-700 absolute right-[-15px] bottom-0"
                                onClick={() => {
                                  setImagePreview(null); // Clear the image preview
                                  form.setValue("thumbnail", null); // Clear the value in the form state
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <FormDescription>
                        This will be your course thumbnail.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />

              {/* {/* Course Demo */}
              <FormField
                control={form.control}
                name="courseDemo"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel className="text-md font-medium">
                        {!videoPreview && "Course Demo"}
                      </FormLabel>
                      <FormControl>
                        {!videoPreview ? (
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input
                              id="courseDemo"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                form.setValue("courseDemo", file || null); // Manually set the value in the form state
                                if (file) {
                                  const videoURL = URL.createObjectURL(file);
                                  setVideoPreview(videoURL); // Set video preview URL
                                } else {
                                  setVideoPreview(null); // Clear preview if no file selected
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-bold">Demo Preview:</h3>
                            <div className="relative w-[80%]">
                              <video
                                src={videoPreview}
                                controls
                                className="w-full max-w-sm mt-2 border rounded h-[200px]"
                              />
                              <Trash
                                size={16}
                                className="text-red-900 cursor-pointer hover:text-red-700 absolute bottom-1 right-[-20px] font-bold" // Position the trash icon at the top-right corner
                                onClick={() => {
                                  setVideoPreview(null); // Clear the video preview
                                  form.setValue("courseDemo", null); // Clear the value in the form state for the course demo
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <FormDescription>
                        Upload a demo video for your course.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(isloading ? "bg-gray-400" : "bg-primary", "w-full")}
              disabled={isloading}
            >
              {isloading ? "Creating..." : "Next"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminSide>
  );
};

export default CourseForm;
