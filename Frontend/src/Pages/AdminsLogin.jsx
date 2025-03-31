import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { adminsLogin } from "@/EndPoints/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
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
      email: "",
      token: "",
    },
  });

  const LoginOnsubmit = async (values) => {
    try {
      setLoading(true);
      const response = await adminsLogin(values);
      if (!response.isSuccess) {
        form.reset();
        toast.error(response.message);
      } else {
        form.reset();
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        dispatch(setUser(response.loginUser));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <ArrowLeft
              className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => navigate("/auth/login")}
              size={24}
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(LoginOnsubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextField
                        label="Username"
                        placeholder="JohnDoe..."
                        {...field}
                        variant="outlined"
                        fullWidth
                        className="bg-white"
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
                        label="Email"
                        placeholder="johndoe@gmail.com"
                        {...field}
                        variant="outlined"
                        fullWidth
                        className="bg-white"
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
                        label="Password"
                        placeholder="******"
                        type="password"
                        {...field}
                        variant="outlined"
                        fullWidth
                        className="bg-white"
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
                        label="Admin Token"
                        placeholder="Enter secret token"
                        {...field}
                        variant="outlined"
                        fullWidth
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn(
                  "w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium",
                  loading && "opacity-70"
                )}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminsLogin;
