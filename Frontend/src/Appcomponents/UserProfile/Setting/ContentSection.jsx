import { Separator } from "@/components/ui/separator";
import React from "react";

const ContentSection = ({ title, desc }) => {
  return (
    <div className="flex flex-1 flex-col mb-3">
      <p className="text-sm text-muted-foreground">Hint - {desc}</p>
    </div>
  );
};

export default ContentSection;
