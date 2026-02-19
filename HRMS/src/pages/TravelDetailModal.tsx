import React, { useEffect, useState } from "react";
import { travelApis, type travelResponse } from "../apis/travelApis";
import { getUserRole } from "../utils/auth";
import {
  travelDocumentApis,
  type TravelDocumentResponse,
} from "../apis/travelDocumentApis";
import { ExpenseStatus, Statuses } from "../apis/enums";
import TravelCard from "../components/travels/TravelCard";
import { expenseApis, type ExpenseResponse } from "../apis/expenseApis";
import ExpenseForm from "../components/travels/ExpenseForm";
import {
  expenseDocumentApis,
  type expenseDocumentResponse,
} from "../apis/expenseDocumentApis";

interface props {
  travel: travelResponse;
  onClose: () => void;
}
const TravelDetailModal: React.FC<props> = ({ travel, onClose }) => {
  const role = getUserRole();

  const [documents, setDocuments] = useState<TravelDocumentResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [currentTravel, setCurrentTravel] = useState<travelResponse>(travel);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [expenseDocuments, setExpenseDocuments] = useState<
    Record<number, expenseDocumentResponse[]>
  >({});

  useEffect(() => {
    fetchDocuments();
    fetchExpenses();
  }, [travel.travelId]);

  const fetchDocuments = async () => {
    const docs = await travelDocumentApis.getdocuments(travel.travelId);
    setDocuments(docs);
  };

  const fetchExpenseDocuments = async (expenseId: number) => {
    const docs =
      await expenseDocumentApis.getAllExpenseDocumentsByExpenseId(expenseId);
    setExpenseDocuments((prev) => ({
      ...prev,
      [expenseId]: docs,
    }));
  };

  const fetchExpenses = async () => {
    try {
      let data: ExpenseResponse[];
      if (role === "HR") {
        data = await expenseApis.getAllExpensesByTravelId(travel.travelId);
        setExpenses(data);
      } else {
        data = await expenseApis.getMyExpenses(travel.travelId);
        setExpenses(data);
      }
      data.forEach((exp) => fetchExpenseDocuments(exp.expenseId));
    } catch (error) {
      console.error("failed to fetch expenses", error);
    }
  };

  const updateTravelstatus = async (status: Statuses) => {
    const updated = await travelApis.changeTravelStatus(
      travel.travelId,
      status,
    );
    setCurrentTravel(updated);
  };

  const updateExpensestatus = async (
    expenseId: number,
    status: ExpenseStatus,
  ) => {
    try {
      await expenseApis.changeExpenseStatus(travel.travelId, expenseId, status);
      fetchExpenses();
    } catch (err) {
      console.error("failed to update expense status", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    await travelDocumentApis.uploadDocument(
      currentTravel.travelId,
      {
        fileName: file.name,
        documentType: "TravelTickets",
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

  const canHrAct = isHR;

  const isClosed =
    currentTravel.status === Statuses.Cancelled ||
    currentTravel.status === Statuses.Completed;

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto space-y-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          >
            X
          </button>
          <div className="space-y-4">
            <TravelCard travel={currentTravel} />
            <div className="flex flex-wrap gap-3">
              {/* {canEmployeeAct && (
                <>
                  <button onClick={() => updateTravelstatus(Statuses.APPROVED)}>
                    Approve
                  </button>
                  <button onClick={() => updateTravelstatus(Statuses.REJECTED)}>
                    Reject
                  </button>
                </>
              )} */}

              {canHrAct && (
                <>
                  <button
                    onClick={() => updateTravelstatus(Statuses.Cancelled)}
                    className="px-4 py-2 bg-gray-600 text-gray rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateTravelstatus(Statuses.Completed)}
                    className="px-4 py-2 bg-blue-600 text-gray rounded-md hover:bg-blue-700"
                  >
                    Mark Completed
                  </button>
                </>
              )}
              <div />
            </div>

            <div className="bg-gray-50 p-6 rounded-x1 space-y-4">
              <h3 className="text-lg font-semibold">Documents</h3>

              {!isClosed && (
                <div className="flex gap-3 items-center">
                  <h4>Upload Document</h4>
                  <input
                    type="file"
                    className="border rounded-md px-3 py-2"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-gray rounded-md hover:bg-blue-700"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.storageUrl}
                    className="flex justify-between items-center bg-white p-3 rounded-md border"
                  >
                    <span>{doc.fileName}</span>
                    <a
                      href={doc.storageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <h4 className="text-lg font-semibold">Expenses</h4>

              {expenses.length === 0 ? (
                <p className="text-gray-500">No expenses recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">amount</th>
                        <th className="px-3 py-2 text-left">Currency</th>
                        <th className="px-3 py-2 text-left">category</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Date</th>
                        {isHR && (
                          <th className="px-3 py-2 text-left">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp) => (
                        <React.Fragment key={exp.expenseId}>
                          <tr
                            className="border-t hover:bg-gray-50"
                            key={exp.employeeId}
                          >
                            <td className="px-3 py-2">{exp.amount}</td>
                            <td className="px-3 py-2">{exp.currency}</td>
                            <td className="px-3 py-2">{exp.expenseCategory}</td>
                            <td className="px-3 py-2">{exp.expenseStatus}</td>
                            <td className="px-3 py-2">
                              {new Date(exp.expenseDate).toLocaleString()}
                            </td>

                            {isHR && (
                              <td className="px-3 py-2 space-x-2">
                                {(exp.expenseStatus === ExpenseStatus.DRAFT ||
                                  exp.expenseStatus ===
                                    ExpenseStatus.SUBMITTED) && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateExpensestatus(
                                          exp.expenseId,
                                          ExpenseStatus.APPROVED,
                                        )
                                      }
                                      className="px-3 py-1 bg-green-600 text-gray rounded"
                                    >
                                      Approve
                                    </button>

                                    <button
                                      onClick={() =>
                                        updateExpensestatus(
                                          exp.expenseId,
                                          ExpenseStatus.REJECTED,
                                        )
                                      }
                                      className="px-3 py-1 bg-red-600 text-gray rounded"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </td>
                            )}
                          </tr>
                          {expenseDocuments[exp.expenseId] &&
                            expenseDocuments[exp.expenseId].length > 0 && (
                              <tr className="bg-white border-t">
                                <td colSpan={6} className="px-6 py-4">
                                  <div className="flex -flex-wrap gap-4">
                                    {expenseDocuments[exp.expenseId].map(
                                      (doc, index) => (
                                        <a
                                          href={doc.storageUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          key={index}
                                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition"
                                        >
                                          View Reciept{index + 1}
                                        </a>
                                      ),
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="font-semibold">Total :{totalAmount}</div>

              {isEmployee && (
                <ExpenseForm travel={currentTravel} onCreated={fetchExpenses} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetailModal;
