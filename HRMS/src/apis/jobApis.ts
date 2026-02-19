// export interfcae JobRequest{
//   title: string ;
//   jobDescriptionStorageUrl?: string
//   skillList: Skills[];                      // List<Skills> → Skills[]
//   createdBy: number | null;                 // Long → number
//   location: string | null;                  // String → string
//   departmentId: number ;
//   salaryRange: string | null;                // String → string
//   employmentType: EmploymentType | null;    // Enum mapping
//   status: JobStatuses | null;               // Enum mapping
//   hrOwner: number | null;                   // Long → number
//   defaultEmail: string | null;
// }

import { api } from "./axios";
import type { EmployementType, JobStatuses } from "./enums";

export interface JobResponse {
  jobId: number;
  title: string;
  jobDescriptionStorageUrl?: string;
  skillList: string[];
  createdBy: number;
  location: string;
  departmentId: number;
  salaryRange?: string;
  employmentType: EmployementType;
  status: JobStatuses;
  hrOwnerId?: number;
  defaultEmail?: string;
}

export interface UpdateJobRequest {
  defaultEmail?: string;
  hrOwnerId?: number;
  reviewerIds?: number[];
}

export interface ReferalRequest {
  candidateName: string;
  candidateEmail: string;
  shortNote?: string;
}

export interface ReferalResponse {
  referalId: number;
  candidateName: string;
  candidateEmail: string;
  shortNote?: string;
  cvURLPath: string;
  referalGivenBy: number;
}

export interface ShareJobResponse {
  message: string;
}
export interface ShareJobRequest {
  recipientEmails: string[];
}

export const jobApis = {
  getAllJobs: async (): Promise<JobResponse[]> => {
    const reponse = await api.get<JobResponse[]>("/jobs");
    return reponse.data;
  },

  updateJob: async (jobId: number, request: UpdateJobRequest) => {
    const reponse = await api.put<JobResponse>(`/jobs/${jobId}`, request);
    return reponse.data;
  },

  createReferal: async (
    jobid: number,
    requestData: ReferalRequest,
    file: File,
  ): Promise<ReferalResponse> => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(requestData)], { type: "application/json" }),
    );

    formData.append("file", file);

    const response = await api.post<ReferalResponse>(
      `/jobs/${jobid}/referals`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  shareJob: async (
    jobid: number,
    request: ShareJobRequest,
  ): Promise<ShareJobResponse> => {
    const response = await api.post<ShareJobResponse>(
      `/jobs/${jobid}/share`,
      request,
    );
    return response.data;
  },
};
