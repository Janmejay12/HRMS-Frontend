import React, { useState } from "react";
import type { JobResponse } from "../../apis/jobApis";
import { JobStatuses } from "../../apis/enums";
import ShareJobModal from "./ShareJobModal";
import ReferJobModal from "./ReferJobModal";

interface Props {
  job: JobResponse;
}

const JobCard: React.FC<Props> = ({ job }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);

  const getStatusColor = () => {
    switch (job.status) {
      case JobStatuses.NEW:
        return "bg-blue-100 text-blue-700";
      case JobStatuses.IN_REVIEW:
        return "bg-yellow-100 text-yellow-700";
      case JobStatuses.HIRED:
        return "bg-green-100 text-green-700";
      case JobStatuses.ON_HOLD:
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-blue-700";
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {job.status}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Loaction : </strong>
            {job.location}
        </p>
        <p>
          <strong>Employement : </strong>
          {job.employmentType}
        </p>
        {job.salaryRange && (
          <p>
            <strong>Salary: </strong>
            {job.salaryRange}
          </p>
        )}
      </div>
      <div className="flex gap-3 pt-3">
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex-1 bg-blue-600 text-gray py-2 rounded-md hover:bg-blue-700"
        >
          Share
        </button>

        <button
          onClick={() => setIsReferOpen(true)}
          className="flex-1 bg-purple-600 text-gray py-2 rounded-md hover:bg-purple-700"
        >
          Refer
        </button>
      </div>
      {isShareOpen && (
        <ShareJobModal jobId={job.jobId} onClose={() => setIsShareOpen(false)} />
      )}

      {isReferOpen && (
        <ReferJobModal job={job} onClose={() => setIsReferOpen(false)} />
      )}
    </div>
  );
};

export default JobCard;
