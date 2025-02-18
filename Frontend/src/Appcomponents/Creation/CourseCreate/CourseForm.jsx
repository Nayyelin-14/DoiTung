import React, { useEffect, useState } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import Tiptap from "./Tiptap";
import { getOldCourse } from "@/EndPoints/drafts";
import { useSelector } from "react-redux";

const CourseForm = () => {
  const { user } = useSelector((state) => state.user);
  const [searchparams] = useSearchParams();
  const isEdit = searchparams.get("editID");

  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      course_id: isEdit ? "" : "",
      title: "",
      description: "",
      category: "",
      overview: "",
      thumbnail: null,
      courseDemo: null,
      about_instructor: "",
      instructor_image: null,
      instructor_name: "",
    },
  });
  const isCourseExist = async (isEdit, userId) => {
    if (isEdit) {
      try {
        const response = await getOldCourse(isEdit, userId);

        if (response.isSuccess) {
          form.setValue("course_id", response.course.course_id);
          form.setValue("title", response.course.course_name);
          form.setValue("description", response.course.course_description);
          form.setValue("category", response.course.category);
          form.setValue("overview", response.course.overview);
          form.setValue("instructor_name", response.course.instructor_name);
          form.setValue("about_instructor", response.course.about_instructor);
          form.setValue("instructor_image", response.course.instructor_image);

          // Reset to null, file inputs cannot be prefilled
          form.setValue("thumbnail", null); // Do not set the thumbnail value directly (leave it null)

          // Set the preview URL
          if (response.course.course_image_url) {
            setImagePreview(response.course.course_image_url); // For the preview
            form.setValue("thumbnail", response.course.course_image_url);
          }

          form.setValue("courseDemo", response.course.demo_URL); // You can set the demo URL directly as it's a URL

          if (response.course.demo_URL) {
            setVideoPreview(response.course.demo_URL);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onSubmit = async (values) => {
    const formdata = new FormData();
    console.log(values);
    if (isEdit) {
      formdata.append("course_id", values.course_id);
    }
    formdata.append("title", values.title);
    formdata.append("description", values.description);
    formdata.append("overview", values.overview);
    formdata.append("category", values.category);
    formdata.append("thumbnail", values.thumbnail);
    formdata.append("courseDemo", values.courseDemo);
    formdata.append("instructor_name", values.instructor_name);
    formdata.append("about_instructor", values.about_instructor);
    formdata.append("instructor_image", values.instructor_image);
    setIsloading(true);

    try {
      const response = await CreatNewCourse(formdata);

      if (response.isSuccess) {
        toast.success(response.message);

        let navigateURL;
        if (isEdit) {
          const courseID = response.updateCourse;
          navigateURL = `/admin/course_management/createcourse/${courseID}/createlessons`;
        } else {
          const courseID = response.NewCourse[0].course_id;
          navigateURL = `/admin/course_management/createcourse/${courseID}/createlessons`;
        }
        navigate(navigateURL);
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
  useEffect(() => {
    if (isEdit) {
      isCourseExist(isEdit, user.user_id);
    }
  }, [form]);
  useEffect(() => {
    // Reset previews when the component mounts or if course data is empty
    if (!isEdit || !imagePreview || !videoPreview || !profilePreview) {
      setImagePreview(null);
      setVideoPreview(null);
      setProfilePreview(null);
    }
  }, [isEdit]); // Depend on isEdit or any other state that should reset previews

  return (
    <AdminSide>
      <div className=" my-5 flex flex-col gap-5 w-[60%] md:max-w-5xl  mx-auto ">
        <h1 className="font-semibold text-xl">
          {isEdit ? "Update course" : "Create New Course"}
        </h1>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
              {/* Course Title */}
              {/* /// */}

              {isEdit && (
                <FormField
                  control={form.control}
                  name="course_id"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      {/* Remove wrapping FormControl to ensure no space is taken */}
                      <FormControl>
                        <div className="grid w-full items-center gap-1.5">
                          <Input
                            type="text"
                            id="course_id"
                            {...field}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* // */}
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

            {/* for instructor  */}
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
              <FormField
                control={form.control}
                name="instructor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      Instructor name
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <Input
                          type="text"
                          id="instructor"
                          placeholder="Enter instructor name..."
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
              <FormField
                control={form.control}
                name="instructor_image"
                render={({ field }) => (
                  <>
                    <FormItem className="text-md font-medium">
                      <FormLabel>
                        {!profilePreview && "Instructor profile"}
                      </FormLabel>
                      <FormControl>
                        {!profilePreview ? (
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input
                              id="instructor_image"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files[0];

                                if (file) {
                                  form.setValue(
                                    "instructor_image",
                                    file || null
                                  ); // Manually set the value in the form state
                                  const imgURL = URL.createObjectURL(file);
                                  setProfilePreview(imgURL); // Set image preview URL
                                } else {
                                  form.setValue("instructor_image", null);
                                  setProfilePreview(null); // Clear preview if no file selected
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-bold">Thumbnail Preview:</h3>
                            <div className="w-fit p-1 relative">
                              <img
                                src={profilePreview}
                                alt="Thumbnail Preview"
                                className="w-[50px] max-w-sm mt-2 border rounded-full h-[50px]"
                              />
                              <Trash
                                size={16}
                                className="text-red-900 cursor-pointer hover:text-red-700 absolute right-[-15px] bottom-0"
                                onClick={() => {
                                  setProfilePreview(null); // Clear the image preview
                                  form.setValue("instructor_image", null); // Clear the value in the form state
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
            </div>
            <FormField
              control={form.control}
              name="about_instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    About instructor
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Textarea
                        id="about_instructor"
                        placeholder="Enter about instructor..."
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
            {/* // */}
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
                    <Tiptap
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
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

                                if (file) {
                                  form.setValue("thumbnail", file || null); // Manually set the value in the form state
                                  const imgURL = URL.createObjectURL(file);
                                  setImagePreview(imgURL); // Set image preview URL
                                } else {
                                  form.setValue("thumbnail", null);
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
                                if (file) {
                                  form.setValue("courseDemo", file || null); // Manually set the value in the form state

                                  const videoURL = URL.createObjectURL(file);
                                  setVideoPreview(videoURL); // Set video preview URL
                                } else {
                                  form.setValue("courseDemo", null); // Clear form value
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
