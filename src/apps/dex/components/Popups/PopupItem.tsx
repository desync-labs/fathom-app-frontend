import { FC, useCallback, useEffect } from "react";
import { useSpring } from "react-spring/web";
import { animated } from "react-spring";
import { Box, styled } from "@mui/material";

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
const Fader = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #43fff6;
`;

const AnimatedFader = animated(Fader);

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

  const faderStyle = useSpring({
    from: { width: "100%" },
    to: { width: "0%" },
    config: { duration: removeAfterMs ?? undefined },
  });

  return (
    <Popup>
      <StyledClose onClick={removeThisPopup} />
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Popup>
  );
};

export default PopupItem;
