import { Separator } from "@/components/ui/separator";
import React from "react";

const SettingHeader = ({ children }) => {
  return (
    <div className="ml-3">
      <div className="mt-10">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      {children}
    </div>
  );
};

export default SettingHeader;
