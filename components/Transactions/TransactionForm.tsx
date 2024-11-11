import React, { useEffect, useState } from "react";
import { CategoryType, TransactionSchema } from "@/lib/definitions";
import { TypeOf } from "zod";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AutocompleteCreatable from "@/components/AutoCompleteCreatable/AutocompleteCreatable";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { getAllCategories } from "@/lib/actions/categories.actions";

type FormValues = TypeOf<typeof TransactionSchema>;

interface Props {
  handleCloseModal: () => void;
  onTransactionAdded: () => Promise<void>;
}

const TransactionForm = ({ handleCloseModal, onTransactionAdded }: Props) => {
  const [categoriesNames, setCategoriesNames] = useState<{ name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        const categoryObjects =
          categories.map((category: CategoryType) => ({
            name: category.name,
          })) || [];
        setCategoriesNames(categoryObjects);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: { type: "", category: "", amount: "", date: "" },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("amount", data.amount);

    const formattedDate = data.date
      ? dayjs(data.date).format("YYYY-MM-DDTHH:mm:ssZ")
      : "";
    formData.append("date", formattedDate);

    try {
      await createTransaction(formData);
    } catch (error) {
      console.error(error);
    }

    onTransactionAdded();
    reset();
    handleCloseModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select label="Type" {...register("type")} value={watch("type") || ""}>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <Controller
        name="category"
        control={control}
        render={({ field }) => {
          return (
            <AutocompleteCreatable
              {...field}
              options={categoriesNames}
              label="Insert or select a category"
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
            />
          );
        }}
      />
      <TextField
        fullWidth
        label="Amount"
        variant="outlined"
        margin="normal"
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Transaction Date"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                if (newValue) {
                  const formattedDate = newValue.format("YYYY-MM-DD");
                  field.onChange(formattedDate);
                } else {
                  field.onChange("");
                }
              }}
              onAccept={(newValue) => {
                if (newValue) {
                  const formattedDate = newValue.format("YYYY-MM-DD");
                  field.onChange(formattedDate);
                } else {
                  field.onChange("");
                }
              }}
            />
          )}
        />
      </LocalizationProvider>

      <Button color="primary" type="submit" disabled={isSubmitting}>
        Insert
      </Button>
    </form>
  );
};

export default TransactionForm;
