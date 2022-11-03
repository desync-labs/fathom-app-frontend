import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { Constants } from "helpers/Constants";
import { ProposeListViewProps } from "components/Governance/Propose";
import { Web3Utils } from "helpers/Web3Utils";
import { XDC_CHAIN_IDS } from "connectors/networks";
import Xdc3 from "xdc3";
import Web3 from "web3";

const defaultValues = {
  withAction: false,
  descriptionTitle: "",
  description: "",
  inputValues: "",
  calldata: "",
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

const useCreateProposal = (onClose: ProposeListViewProps["onClose"]) => {
  const { proposalStore } = useStores();
  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues,
  });

  const withAction = watch("withAction");

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposalStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposalStore]);

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
        if (!chainId) return;

        const {
          descriptionTitle,
          description,
          inputValues,
          calldata,
          targets,
          withAction,
        } = values;
        const combinedText =
          descriptionTitle + "----------------" + description;

        if (withAction) {
          const values = inputValues.trim().split(",").map(Number);
          const callData = calldata.trim().split(",");
          const targetsArray = targets
            .trim()
            .split(",")
            .map((address: string) => String.prototype.trim.call(address));

          await proposalStore.createProposal(
            targetsArray,
            values,
            callData,
            combinedText,
            account
          );
        } else {
          await proposalStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account
          );
        }
        reset();
        localStorage.removeItem("createProposal");
        onClose();
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, chainId, proposalStore]
  );

  const saveForLater = useCallback(() => {
    const values = getValues();
    localStorage.setItem("createProposal", JSON.stringify(values));
  }, [getValues]);

  const validateAddressesArray = useCallback((address: string) => {
    let valid = true;

    const library = Web3Utils.getWeb3Instance(chainId);
    const trimmedAddresses = address
      .trim()
      .split(",")
      .map((address: string) => address.trim());

    console.log(trimmedAddresses)

    for (let i = 0; i < trimmedAddresses.length; i++) {
      if (!Xdc3.utils.isAddress(trimmedAddresses[i]) && !Web3.utils.isAddress(trimmedAddresses[i])) {
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
    withAction,
    handleSubmit,
    watch,
    control,
    reset,
    account,
    chainId,
    onSubmit,
    vBalance: proposalStore.veBalance,
    saveForLater,
    validateAddressesArray,
    formatNumber,
  };
};

export default useCreateProposal;
