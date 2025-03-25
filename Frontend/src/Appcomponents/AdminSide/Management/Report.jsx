import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SendReport } from "@/EndPoints/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Report = ({ children, reportUser }) => {
  const [subject, setSubject] = useState("");
  const [contents, setContents] = useState("");
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);

  // Handle sending a report
  const handleSubmit = async () => {
    if (!reportUser || !subject || !contents) {
      alert("All fields are required!");
      return;
    }
    const payload = {
      user_id: reportUser,
      subject,
      contents,
    };

    const response = await SendReport(payload);
    if (response.message) {
      alert("Report sent successfully!");
      setSubject("");
      setContents("");
    } else {
      alert("Error sending report!");
    }
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="max-h-[none] h-auto">
          {" "}
          {/* Disable fixed height */}
          <DialogHeader className="mb-3">
            {" "}
            {/* Tighter header margin */}
            <DialogTitle>Send Report</DialogTitle>
            <DialogDescription>
              Enter the details of the report below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {" "}
            {/* Even tighter spacing (8px) */}
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contents</label>
              <Textarea
                placeholder="Report Details"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                className="mt-0 min-h-[100px]" /* Ensure textarea has a minimal height */
              />
            </div>
          </div>
          <Button onClick={handleSubmit} className="mt-3">
            {" "}
            {/* Adjusted margin */}
            Send Report
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Report;
