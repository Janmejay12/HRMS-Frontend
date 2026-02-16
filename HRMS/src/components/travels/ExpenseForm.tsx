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
import { ExpenseCategory, ExpenseStatus } from "../../apis/enums";
import type { travelResponse } from "../../apis/travelApis";

interface expenseFormProps {
  travel: travelResponse;
}

const ExpenseForm: React.FC<expenseFormProps> = ({ travel }) => {
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    travelId: 0,
    currency: "",
    amount: -1,
    expenseDate: "",
    expenseCategory: ExpenseCategory.Accommodation,
    expenseStatus: ExpenseStatus.DRAFT,
  });
  const [ExpenseResponse, setExpenseResponse] =
    useState<ExpenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //     const fetchExpenses = async () => {
  //       var fetchedExpenses = await expenseApis.getMyExpenses(travel.travelId);
  //       setFormData(fetchedExpenses);
  //       console.log(fetchExpenses);
  //     };

  //     fetchExpenses();
  //   }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("submitting data :", formData);

      const response = await expenseApis.createExpense(
        travel.travelId,
        formData,
      );
      setExpenseResponse(response);
      console.log("Expense request successful:", response);
    } catch (err) {
      setError("Failed to create expense.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return <div></div>;
};

export default ExpenseForm;
