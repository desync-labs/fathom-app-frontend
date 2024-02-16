import { Box, styled } from "@mui/material";
import { useActivePopups } from "apps/dex/state/application/hooks";
import { AutoColumn } from "apps/dex/components/Column";
import PopupItem from "apps/dex/components/Popups/PopupItem";
import { useURLWarningVisible } from "apps/dex/state/user/hooks";

const MobilePopupWrapper = styled(Box)<{ height: string | number }>`
  position: relative;
  display: none;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? "0 auto;" : 0)};
  margin-bottom: ${({ height }) => (height ? "20px" : 0)};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: block;
  }
`;

const MobilePopupInner = styled(Box)`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FixedPopupColumn = styled(AutoColumn)<{ extraPadding: boolean }>`
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? "108px" : "88px")};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 3;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const Popups = () => {
  // get all popups
  const activePopups = useActivePopups();

  const urlWarningActive = useURLWarningVisible();

  return (
    <>
      <FixedPopupColumn
        gap="20px"
        extraPadding={urlWarningActive}
        data-testid="dex-fixedPopupColumn"
      >
        {activePopups.map((item) => (
          <PopupItem
            key={item.key}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper
        height={activePopups?.length > 0 ? "fit-content" : 0}
        data-testid="dex-mobilePopupWrapper"
      >
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map((item) => (
              <PopupItem
                key={item.key}
                content={item.content}
                popKey={item.key}
                removeAfterMs={item.removeAfterMs}
              />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  );
};

export default Popups;
