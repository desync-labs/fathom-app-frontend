import useMetaMask from "hooks/metamask";
import {
  LogLevel,
  useLogger
} from "../helpers/Logger";
import { useStores } from "../stores";
import {
  useEffect,
  useState
} from "react";


export const useAllProposals = () => {
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const { proposalStore } = useStores();
  const [fetchProposalsPending, setFetchProposalsPending] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [time, setTime] = useState<string>("all");
  const [proposals, setProposals] = useState<string>("all");
  const [createProposal, setCreateProposal] = useState<boolean>(false);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        logger.log(LogLevel.info, "fetching proposal information.");
        setFetchProposalsPending(true)
        proposalStore.fetchProposals(account).finally(() => {
          setFetchProposalsPending(false)
        });
      });
    } else {
      proposalStore.setProposals([]);
    }
  }, [account, logger, proposalStore, chainId, setFetchProposalsPending]);

  return {
    fetchProposalsPending,
    search,
    setSearch,
    time,
    setTime,
    proposals,
    setProposals,
    createProposal,
    setCreateProposal,
    fetchedProposals: proposalStore.fetchedProposals
  }
}

