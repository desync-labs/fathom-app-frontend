import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMediaQuery, useTheme } from "@mui/material";
import { useStores } from "stores";
import { ZERO_ADDRESS } from "helpers/Constants";
import { ProposeProps } from "components/Governance/Propose";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";

type ActionType = {
  target: string;
  callData: string;
  functionSignature: string;
  functionArguments: string;
  value: string;
};

const EMPTY_ACTION = {
  target: "",
  callData: "",
  functionSignature: "",
  functionArguments: "",
  value: "",
};

const defaultValues = {
  withAction: false,
  descriptionTitle: "",
  description: "",
  link: "",
  agreement: false,
  actions: [EMPTY_ACTION],
};

const useCreateProposal = (onClose: ProposeProps["onClose"]) => {
  const { proposalService } = useStores();
  const { account, chainId, library } = useConnector()!;

  const [vBalance, setVBalance] = useState<null | number>(null);
  const [vBalanceError, setVBalanceError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowTimestamp, setNotAllowTimestamp] = useState<number>(0);
  const [minimumVBalance, setMinimumVBalance] = useState<number>();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const methods = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { handleSubmit, watch, control, reset, getValues } = methods;

  const {
    fields,
    remove: removeAction,
    append,
  } = useFieldArray({
    control,
    name: "actions",
  });

  const { setLastTransactionBlock } = useSyncContext();

  const withAction = watch("withAction");

  useEffect(() => {
    if (account) {
      proposalService.getVBalance(account, library)!.then((balance) => {
        setVBalance(balance!);
      });
      proposalService
        .nextAcceptableProposalTimestamp(account, library)!
        .then((nextAcceptableTimestamp: number) => {
          if (nextAcceptableTimestamp > Date.now() / 1000) {
            setNotAllowTimestamp(nextAcceptableTimestamp);
          } else {
            setNotAllowTimestamp(0);
          }
        });
    }
  }, [account, library, proposalService, setVBalance, setNotAllowTimestamp]);

  useEffect(() => {
    proposalService.proposalThreshold(library).then((minVBalance) => {
      const formattedVBalance = BigNumber(minVBalance)
        .dividedBy(10 ** 18)
        .toNumber();
      setMinimumVBalance(formattedVBalance);
    });
  }, [proposalService, library, setMinimumVBalance]);

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

      if (BigNumber(vBalance!).isLessThan(minimumVBalance!)) {
        return setVBalanceError(true);
      } else {
        setVBalanceError(false);
      }

      setIsLoading(true);
      try {
        const { descriptionTitle, description, withAction, actions } = values;

        const combinedText = `${descriptionTitle}----------------${description}`;
        let blockNumber;
        if (withAction) {
          const targets: string[] = [];
          const callDatas: string[] = [];
          const values: number[] = [];

          actions.forEach((action: ActionType) => {
            targets.push(action.target);
            callDatas.push(action.callData);
            values.push(action.value ? Number(action.value) : 0);
          });

          blockNumber = await proposalService.createProposal(
            targets,
            values,
            callDatas,
            combinedText,
            account,
            library
          );
        } else {
          blockNumber = await proposalService.createProposal(
            [ZERO_ADDRESS],
            [0],
            [ZERO_ADDRESS],
            combinedText,
            account,
            library
          );
        }

        setLastTransactionBlock(blockNumber);
        reset();
        localStorage.removeItem("createProposal");
        onClose();
      } catch (err) {} finally {
        setIsLoading(false);
      }
    },
    [
      vBalance,
      minimumVBalance,
      notAllowTimestamp,
      reset,
      account,
      library,
      proposalService,
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
  }, [append]);

  return {
    minimumVBalance,
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
