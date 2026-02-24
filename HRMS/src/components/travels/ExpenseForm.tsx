import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  expenseApis,
  type CreateExpenseRequest,
  type ExpenseResponse,
} from "../../apis/expenseApis";
import { ExpenseCategory, ExpenseStatus, Statuses } from "../../apis/enums";
import type { travelResponse } from "../../apis/travelApis";
import { expenseDocumentApis } from "../../apis/expenseDocumentApis";
import { toast } from "sonner";

interface expenseFormProps {
  travel: travelResponse;
  onCreated: () => void;
}

const ExpenseForm: React.FC<expenseFormProps> = ({ travel, onCreated }) => {
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    currency: "",
    amount: 0,
    expenseDate: "",
    expenseCategory: ExpenseCategory.Accommodation,
    expenseStatus: ExpenseStatus.DRAFT,
  });
  const [file, setFile] = useState<File | null>(null);

  const [ExpenseResponse, setExpenseResponse] =
    useState<ExpenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const now = new Date();
  const startDate = new Date(travel.startDate);
  const endDate = new Date(travel.endDate);

  const maxAllowedDate = new Date(endDate);
  maxAllowedDate.setDate(maxAllowedDate.getDate() + 10);

 
  const isValidExpenseDate = now >= startDate && now <= maxAllowedDate;
  const canUploadExpense =
    isValidExpenseDate;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const createdExpense = await expenseApis.createExpense(travel.travelId, {
        ...formData,
        expenseDate: formData.expenseDate + ":00",
      });

      if (file) {
        await expenseDocumentApis.uploadExpenseDocument(
          createdExpense.expenseId,
          file,
        );
      }
      toast.success("Expense created successfully")
      onCreated();
      setFormData({
        currency: "",
        amount: 0,
        expenseDate: "",
        expenseCategory: ExpenseCategory.Accommodation,
        expenseStatus: ExpenseStatus.DRAFT,
      });
    } catch (err : any) {
      setError("Failed to create expense.");
      toast.error(err.createdExpense?.data?.message)
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canUploadExpense) {
    return (
      <div>
        

        {!isValidExpenseDate && (
          <p>
            Expenses can only be added from the travel start date until 10 days
            after the travel end date or When the travel is not cancelled.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create Expense
        </h2>

        <div className="grid grid-cols-1md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className=" border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="USD"
              required
              className=" border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="datetime-local"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            required
            className=" border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="expenseCategory"
            value={formData.expenseCategory}
            onChange={handleChange}
            className=" border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.values(ExpenseCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="block text-sm font-medium mb-1">
          <h4>Upload Receipt</h4>
          <input
            type="file"
            className="border rounded-md px-3 py-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          type="submit"
          className=" bg-blue-600 text-gray py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 font-semibold"
        >
          {isLoading ? "Saving..." : "Add Expense"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default ExpenseForm;
