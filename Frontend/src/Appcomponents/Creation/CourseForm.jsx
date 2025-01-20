import React from "react";
import AdminSide from "../AdminSide/Admin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
const CourseForm = () => {
  const form = useForm();
  const onSubmit = ({ values }) => {
    console.log(values);
  };
  return (
    <AdminSide>
      <div className="ml-20 my-5 flex flex-col gap-5">
        <h1 className=" font-semibold text-xl ">Create new course</h1>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5  ">
                        <Input
                          type="text"
                          id="title"
                          placeholder="title...."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Textarea
                          type="text"
                          id="Description"
                          placeholder="description..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This will be publicly displayed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Input
                          type="text"
                          id="category"
                          placeholder="category..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Input
                          id="picture"
                          type="file"
                          className="cursor-pointer "
                          {...field}
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Course Demo</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Label htmlFor="demo"></Label>
                        <Input
                          id="demo"
                          type="file"
                          className="cursor-pointer "
                          {...field}
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button type="submit" className="w-[27%]">
              Next
            </Button>
          </form>
        </Form>
      </div>
    </AdminSide>
  );
};

export default CourseForm;
