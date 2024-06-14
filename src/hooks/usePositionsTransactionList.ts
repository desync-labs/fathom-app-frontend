import { useCallback, useEffect, useMemo, useState } from "react";
import useConnector from "context/connector";
import { useLazyQuery } from "@apollo/client";
import { FXD_ACTIVITIES } from "apollo/queries";
import { SelectChangeEvent } from "@mui/material";
import { IOpenPosition } from "fathom-sdk";
import useDashboard from "../context/fxd";

export enum PositionActivityState {
  CREATED = "created",
  TOP_UP = "topup",
  REPAY = "repay",
  LIQUIDATION = "liquidation",
  CLOSED = "closed",
}

export interface IFxdTransaction {
  id: string;
  position: IOpenPosition;
  activityState: PositionActivityState;
  collateralAmount: string;
  debtAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transaction: string;
}

export enum FilterTxType {
  all = "All",
  created = "Position created",
  topup = "Position top up",
  repay = "Position partial withdraw",
  closed = "Position close",
  liquidation = "Position liquidation",
}

export type FilterTxTypeKeys = keyof typeof FilterTxType;

const usePositionsTransactionList = () => {
  /**
   * Filter state
   */
  const [filterByType, setFilterByType] = useState<FilterTxTypeKeys>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  /**
   * Activities
   */
  const [fxdActivities, setFxdActivities] = useState<IFxdTransaction[]>([]);

  const { account, chainId } = useConnector();
  const { proxyWallet } = useDashboard();

  const [fetchActivities, { refetch: refetchActivities, loading }] =
    useLazyQuery(FXD_ACTIVITIES, {
      context: { clientName: "stable", chainId },
      variables: {
        first: 1000,
        chainId,
        orderBy: "blockNumber",
        orderDirection: "desc",
      },
    });

  useEffect(() => {
    if (account && proxyWallet && chainId) {
      const variables: {
        proxyWallet: string;
        activityState?: string[];
        first?: number;
      } = {
        proxyWallet,
      };

      if (filterByType === Object.keys(FilterTxType)[0]) {
        variables["activityState"] = Object.values(PositionActivityState);
        variables["first"] = 1000;
      } else {
        variables["activityState"] = [filterByType];
        variables["first"] = 100;
      }

      fetchActivities({
        variables,
      }).then(({ data }) => {
        setFxdActivities(data?.positionActivities || []);
      });
    } else {
      setFxdActivities([]);
    }
  }, [account, proxyWallet, setFxdActivities, chainId, filterByType]);

  const handleFilterByType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      setFilterByType(event.target.value as FilterTxTypeKeys);
    },
    [setFilterByType]
  );

  const filterActive = useMemo(() => {
    return filterByType !== "all" || searchValue !== "";
  }, [filterByType, searchValue]);

  return {
    fxdActivities,
    isLoading: loading,
    filterActive,
    filterByType,
    searchValue,
    handleFilterByType,
    refetchActivities,
    setFilterByType,
    setSearchValue,
  };
};

export default usePositionsTransactionList;
