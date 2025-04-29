import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { registerUser } from "@/EndPoints/auth";
import { adminSchema, registerSchema } from "@/types/registerSchema";
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
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const validationSchema =
    selectedRole === "admin" ? adminSchema : registerSchema;
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
      email: "", // Optional, only required for admin
      token: "", // Optional, only required for admin
    },
  });

  const Register_Onsubmit = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      const response = await registerUser(values);
      if (!response.isSuccess) {
        form.reset({
          username: "",
          password: "",
          role: "",
          email: "", // Optional, only required for admin
          token: "", // Optional, only required for admin
        });
        setSelectedRole("");
        toast.error(response.message);
        setLoading(false);
      } else {
        toast.success(response.message);
        form.reset({
          username: "",
          password: "",
          role: "",
          email: "", // Optional, only required for admin
          token: "", // Optional, only required for admin
        });

        navigate("/admin/users_management", { replace: true });
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  const handleRoleChange = useCallback(
    (value) => {
      setSelectedRole(value);
      form.setValue("role", value); // Sync with form state
    },
    [form]
  );

  return (
    <AdminSide>
      <div className="md:max-w-5xl w-[95%]  mx-auto p-5 border border-gray-200 shadow-md mt-10 rounded-lg">
        <div className="flex items-end justify-between max-w-5xl ">
          <div className="ml-3 flex flex-col gap-3">
            <p className="mt-3 font-bold text-xl">
              {selectedRole === "admin"
                ? "Register a new admin"
                : "Register a new user"}
            </p>
            <p className="text-gray-400 text-sm">
              Hint : For creating a new admin , please select admin role
              first!!!
            </p>
          </div>
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
                        placeholder="JohnDoe...."
                        {...field}
                        variant="outlined"
                        className="w-full rounded-lg text-md bg-white"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole === "admin" && (
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
                          variant="outlined"
                          disabled={loading}
                          className="w-full rounded-lg text-md  bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                        disabled={loading}
                        variant="outlined"
                        className="w-full rounded-lg text-md  bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole === "admin" && (
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
                          disabled={loading}
                          variant="outlined"
                          className="w-full rounded-lg text-md  bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger className="w-[200px] p-2">
                          <SelectValue placeholder={"Select Role"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">user</SelectItem>
                          <SelectItem value="admin">admin</SelectItem>
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
              {!loading
                ? `Create new ${selectedRole === "admin" ? "admin" : "user"}`
                : "Creating"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminSide>
  );
};

export default RegisterNewUser;
