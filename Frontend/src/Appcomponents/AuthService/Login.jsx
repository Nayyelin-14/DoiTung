import React, { useState } from "react";
import AuthForm from "./AuthComponents/AuthForm";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginSchema } from "../../types/loginschema";
import { LoginUser } from "../../EndPoints/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/Slices/UserSlice";
const Login = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loginOnsubmit = async (values) => {
    try {
      setLoading(true);
      const response = await LoginUser(values);

      if (response.isunVerified) {
        toast.error(response.message);
        navigate("/verifyemail");
      } else if (response.isSuccess) {
        form.reset();
        toast.success(response.message);

        localStorage.setItem("token", response.token);
        dispatch(setUser(response.loginUser));
        navigate("/");
      } else {
        form.reset();
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthForm
        label_1={"LOGIN"}
        label_2={"REGISTER"}
        label_3={"forgot passsword?"}
        herf_1={"/auth/login"}
        herf_2={"/auth/register"}
        href_3={"/auth/forgotpassword"}
        label_4={"Or sign in with"}
        showProvider
        isloginPage={true}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(loginOnsubmit)}
            className="pr-8 pl-8 flex flex-col gap-2"
          >
            <div className="flex flex-col gap-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        className="rounded-lg h-[48px] text-md"
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
                        className="rounded-lg h-[48px]  text-md"
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
                "w-full h-12 bg-customGreen my-4 font-bold text-md"
              )}
            >
              {loading ? "LOGGING IN" : "LOGIN"}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default Login;
