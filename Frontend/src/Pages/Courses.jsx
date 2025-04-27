import ExploreCourses from "@/Appcomponents/Courses/ExploreCourses";
import { getCourses } from "@/EndPoints/courses";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Courses = () => {
  // Fetch courses using useQuery
  const { data, error, isLoading } = useQuery({
    queryKey: ["allCourses"],
    queryFn: getCourses,
    onSuccess: (response) => {
      if (!response.isSuccess) {
        toast.error(response.message);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
    staleTime: Infinity, // Set stale time as needed
  });

  // Directly get courses from the response
  const courses = data?.courses;

  // Render ExploreCourses with the fetched data
  return (
    <div>
      <ExploreCourses courses={courses || []} isLoading={isLoading} />
    </div>
  );
};

export default Courses;
