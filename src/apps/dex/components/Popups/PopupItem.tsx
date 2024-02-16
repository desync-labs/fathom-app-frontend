import { FC, useCallback, useEffect } from "react";
import { Box, LinearProgress, styled, keyframes } from "@mui/material";

import { PopupContent } from "apps/dex/state/application/actions";
import { useRemovePopup } from "apps/dex/state/application/hooks";
import ListUpdatePopup from "apps/dex/components/Popups/ListUpdatePopup";
import TransactionPopup from "apps/dex/components/Popups/TransactionPopup";

import CloseIcon from "@mui/icons-material/Close";

export const StyledClose = styled(CloseIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
  color: #4f658c;
  cursor: pointer;
`;
export const Popup = styled(Box)`
  display: inline-block;
  width: 100%;
  background-color: #131f35;
  position: relative;
  border-radius: 10px;
  padding: 20px 35px 20px 20px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: 290px;
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  }
`;

const indeterminate1Keyframes = keyframes({
  "0%": {
    left: "0%",
    right: "0%",
  },
  "100%": {
    left: "-35%",
    right: "100%",
  },
});

const LinearProgressStyled = styled(LinearProgress)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: none;

  & .MuiLinearProgress-bar1Indeterminate {
    width: auto;
    animation: ${indeterminate1Keyframes} 15s linear forwards;
  }
  & .MuiLinearProgress-bar2Indeterminate {
    display: none;
  }
`;

type PopupItemProps = {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
};

const PopupItem: FC<PopupItemProps> = ({ removeAfterMs, content, popKey }) => {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);

  let popupContent;
  if ("txn" in content) {
    const {
      txn: { hash, success, summary },
    } = content;
    popupContent = (
      <TransactionPopup hash={hash} success={success} summary={summary} />
    );
  } else if ("listUpdate" in content) {
    const {
      listUpdate: { listUrl, oldList, newList, auto },
    } = content;
    popupContent = (
      <ListUpdatePopup
        popKey={popKey}
        listUrl={listUrl}
        oldList={oldList}
        newList={newList}
        auto={auto}
      />
    );
  }

  return (
    <Popup>
      <StyledClose onClick={removeThisPopup} />
      {popupContent}
      {removeAfterMs !== null ? (
        <LinearProgressStyled variant="indeterminate" />
      ) : null}
    </Popup>
  );
};

export default PopupItem;
