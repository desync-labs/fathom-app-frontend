import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useServices } from "context/services";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import { ZERO_ADDRESS } from "utils/Constants";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";
import { useNavigate, useParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import DraftPasteProcessor from "draft-js/lib/DraftPasteProcessor";
import { saveDraftProposal, findDraftProposal } from "utils/draftProposal";
import { stripTags } from "../../utils/htmlToComponent";

export type ActionType = {
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
  isApproved: false,
};

export type CreateProposalType = {
  id?: string;
  withAction: boolean;
  descriptionTitle: string;
  description: string;
  link: string;
  isApproved: boolean;
  actions: ActionType[];
};

const useCreateProposal = () => {
  const { proposalService } = useServices();
  const { account, chainId } = useConnector();
  const { _proposalId } = useParams();

  const [vBalance, setVBalance] = useState<null | string>(null);
  const [vBalanceError, setVBalanceError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowTimestamp, setNotAllowTimestamp] = useState<string>("0");
  const [minimumVBalance, setMinimumVBalance] = useState<number>();
  const navigate = useNavigate();
  const { setShowSuccessAlertHandler, setShowErrorAlertHandler } =
    useAlertAndTransactionContext();
  const { setLastTransactionBlock } = useSyncContext();

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

  const withAction = watch("withAction");

  useEffect(() => {
    if (account) {
      proposalService.getVBalance(account).then((balance) => {
        setVBalance(balance.toString());
      });
      proposalService
        .nextAcceptableProposalTimestamp(account)
        .then((nextAcceptableTimestamp) => {
          if (
            BigNumber(nextAcceptableTimestamp.toString()).isGreaterThan(
              Date.now() / 1000
            )
          ) {
            setNotAllowTimestamp(nextAcceptableTimestamp.toString());
          } else {
            setNotAllowTimestamp("0");
          }
        });
    }
  }, [account, proposalService, setVBalance, setNotAllowTimestamp]);

  useEffect(() => {
    proposalService.proposalThreshold().then((minVBalance) => {
      const formattedVBalance = BigNumber(minVBalance.toString())
        .dividedBy(10 ** 18)
        .toNumber();
      setMinimumVBalance(formattedVBalance);
    });
  }, [proposalService, setMinimumVBalance]);

  useEffect(() => {
    if (_proposalId) {
      const draftProposal = findDraftProposal(_proposalId);
      if (draftProposal) {
        if (draftProposal.description && draftProposal.description.length) {
          const formattedDescription = DraftPasteProcessor.processHTML(
            draftProposal.description
          );

          const contentState =
            ContentState.createFromBlockArray(formattedDescription);

          draftProposal.description =
            EditorState.createWithContent(contentState);
        }

        reset(draftProposal);
      }
    }
  }, [reset, _proposalId]);

  const onClose = useCallback(() => {
    setShowSuccessAlertHandler(true, "Proposal created successfully");
    navigate("/dao/governance");
  }, [navigate]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (BigNumber(notAllowTimestamp).isGreaterThan(Date.now() / 1000)) {
        return setShowErrorAlertHandler(
          true,
          "Next acceptable proposal timestamp is not reached."
        );
      }

      if (
        vBalance === null ||
        BigNumber(vBalance as string)
          .dividedBy(10 ** 18)
          .isLessThan(minimumVBalance as number)
      ) {
        return setVBalanceError(true);
      } else {
        setVBalanceError(false);
      }

      setIsLoading(true);
      try {
        const { descriptionTitle, description, withAction, actions } = values;
        const formattedDescription = draftToHtml(
          convertToRaw(description?.getCurrentContent())
        );
        const combinedText = `${descriptionTitle}----------------${formattedDescription}`;
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
            account
          );
        } else {
          blockNumber = await proposalService.createProposal(
            [ZERO_ADDRESS],
            [0],
            [ZERO_ADDRESS],
            combinedText,
            account
          );
        }

        setLastTransactionBlock(blockNumber as number);
        reset();
        onClose();
      } finally {
        setIsLoading(false);
      }
    },
    [
      vBalance,
      minimumVBalance,
      notAllowTimestamp,
      reset,
      account,
      proposalService,
      onClose,
      setLastTransactionBlock,
      setVBalanceError,
    ]
  );

  const saveForLater = useCallback(() => {
    const values = getValues();

    const { description, descriptionTitle } = values;
    const formattedDescription =
      (description as any) instanceof EditorState
        ? draftToHtml(
            convertToRaw(
              (description as unknown as EditorState)?.getCurrentContent()
            )
          )
        : description;

    if (!descriptionTitle?.trim() || !stripTags(formattedDescription)) {
      return setShowErrorAlertHandler(
        true,
        "Please enter a proposal title and description for save it for later."
      );
    }

    const formattedValues = {
      ...values,
      description: formattedDescription,
      created: new Date().toString(),
      id: uuidv4(),
    };

    if (_proposalId) {
      const proposal = findDraftProposal(_proposalId);
      formattedValues.id = _proposalId;
      saveDraftProposal({
        ...proposal,
        ...formattedValues,
      });
      setShowSuccessAlertHandler(true, "Proposal edited successfully.");
    } else {
      saveDraftProposal(formattedValues);
      setShowSuccessAlertHandler(
        true,
        "Proposal successfully saved for later."
      );
    }
  }, [getValues, setShowSuccessAlertHandler, _proposalId]);

  const appendAction = useCallback(() => {
    append(EMPTY_ACTION);
  }, [append]);

  return {
    minimumVBalance,
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
