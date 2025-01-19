import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../types/registerSchema";
import AuthForm from "./AuthComponents/AuthForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { cn } from "../../../lib/utils";
import { registerUser } from "../../EndPoints/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
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
        navigate("/verifyemail");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthForm
      label_1="LOGIN"
      label_2="REGISTER"
      label_3="Or sign in with:"
      herf_1="/auth/login"
      herf_2="/auth/register"
      showProvider
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(Register_Onsubmit)}
          className="pr-8 pl-8 flex flex-col gap-2"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="JhonDoe...."
                      {...field}
                      className="h-[48px] text-md"
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
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className="h-[48px] text-md"
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
                    <Input
                      placeholder="******"
                      {...field}
                      type="password"
                      className="h-[48px] text-md"
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
              "w-full h-12 bg-customGreen my-4 text-white text-[18px]"
            )}
            disabled={loading}
          >
            {!loading ? " SIGN UP" : "SIGNING UP"}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default Register;
