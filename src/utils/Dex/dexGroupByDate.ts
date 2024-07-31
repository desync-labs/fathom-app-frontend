import { FormattedTransaction } from "apps/dex/components/Transactions/Transaction";

export const dexGroupByDate = (
  transactions: FormattedTransaction[]
): Record<string, FormattedTransaction[]> => {
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
  }, {} as Record<string, FormattedTransaction[]>);
};
