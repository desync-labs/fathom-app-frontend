import { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import useConnector from "context/connector";
import debounce from "lodash.debounce";
import { utils } from "fathom-ethers";

const useCreateProposalActionField = (index: number) => {
  const { control, watch, setValue } = useFormContext();
  const { library } = useConnector();
  const abiCoder = new utils.AbiCoder();

  const functionSignature = watch(`actions.${index}.functionSignature`);
  const functionArguments = watch(`actions.${index}.functionArguments`);

  const generateCallData = useMemo(
    () =>
      debounce((functionSignature: string, functionArguments: string) => {
        console.log("generateCallData");

        if (functionSignature) {
          const trimmedFunctionSignature = functionSignature.replace(/\s/g, "");
          let argumentValues: any[] = [];
          if (functionArguments) {
            const trimmedFunctionArguments = functionArguments.replace(
              /\s/g,
              ""
            );
            argumentValues = trimmedFunctionArguments
              .split(",")
              .map((arg: string) => {
                if (arg.toLowerCase() === "true") return true;
                if (arg.toLowerCase() === "false") return false;

                return arg;
              });
          }
          const argumentTypes = trimmedFunctionSignature.match(/\((.+)\)/);

          try {
            let callData = utils.id(trimmedFunctionSignature).substring(0, 10);

            if (argumentTypes && argumentTypes[1]) {
              const argumentTypesSplit = argumentTypes[1].split(",");
              if (argumentTypesSplit.length === argumentValues.length) {
                callData += abiCoder
                  .encode(argumentTypesSplit, argumentValues)
                  .replace("0x", "")
                  .replace("xdc", "");
              }
            }

            setValue(`actions.${index}.callData`, callData);
          } catch (e: any) {
            setValue(`actions.${index}.callData`, "");
            console.log(e);
          }
        }
      }, 1000),
    [library, index, setValue]
  );

  useEffect(() => {
    generateCallData(functionSignature, functionArguments);
  }, [functionSignature, functionArguments, generateCallData]);

  const validateAddress = useCallback((address: string) => {
    let valid = true;
    const trimmedAddresses = address.trim();

    if (!utils.isAddress(trimmedAddresses)) {
      valid = false;
    }

    if (!valid) {
      return "Please provide valid XDC address";
    }

    return valid;
  }, []);

  return {
    control,
    validateAddress,
  };
};

export default useCreateProposalActionField;
