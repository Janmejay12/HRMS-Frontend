import React, { useState } from "react";
import { jobApis, type JobResponse } from "../../apis/jobApis";
import { toast } from "sonner";

interface Props {
  jobId: number;
  onClose: () => void;
}

const ShareJobModal: React.FC<Props> = ({ jobId, onClose }) => {
  const [emails, setEmails] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      setError("Please enter at least one valid email.");
      return;
    }

    try {
      setLoading(true);
      const res = await jobApis.shareJob(jobId, { recipientEmails: emailList });

      if (!res) {
        toast.error("Failed to share job");
        throw new Error("Failed to share job");
      }

      setSuccess(true);
      {
        success && toast.success("Job shared successfully");
      }
      setEmails("");
      setTimeout(() => onClose(), 1200);
    } catch (err:any) {
      setError((err as Error).message);
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-whitw bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Share Job</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Enter email(s), separated by commas:
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="example1@mail.com, example2@mail.com"
            rows={3}
          />
          {error && <p className="error">{error}</p>}
          {success && <p className="success">Job shared successfully!</p>}
          <div className="actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareJobModal;
