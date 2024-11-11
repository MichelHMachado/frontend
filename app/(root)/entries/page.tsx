"use client";

import {
  Box,
  Button,
  Grid2 as Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useEffect, useState } from "react";

import TransactionForm from "@/components/Transactions/TransactionForm";
import { withAuth } from "@/components/Auth/WithAuth";
import ExtractTable from "@/components/Transactions/ExtractTable";
import { getAllTransactions } from "@/lib/actions/transactions.actions";
import { Transaction } from "@/types/transaction";
import { formatDate } from "@/utils/formatDate";

const Entries = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [transactions, setTransactions] = useState([
    {
      type: "",
      category: { name: "" },
      date: "",
      amount: 0,
    },
  ]);
  const columns = [
    { id: "date", title: "Date" },
    { id: "type", title: "Type" },
    { id: "category", title: "Category" },
    { id: "amount", title: "Amount" },
    { id: "edit", title: "Edit" },
  ];

  const fetchTransactions = async () => {
    try {
      const result: Transaction[] = await getAllTransactions(100);

      const fetchedTransactions = result.map(
        ({ type, category, date, amount }) => ({
          type,
          category,
          date: formatDate(date),
          amount,
        })
      );

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("error fetching transactions: ", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Grid
      sx={{
        flexGrow: 1,
        bgcolor: "white",
        color: "black",
        padding: "16px",
        height: "100%",
        py: "24px",
      }}
      container
      width={"100%"}
    >
      <Grid size={4}>
        <Box>
          <Typography>Balance</Typography>
          <Box>BalanceComponent</Box>
          <Button onClick={handleOpenModal}>Insert Entry</Button>
        </Box>
      </Grid>
      <Grid size={8}>
        <Box sx={{ position: "relative" }}>
          <ExtractTable
            columns={columns}
            rows={transactions}
            title={"Transactions Extract"}
          />
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            aria-hidden={!openModal ? "true" : undefined}
          >
            <DialogTitle>Insert Entry</DialogTitle>
            <DialogContent>
              <TransactionForm
                onTransactionAdded={fetchTransactions}
                handleCloseModal={handleCloseModal}
              />
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
};

export default withAuth(Entries);
