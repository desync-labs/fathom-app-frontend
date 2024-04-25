import { useCallback, useEffect, useState } from "react";
import useConnector from "context/connector";
import { useLazyQuery } from "@apollo/client";
import { FXD_EVENTS } from "apollo/queries";
import { SelectChangeEvent } from "@mui/material";

const DummyData = [
  {
    id: "111",
    amount: "100453985434354364432",
    type: "Position created",
    txHash:
      "0xcc78665b3b42ea68bfc623240248c36c65a4c5f830200334c258f5a01f150f77",
    timestamp: 1703839616,
  },
  {
    id: "222",
    amount: "76453985434354364432",
    type: "Position top up",
    txHash:
      "0xcc78665b3b42ea68bfc623240248c36c65a4c5f830200334c258f5a01f150f77",
    timestamp: 1703239616,
  },
];

export interface IFxdTransaction {
  id: string;
  amount: string;
  type: string;
  txHash: string;
  timestamp: number;
}

export enum FilterTxType {
  ALL = "all",
  CREATED = "Position created",
  TOP_UP = "Position top up",
  PARTIAL_WITHDRAW = "Position partial withdraw",
  FULL_WITHDRAW = "Position close",
  LIQUIDATION = "Position liquidation",
}

const usePositionsTransactionList = () => {
  const [userTxList, setUserTxList] = useState<IFxdTransaction[]>([]);
  const [filterByType, setFilterByType] = useState<FilterTxType>(
    FilterTxType.ALL
  );
  const [serachValue, setSearchValue] = useState<string>("");
  const { account } = useConnector();

  const [loadFxdEvents] = useLazyQuery(FXD_EVENTS, {
    context: { clientName: "stable" },
  });

  const fetchUserTxList = useCallback(async () => {
    return loadFxdEvents({
      variables: {
        owner: account,
      },
    }).then((response) => {
      const { data } = response;
      console.log(data);
      setUserTxList(DummyData);
    });
  }, [account, loadFxdEvents, setUserTxList]);

  useEffect(() => {
    fetchUserTxList();
  }, []);

  const handleFilterByType = (event: SelectChangeEvent<unknown>) => {
    setFilterByType(event.target.value as FilterTxType);
  };

  return {
    userTxList,
    filterByType,
    serachValue,
    setSearchValue,
    handleFilterByType,
  };
};

export default usePositionsTransactionList;
