import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/types/CourseSchema";
import { CreatNewCourse } from "@/EndPoints/courses";
import { getOldCourse } from "@/EndPoints/drafts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const useCourseForm = () => {
  const { user } = useSelector((state) => state.user);
  const [searchparams] = useSearchParams();
  const isEdit = searchparams.get("editID");
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      course_id: isEdit ? "isEdit" : "",
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

  const ResetFormValues = () =>
    form.reset({
      course_id: "",
      title: "",
      description: "",
      category: "",
      overview: "",
      thumbnail: null,
      courseDemo: null,
      about_instructor: "",
      instructor_image: null,
      instructor_name: "",
    });
  const {
    data: courseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["edit-course", isEdit, user?.user_id],
    queryFn: () => getOldCourse(isEdit, user.user_id),
    enabled: !!isEdit && !!user?.user_id,
  });

  const { mutateAsync: createcourse, isPending } = useMutation({
    mutationFn: CreatNewCourse,
    onSuccess: (response) => {
      toast.success(response.message);
      const courseID = isEdit ? isEdit : response.NewCourse[0].course_id;
      navigate(
        `/admin/course_management/createcourse/${courseID}/createlessons`
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
      ResetFormValues();
    },
  });

  useEffect(() => {
    if (isEdit && courseData?.isSuccess) {
      const course = courseData.course;
      form.setValue("course_id", course.course_id);
      form.setValue("title", course.course_name);
      form.setValue("description", course.course_description);
      form.setValue("category", course.category);
      form.setValue("overview", course.overview);
      form.setValue("instructor_name", course.instructor_name);
      form.setValue("about_instructor", course.about_instructor);

      setImagePreview(course.course_image_url || null);
      setProfilePreview(course.instructor_image || null);
      setVideoPreview(course.demo_URL || null);

      form.setValue("thumbnail", course.course_image_url);
      form.setValue("instructor_image", course.instructor_image);
      form.setValue("courseDemo", course.demo_URL);
    }

    if (!isEdit) {
      setImagePreview(null);
      setVideoPreview(null);
      setProfilePreview(null);
    }

    if (isError) {
      toast.error("Failed to load course");
      ResetFormValues();
    }
  }, [isEdit, courseData, isError]);

  const onSubmit = async (values) => {
    const formdata = new FormData();
    if (isEdit) formdata.append("course_id", values.course_id);
    formdata.append("title", values.title);
    formdata.append("description", values.description);
    formdata.append("overview", values.overview);
    formdata.append("category", values.category);
    formdata.append("thumbnail", values.thumbnail);
    formdata.append("courseDemo", values.courseDemo);
    formdata.append("instructor_name", values.instructor_name);
    formdata.append("about_instructor", values.about_instructor);
    formdata.append("instructor_image", values.instructor_image);

    try {
      await createcourse(formdata);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const onError = (errors) => {
    for (const fieldName in errors) {
      switch (fieldName) {
        case "courseDemo":
          setVideoPreview(null);
          break;
        case "instructor_image":
          setProfilePreview(null);
          break;
        case "thumbnail":
          setImagePreview(null);
          break;
      }
      form.setValue(fieldName, "");
    }
  };

  return {
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
  };
};
