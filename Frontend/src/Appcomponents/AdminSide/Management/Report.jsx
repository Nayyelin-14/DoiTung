import { useState } from "react";
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
import { SendReport } from "@/EndPoints/user";
import { toast } from "sonner";

const ReportDialog = ({ children, reportUser }) => {
  const [subject, setSubject] = useState("");
  const [contents, setContents] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen) => {
    // Prevent dialog close if there are unsaved changes
    if (!isOpen && (subject || contents)) {
      if (!window.confirm("You have unsaved changes. Discard report?")) {
        return;
      }
    }
    setOpen(isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !contents.trim()) {
      toast.error("Both fields are required");
      return;
    }

    if (contents.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await SendReport({
        user_id: reportUser,
        subject,
        contents,
      });

      if (response.success) {
        toast.success(response.message);
        setSubject("");
        setContents("");
        setOpen(false); // Close the dialog
      } else {
        toast.error(response.message || "Failed to send report");
      }
    } catch (err) {
      toast.error("An error occurred while submitting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Report</DialogTitle>
          <DialogDescription>
            Describe the issue you&apos;re reporting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
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
                "Send Report"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
