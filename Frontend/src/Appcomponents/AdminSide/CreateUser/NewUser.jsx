import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { registerUser } from "@/EndPoints/auth";
import { registerSchema } from "@/types/registerSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import AdminSide from "../Admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const RegisterNewUser = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const Register_Onsubmit = async (values) => {
    try {
      setLoading(true);
      const response = await registerUser(values);
      if (!response.isSuccess) {
        form.reset();
        toast.error(response.message);

        setLoading(false);
      } else {
        toast.success(response.message);
        form.reset();
        navigate("/admin/users_management");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminSide>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between max-w-5xl ">
          <p className="mt-10 ml-3 font-bold text-xl">Register a new user</p>
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/admin/users_management")}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(Register_Onsubmit)}
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
                        placeholder="JhonDoe...."
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
              {!loading ? "Create new user" : "Creating"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminSide>
  );
};

export default RegisterNewUser;
