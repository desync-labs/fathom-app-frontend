import { useCallback, useEffect, useState } from "react";
import {
  useFieldArray,
  useForm
} from "react-hook-form";
import { useMediaQuery, useTheme } from "@mui/material";
import { useStores } from "stores";
import { Constants } from "helpers/Constants";
import { MINIMUM_V_BALANCE, ProposeProps } from "components/Governance/Propose";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

type ActionType = {
  target: string;
  callData: string;
  functionSignature: string;
  functionArguments: string;
  value: string;
}

const EMPTY_ACTION = {
  target: "",
  callData: "",
  functionSignature: "",
  functionArguments: "",
  value: "",
}

const defaultValues = {
  withAction: false,
  descriptionTitle: "",
  description: "",
  link: "",
  agreement: false,
  actions: [EMPTY_ACTION]
};

const useCreateProposal = (onClose: ProposeProps["onClose"]) => {
  const { proposalStore } = useStores();
  const { account, chainId, library } = useConnector()!;

  const [vBalance, setVBalance] = useState<null | number>(null);
  const [vBalanceError, setVBalanceError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowTimestamp, setNotAllowTimestamp] = useState<number>(0);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const methods = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { handleSubmit, watch, control, reset, getValues } = methods;

  const { fields, remove: removeAction, append } = useFieldArray({
    control,
    name: 'actions'
  });

  const { setLastTransactionBlock } = useSyncContext();

  const withAction = watch("withAction");

  useEffect(() => {
    if (account) {
      proposalStore.getVBalance(account, library).then((balance) => {
        setVBalance(balance!);
      });
      proposalStore
        .nextAcceptableProposalTimestamp(account, library)
        .then((nextAcceptableTimestamp: number) => {
          if (nextAcceptableTimestamp > Date.now() / 1000) {
            setNotAllowTimestamp(nextAcceptableTimestamp);
          } else {
            setNotAllowTimestamp(0);
          }
        });
    }
  }, [account, library, proposalStore, setVBalance, setNotAllowTimestamp]);


  useEffect(() => {
    let values = localStorage.getItem("createProposal");
    if (values) {
      values = JSON.parse(values);
      reset(values as unknown as typeof defaultValues);
    }
  }, [reset]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (notAllowTimestamp > Date.now() / 1000) {
        return;
      }

      if (vBalance! < MINIMUM_V_BALANCE) {
        return setVBalanceError(true);
      } else {
        setVBalanceError(false);
      }

      setIsLoading(true);
      try {
        const {
          descriptionTitle,
          description,
          withAction,
          actions,
        } = values;

        const combinedText = `${descriptionTitle}----------------${description}`;
        let receipt;
        if (withAction) {
          const targets: string[] = [];
          const callDatas: string[] = [];
          const values: number[] = [];

          actions.forEach((action: ActionType) => {
            targets.push(action.target);
            callDatas.push(action.callData);
            values.push( action.value ? Number(action.value) : 0 );
          })

          receipt = await proposalStore.createProposal(
            targets,
            values,
            callDatas,
            combinedText,
            account,
            library
          );
        } else {
          receipt = await proposalStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account,
            library
          );
        }

        setLastTransactionBlock(receipt.blockNumber);
        reset();
        localStorage.removeItem("createProposal");
        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      vBalance,
      notAllowTimestamp,
      reset,
      account,
      library,
      proposalStore,
      onClose,
      setLastTransactionBlock,
      setVBalanceError,
    ]
  );

  const saveForLater = useCallback(() => {
    const values = getValues();
    localStorage.setItem("createProposal", JSON.stringify(values));
  }, [getValues]);

  const appendAction = useCallback(() => {
    append(EMPTY_ACTION);
  }, [append])

  return {
    isMobile,
    isLoading,
    withAction,
    handleSubmit,
    watch,
    control,
    reset,
    account,
    chainId,
    onSubmit,
    vBalance,
    vBalanceError,
    saveForLater,
    notAllowTimestamp,
    fields,
    methods,
    removeAction,
    appendAction,
  };
};

export default useCreateProposal;
