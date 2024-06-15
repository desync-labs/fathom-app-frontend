import { IFxdTransaction } from "hooks/Pools/usePositionsTransactionList";

export const fxdActivitiesGroupByDate = (
  transactions: IFxdTransaction[]
): Record<string, IFxdTransaction[]> => {
  return transactions.reduce((grouped, transaction) => {
    const date = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(transaction.blockTimestamp * 1000));
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
    return grouped;
  }, {} as Record<string, IFxdTransaction[]>);
};
