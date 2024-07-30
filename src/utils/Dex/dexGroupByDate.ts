import { FormattedTransaction } from "apps/dex/components/Transactions/Transaction";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

export const dexGroupByDate = (
  transactions: (FormattedTransaction | TransactionDetails)[]
): Record<string, (FormattedTransaction | TransactionDetails)[]> => {
  return transactions.reduce((grouped, transaction) => {
    const date = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(transaction.addedTime));
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
    return grouped;
  }, {} as Record<string, (FormattedTransaction | TransactionDetails)[]>);
};
