import React, { useState } from "react";
import AuthForm from "./AuthComponents/AuthForm";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
const Login = () => {
  const [istwostep, setIstwostep] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoStepcode: "",
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
      } else if (response.twostep === true) {
        toast.success(response.message);

        setIstwostep(true);
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
        label_1={!istwostep && "LOGIN"}
        label_2={!istwostep && "REGISTER"}
        label_3={
          !istwostep
            ? "forgot passsword?"
            : "Hint : You must enter otp code before log in to your account"
        }
        herf_1={!istwostep && "/auth/login"}
        herf_2={!istwostep && "/auth/register"}
        href_3={!istwostep && "/auth/forgotpassword"}
        label_4={!istwostep ? "Or sign in with" : "Check Your Email"}
        showProvider={!istwostep && true}
        istwostep
        isloginPage={true}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(loginOnsubmit)}
            className="pr-8 pl-8 flex flex-col gap-2"
          >
            {istwostep ? (
              <FormField
                control={form.control}
                name="twoStepcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your code here</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            style={{ border: "1px solid black" }}
                          />
                          <InputOTPSlot
                            index={1}
                            style={{ border: "1px solid black" }}
                          />
                          <InputOTPSlot
                            index={2}
                            style={{ border: "1px solid black" }}
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            style={{ border: "1px solid black" }}
                          />
                          <InputOTPSlot
                            index={4}
                            style={{ border: "1px solid black" }}
                          />
                          <InputOTPSlot
                            index={5}
                            style={{ border: "1px solid black" }}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
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
            )}

            <Button
              type="submit"
              disabled={loading}
              className={cn("w-full h-12 bg-customGreen my-4 text-[18px]")}
            >
              {loading
                ? istwostep
                  ? "Verifying"
                  : "Logging in"
                : istwostep
                ? "Verify"
                : "Login"}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default Login;
