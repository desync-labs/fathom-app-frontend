import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Xdc3 from "xdc3";
import Web3 from "web3";
import { useStores } from "stores";
import { Constants } from "helpers/Constants";
import {
  MINIMUM_V_BALANCE,
  ProposeProps
} from "components/Governance/Propose";
import useSyncContext from "context/sync";
import { useMediaQuery, useTheme } from "@mui/material";
import useConnector from "context/connector";

const defaultValues = {
  withAction: false,
  descriptionTitle: "",
  description: "",
  inputValues: "",
  callData: "",
  targets: "",
  link: "",
  agreement: false,
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

  const { handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
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
          inputValues,
          callData,
          targets,
          withAction,
        } = values;

        const combinedText = `${descriptionTitle}----------------${description}`;
        let receipt;
        if (withAction) {
          const values = inputValues.trim().split(",").map(Number);
          const callDataArray = callData.trim().split(",");
          const targetsArray = targets
            .trim()
            .split(",")
            .map((address: string) => String.prototype.trim.call(address));

          receipt = await proposalStore.createProposal(
            targetsArray,
            values,
            callDataArray,
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

  const validateAddressesArray = useCallback((address: string) => {
    let valid = true;
    const trimmedAddresses = address
      .trim()
      .split(",")
      .map((address: string) => address.trim());

    for (let i = 0; i < trimmedAddresses.length; i++) {
      if (
        !Xdc3.utils.isAddress(trimmedAddresses[i]) &&
        !Web3.utils.isAddress(trimmedAddresses[i])
      ) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      return `Please provide valid XDC address`;
    }
  }, []);

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
    validateAddressesArray,
    notAllowTimestamp,
  };
};

export default useCreateProposal;
