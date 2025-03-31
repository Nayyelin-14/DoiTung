import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { adminsLogin, registerUser } from "@/EndPoints/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ArrowLeft } from "lucide-react";
import { adminLoginSchema } from "@/types/registerSchema";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/Slices/UserSlice";

const AdminsLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
      email: "", // Optional, only required for admin
      token: "", // Optional, only required for admin
    },
  });

  const LoginOnsubmit = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      const response = await adminsLogin(values);
      if (!response.isSuccess) {
        form.reset();

        toast.error(response.message);
        setLoading(false);
      } else {
        form.reset();
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        dispatch(setUser(response.loginUser));
        navigate("/");

        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-end justify-between max-w-5xl ">
        <p className="mt-10 font-bold text-xl">Login as admins</p>

        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/auth/login")}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(LoginOnsubmit)}
          className="px-2 flex flex-col gap-2 mt-10"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="UserName"
                      placeholder="JohnDoe...."
                      {...field}
                      variant="outlined"
                      className="w-full rounded-lg text-md bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      placeholder="johndoe@gmail.com...."
                      {...field}
                      type="text"
                      {...field}
                      variant="outlined"
                      className="w-full rounded-lg text-md  bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Password"
                      placeholder="******"
                      {...field}
                      type="password"
                      {...field}
                      variant="outlined"
                      className="w-full rounded-lg text-md  bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Token"
                      placeholder="******"
                      {...field}
                      type="text"
                      variant="outlined"
                      className="w-full rounded-lg text-md  bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full h-10 bg-black text-bold my-4 text-white text-[14px]"
            )}
            disabled={loading}
          >
            {!loading ? `Login` : "Logging"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminsLogin;
