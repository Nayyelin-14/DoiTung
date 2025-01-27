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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoStepSchema } from "@/types/TwostepSchema";
import { Input } from "@/components/ui/input";
import { twostepEnable } from "@/EndPoints/user";
import { toast } from "sonner";

const TwoStep = ({ children, userEmail, userID, isTwostepEnabled }) => {
  const [open, setOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false); // Tracks the two-step verification state

  const form = useForm({
    resolver: zodResolver(twoStepSchema),
    defaultValues: {
      isTwostepEnabled: isTwostepEnabled || false, // Default value for the switch
      email: userEmail || "",
      userID,
    },
  });
  useEffect(() => {
    if (isTwostepEnabled) {
      setIsEnabled(isTwostepEnabled);
    }
  }, []);

  const onSubmit = async (values) => {
    console.log(values);

    setIsEnabled(values.isTwostepEnabled);
    try {
      const response = await twostepEnable(values);

      if (response.isSuccess === "disabled") {
        toast.warning(response.message);
        setOpen(false);
      }
      if (response.isSuccess === "enabled") {
        toast.success(response.message);
        setOpen(false);
      }
      if (!response) {
        toast.error(response.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-[400px] h-[180px] sm:h-[150px] sm:[500px] md:w-[600px] md:h-[180px]">
        <DialogHeader>
          <DialogTitle>
            {isEnabled
              ? "Are you sure to stop using two step verification?"
              : "Do you want to enable two step verification?"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center">
                <FormField
                  name="isTwostepEnabled"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked); // Update the form state
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input
                          type="text"
                          id="email"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="userID"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input
                          type="text"
                          id="userID"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isEnabled && <Button type="submit">Disable</Button>}
                {!isEnabled && <Button type="submit">Enable</Button>}
              </div>
            </form>
          </Form>
          <div className="mt-5">Don't forget to switch button first!!!</div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TwoStep;
