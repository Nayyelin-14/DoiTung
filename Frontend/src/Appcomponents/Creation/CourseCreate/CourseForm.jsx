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
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCourseForm } from "@/hooks/useCreateCourse";

const CourseForm = () => {
  const {
    form,
    isPending,
    isEdit,
    imagePreview,
    setImagePreview,
    videoPreview,
    setVideoPreview,
    profilePreview,
    setProfilePreview,
    onSubmit,
    onError,
  } = useCourseForm();
  const { t } = useTranslation();

  const {
    create_new_course,
    course_title,
    Enter_course_title,
    Category,
    Enter_Category,
    This_is_your_public_display_name,
    Provide,
    Description,
    Enter_description,
    This,
    Instructor_name,
    instructor,
    Instructor_profile,
    thumbnail,
    About_instructor,
    Enter_about_instructor,
    learning,
    overview,
    Thumbnail,
    course_thumbnail,
    Course_Demo,
    upload,
    Next,
    create,
  } = t("Form", { returnObjects: true });

  return (
    <AdminSide>
      <div className=" my-5 flex flex-col gap-5 w-[60%] md:max-w-5xl  mx-auto ">
        <h1 className="font-semibold text-xl">
          {isEdit ? "Update course" : create_new_course}
        </h1>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit, onError)}
          >
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
                      {course_title}
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <Input
                          type="text"
                          id="title"
                          placeholder={Enter_course_title}
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {This_is_your_public_display_name}
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
                      {Category}
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full  items-center gap-1.5">
                        <Input
                          type="text"
                          id="category"
                          placeholder={Enter_Category}
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>{Provide}</FormDescription>
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
                    {Description}
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Textarea
                        id="description"
                        placeholder={Enter_description}
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>{This}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 items-center">
              <FormField
                control={form.control}
                name="instructor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      {Instructor_name}
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <Input
                          type="text"
                          id="instructor"
                          placeholder={instructor}
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>{This}</FormDescription>
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
                        {!profilePreview && Instructor_profile}
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
                            <p className="text-md">Instructor profile:</p>
                            <div className="w-fit p-1 relative">
                              <img
                                src={profilePreview}
                                alt="Instructure image"
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
                      <FormDescription>{This}</FormDescription>
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
                    {About_instructor}
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Textarea
                        id="about_instructor"
                        placeholder={Enter_about_instructor}
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>{This}</FormDescription>
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
                    {learning}
                  </FormLabel>
                  <FormControl>
                    {/* field ka formcontrol loke htr dk state , properties twy ko control tr  */}
                    <Tiptap
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>{overview}</FormDescription>
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
                      <FormLabel>{!imagePreview && Thumbnail}</FormLabel>
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
                      <FormDescription>{This}</FormDescription>
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
                        {!videoPreview && Course_Demo}
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
                      <FormDescription>{upload}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(isPending ? "bg-gray-400" : "bg-primary", "w-full")}
              disabled={isPending}
            >
              {isPending ? (isEdit ? "Updating" : "Creating") : "Next"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminSide>
  );
};

export default CourseForm;
