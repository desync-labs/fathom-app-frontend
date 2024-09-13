import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import useSyncContext from "context/sync";

import {
  ActionType,
  CreateProposalType,
} from "hooks/Governance/useCreateProposal";

import { stripTags } from "utils/htmlToComponent";
import { ZERO_ADDRESS } from "utils/Constants";
import { findDraftProposal } from "utils/draftProposal";

const useProposalDraftItem = () => {
  const { _proposalId } = useParams();
  const [draftProposal, setDraftProposal] = useState<CreateProposalType>(
    {} as CreateProposalType
  );
  const [notAllowTimestamp, setNotAllowTimestamp] = useState<string>("0");

  const [vBalance, setVBalance] = useState<null | string>(null);
  const [vBalanceError, setVBalanceError] = useState<boolean>(false);
  const [minimumVBalance, setMinimumVBalance] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteProposal, setDeleteProposal] = useState<boolean>(false);

  const { proposalService } = useServices();
  const { account } = useConnector();
  const { setShowSuccessAlertHandler, setShowErrorAlertHandler } =
    useAlertAndTransactionContext();
  const { setLastTransactionBlock } = useSyncContext();
  const navigate = useNavigate();

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
    const draftProposal = findDraftProposal(_proposalId as string);

    setDraftProposal(draftProposal);
  }, [setDraftProposal, _proposalId]);

  const onClose = useCallback(() => {
    setShowSuccessAlertHandler(true, "Proposal created successfully");
    navigate("/dao/governance");
  }, [navigate]);

  const onSubmit = useCallback(async () => {
    const { descriptionTitle, description, withAction, actions } =
      draftProposal;

    if (!descriptionTitle || !stripTags(description)) {
      return setShowErrorAlertHandler(
        true,
        "For create proposal you need to fill title and description."
      );
    }

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
      return setShowErrorAlertHandler(
        true,
        "You have no enough voting power for create proposal."
      );
    }

    setIsLoading(true);
    try {
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
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [
    draftProposal,
    vBalance,
    minimumVBalance,
    notAllowTimestamp,
    account,
    proposalService,
    onClose,
    setLastTransactionBlock,
    setVBalanceError,
  ]);

  return {
    deleteProposal,
    setDeleteProposal,
    onSubmit,
    isLoading,
    vBalanceError,
    _proposalId,
    draftProposal,
  };
};

export default useProposalDraftItem;
