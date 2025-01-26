import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";

const AnalyticCard = ({ href, count, title, icon }) => {
  return (
    // className={cn(isPending && "bg-black text-white")}
    <Link to={href}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            {icon} <p className="text-2xl font-bold">{count}</p>
          </div>

          <h1 className="text-normal font-medium">{title}</h1>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default AnalyticCard;
