import React, { useEffect, useState } from "react";
import { travelApis, type travelResponse } from "../apis/travelApis";
import { getUserRole } from "../utils/auth";
import {
  travelDocumentApis,
  type TravelDocumentResponse,
} from "../apis/travelDocumentApis";
import { Statuses } from "../apis/enums";
import TravelCard from "../components/travels/TravelCard";

interface props {
  travel: travelResponse;
  onClose: () => void;
}
const TravelDetailModal: React.FC<props> = ({ travel, onClose }) => {
  const role = getUserRole();

  const [documents, setDocuments] = useState<TravelDocumentResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [currentTravel, setCurrentTravel] = useState<travelResponse>(travel);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const docs = await travelDocumentApis.getdocuments(travel.travelId);
    setDocuments(docs);
  };

  const updatestatus = async (status: Statuses) => {
    const updated = await travelApis.changeTravelStatus(
      travel.travelId,
      status,
    );
    setCurrentTravel(updated);
  };

  const handleUpload = async () => {
    if (!file) return;

    await travelDocumentApis.uploadDocument(
      currentTravel.travelId,
      {
        fileName: file.name,
        DocumentType: "TravelTickets",
        ownerType: role == "HR" ? "HR" : "Employee",
      },
      file,
    );
    setFile(null);
    fetchDocuments();
  };

  const isEmployee = role === "Employee";
  const isHR = role === "HR";

  const canEmployeeAct =
    isEmployee && currentTravel.status === Statuses.PENDING;

  const canHrAct = isHR && currentTravel.status === Statuses.APPROVED;

  const canUpload = isHR || currentTravel.status === Statuses.APPROVED;

  return (
    <div>
      <div>
        <div>
          <TravelCard travel={currentTravel} />
          {canEmployeeAct && (
            <div>
              <button onClick={() => updatestatus(Statuses.APPROVED)}>
                Approve
              </button>
              <button onClick={() => updatestatus(Statuses.REJECTED)}>
                Reject
              </button>
            </div>
          )}
          {canHrAct && (
            <div>
              <button onClick={() => updatestatus(Statuses.Cancelled)}>
                Cancel
              </button>
              <button onClick={() => updatestatus(Statuses.Completed)}>
                Mark Completed
              </button>
            </div>
          )}
          {canUpload && (
            <div>
                <h4>Upload Document</h4>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button onClick={handleUpload}>
                    Upload
                </button>
            </div>
          )}

          <div>
            <h4>Documents</h4>
            {documents.map((doc) =>(
                <div key={doc.storageUrl}>
                    <p>{doc.fileName}</p>
                    <a href={doc.storageUrl} target="_blank" rel="noopener noreferrer">View</a>
                </div>
            ))}
          </div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TravelDetailModal;
