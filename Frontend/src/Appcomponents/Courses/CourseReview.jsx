import React, { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm, Controller } from "react-hook-form"; // ✅ Fix: Import Controller
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HoverRating from "./HoverRating";
import { AddReviews, EditReview } from "@/EndPoints/user";
import { Link } from "react-router-dom";

const CourseReview = ({children, userID, courseID, isReviewed, fetchReviews}) => {
  const [open, setOpen] = useState(false);
  const [Reviewed, setReviewed] = useState(isReviewed);
  
  const form = useForm({
    defaultValues: {
      rating: 3, // Default rating value
    },
  });

  const onSubmit = async (values) => {
    console.log("Submitted Review:", values.review);
    
    const newReview = {
        course_id: courseID,
        user_id: userID,
        rating: parseFloat(values.rating),
        review_text: values.review,
    }

    if(Reviewed){
      const response = await EditReview(newReview);
      if(response.isSuccess){
        toast.success("Review Updated!");
      }
      setReviewed(!Reviewed);
    } else {
      const response = await AddReviews(newReview);
      if(response.isSuccess){
        toast.success("Review submitted successfully!");
      }
      setReviewed(!Reviewed);
    }
    fetchReviews();
    setOpen(false); 
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[500px] sm:h-[300px] md:h-[300px]">
        <DialogHeader>
          <DialogTitle>
            {"Rate this course"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <HoverRating
                        value={field.value}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        size="large"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your thoughts..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{Reviewed ? "Update" : "Submit"}</Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CourseReview;
