import React, { useState } from "react";
import type { JobResponse } from "../../apis/jobApis";
import { JobStatuses } from "../../apis/enums";

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
  return <div></div>;
};

export default JobCard;
