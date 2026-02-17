import React, { useEffect, useState } from "react";
import { jobApis, type JobResponse } from "../../apis/jobApis";
import JobCard from "../../components/jobs/JobCard";

const JobsHome = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobApis.getAllJobs();
      setJobs(data);
    } catch (err) {
      setError("failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading Jobs...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return <div>
    <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Open positions</h1>
        {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs available</p>
        ) : (
            <div className="grid md:grid-cols2 lg:grid-cols-3 gap-6">
                {jobs.map(job) => (
                    <JobCard key = {job.jobId} job ={job}/>
                )}
            </div>
        )}
    </div>
  </div>;
};

export default JobsHome;
