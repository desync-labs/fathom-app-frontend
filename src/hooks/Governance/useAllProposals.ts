import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSALS, GOVERNANCE_STATS } from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { useLocation } from "react-router-dom";

export enum ProposalsTabs {
  PROPOSALS = "proposals",
  DRAFTS = "drafts",
}

export const useAllProposals = () => {
  const { chainId } = useConnector();
  const [search, setSearch] = useState<string>("");
  const [time, setTime] = useState<string>("all");
  const [proposals, setProposals] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tab, setTab] = useState<ProposalsTabs>(ProposalsTabs.PROPOSALS);
  const [draftProposals, setDraftProposals] = useState<any[]>([]);

  const { syncDao, prevSyncDao } = useSyncContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data,
    loading: proposalsLoading,
    refetch,
    fetchMore,
  } = useQuery(GOVERNANCE_PROPOSALS, {
    variables: {
      first: COUNT_PER_PAGE,
      skip: 0,
    },
    context: { clientName: "governance", chainId },
  });

  const location = useLocation();

  const {
    data: stats,
    loading: statsLoading,
    refetch: statsRefetch,
  } = useQuery(GOVERNANCE_STATS, {
    context: { clientName: "governance", chainId },
  });

  const refetchProposals = useCallback(() => {
    refetch({
      first: COUNT_PER_PAGE,
      skip: 0,
    });

    statsRefetch();
    setCurrentPage(1);
  }, [refetch, statsRefetch]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchProposals();
    }
  }, [syncDao, prevSyncDao, refetchProposals]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(statsLoading || proposalsLoading);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [statsLoading, proposalsLoading, setIsLoading]);

  useEffect(() => {
    const drafts = localStorage.getItem("draftProposals") || "[]";
    setDraftProposals(JSON.parse(drafts));
  }, [setDraftProposals]);

  useEffect(() => {
    if (location.pathname.includes("drafts")) {
      setTab(ProposalsTabs.DRAFTS);
    } else {
      setTab(ProposalsTabs.PROPOSALS);
    }
  }, [location, setTab]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      setIsLoading(true);
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
        },
      }).then(() => {
        setIsLoading(false);
      });
      setCurrentPage(page);
    },
    [setCurrentPage, fetchMore, setIsLoading]
  );

  return {
    isLoading,
    search,
    setSearch,
    time,
    setTime,
    proposals,
    setProposals,
    fetchedProposals: isLoading ? [] : data.proposals,
    currentPage,
    draftProposals,
    itemsCount:
      statsLoading || !stats || !stats.governanceStats.length
        ? 0
        : stats.governanceStats[0].totalProposalsCount,
    handlePageChange,
    tab,
    setTab,
  };
};
