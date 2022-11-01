import { useStores } from "../stores";
import useMetaMask from "./metamask";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { Constants } from "../helpers/Constants";

const useCreateProposal = () => {
  const { proposalStore } = useStores();
  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, reset } = useForm({
    defaultValues: {
      withAction: false,
      descriptionTitle: "",
      description: "",
      inputValues: "",
      calldata: "",
      targets: "",
      link: "",
      agreement: false,
    },
  });

  const withAction = watch("withAction");

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposalStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposalStore]);

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
          descriptionTitle + "    ----------------    " + description;

        if (withAction) {
          const valuesArray = inputValues.trim().split(",").map(Number);
          const calldataArray = calldata.trim().split(",");
          const targetsArray = targets.trim().split(",");

          await proposalStore.createProposal(
            targetsArray,
            valuesArray,
            calldataArray,
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
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, chainId, proposalStore]
  );

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
  };
};

export default useCreateProposal;
