import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transactionStore', {
  state: () => ({
    transactions: [],
  }),
  actions: {
    addTransaction(transaction) {
      this.transactions.push(transaction);
    },
  },
});
