import { useStores } from "stores";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Constants } from "helpers/Constants";
import { ProposeProps } from "components/Governance/Propose";
import { XDC_CHAIN_IDS } from "connectors/networks";
import Xdc3 from "xdc3";
import Web3 from "web3";
import useSyncContext from "context/sync";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";
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

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});

const useCreateProposal = (onClose: ProposeProps["onClose"]) => {
  const { proposalStore } = useStores();
  const { account, chainId, library } = useConnector()!;
  const [vBalance, setVBalance] = useState<null | number>(0);
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
    }
  }, [account, library, proposalStore, setVBalance]);

  useEffect(() => {
    let values = localStorage.getItem("createProposal");
    if (values) {
      values = JSON.parse(values);
      reset(values as unknown as typeof defaultValues);
    }
  }, [reset]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
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
            library,
          );
        } else {
          receipt = await proposalStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account,
            library,
          );
        }

        setLastTransactionBlock(receipt.blockNumber);
        reset();
        localStorage.removeItem("createProposal");
        onClose();
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, library, proposalStore, onClose, setLastTransactionBlock]
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
      return `Please provide valid ${
        XDC_CHAIN_IDS ? "XDC" : "Ethereum"
      } address`;
    }
  }, []);

  const formatNumber = useCallback((number: number) => {
    return formatter
      .formatToParts(number)
      .map((p) =>
        p.type !== "literal" && p.type !== "currency" ? p.value : ""
      )
      .join("");
  }, []);

  return {
    isMobile,
    withAction,
    handleSubmit,
    watch,
    control,
    reset,
    account,
    chainId,
    onSubmit,
    vBalance,
    saveForLater,
    validateAddressesArray,
    formatNumber,
  };
};

export default useCreateProposal;
