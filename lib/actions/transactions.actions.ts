import api from "../api";
import { TransactionSchema } from "../definitions";

export const createTransaction = async (formData: FormData) => {
  const validatedFields = TransactionSchema.safeParse({
    type: formData.get("type"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    date: formData.get("date") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { amount, ...fields } = validatedFields.data;

  const formattedAmount = parseFloat(amount);

  if (isNaN(formattedAmount)) {
    console.error("Invalid amount:", amount);
    return { errors: [{ message: "Amount is not a valid number" }] };
  }

  try {
    const response = await api.post("/transaction", {
      categoryName: validatedFields.data.category,
      amount: formattedAmount,
      ...fields,
    });
    return response;
  } catch (error) {
    console.error("Error creating transaction: ", error);
  }
};

export const getAllTransactions = async (limit: number = 100) => {
  try {
    const result = await api.get(`/transaction/${limit}`);

    return result.data;
  } catch (error) {
    console.error("error: ", error);
    return { error: "Failed to fetch transactions. Please try again later." };
  }
};
