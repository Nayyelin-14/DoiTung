import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const ReportDialog = ({ children, reportUser }) => {
  const [subject, setSubject] = useState("");
  const [contents, setContents] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!subject.trim() || !contents.trim()) {
      setError("Both fields are required");
      return;
    }
    
    if (contents.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setIsLoading(true);
    console.log(subject);

    try {
      const response = await SendReport({
        user_id: reportUser,
        subject,
        contents
      });

      if (response.success) {
        setSuccess(true);
        setSubject("");
        setContents("");
        setTimeout(() => setOpen(false), 1500);
      } else {
        setError(response.message || "Failed to send report");
      }
    } catch (err) {
      setError("An error occurred while submitting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen && (subject || contents)) {
      if (!confirm("You have unsaved changes. Discard report?")) {
        return;
      }
    }
    setOpen(isOpen);
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Report</DialogTitle>
          <DialogDescription>
            Describe the issue you're reporting
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-4 text-center text-green-600">
            Report submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <Input
                placeholder="Brief summary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <Textarea
                placeholder="Detailed information..."
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="mt-1 text-xs text-gray-500">
                {contents.length}/20 minimum characters
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
