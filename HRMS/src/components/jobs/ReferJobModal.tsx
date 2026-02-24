import React, { useState, type ChangeEvent } from "react";
import {
  jobApis,
  type JobResponse,
  type ReferalRequest,
  type ReferalResponse,
} from "../../apis/jobApis";
import { toast } from "sonner";

interface Props {
  job: JobResponse;
  onClose: () => void;
}

const ReferJobModal: React.FC<Props> = ({ job, onClose }) => {
  const [formData, setFormData] = useState<ReferalRequest>({
    candidateName: "",
    candidateEmail: "",
    shortNote: "",
  });
  const [CVFile, setCVFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCVFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (
      !formData.candidateName.trim() ||
      !formData.candidateEmail.trim() ||
      !CVFile
    ) {
      setError("Please fill all required fields and upload a CV.");
      return;
    }

    try {
      setLoading(true);
      const response: ReferalResponse = await jobApis.createReferal(
        job.jobId,
        formData,
        CVFile,
      );

      setSuccess(true);
      toast.success("Referal created succesfully");

      setFormData({
        candidateName: "",
        candidateEmail: "",
        shortNote: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating referal");
      toast.error(err.response?.data?.message);
      setFormData({
        candidateName: "",
        candidateEmail: "",
        shortNote: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-whitw bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">
          Refer a Candidate for {job.title} at Roima Intelligence
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Candidate Name*:
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="block text-sm font-medium">
            Candidate Email*:
            <input
              type="email"
              name="candidateEmail"
              value={formData.candidateEmail}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="block text-sm font-medium">
            Short Note:
            <textarea
              value={formData.shortNote}
              onChange={handleChange}
              name="shortNote"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="block text-sm font-medium">
            Candidate CV*:
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
              required
            />
          </label>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && (
            <p className="text-green-600 mb-2">
              Referral submitted successfully!
            </p>
          )}

          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Referral"}
            </button>
            <button
              className="w-full bg-blue-600 text-gray py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferJobModal;
