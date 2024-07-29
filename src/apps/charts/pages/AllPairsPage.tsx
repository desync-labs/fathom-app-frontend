import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { TYPE } from "apps/charts/Theme";
import { useAllPairData } from "apps/charts/contexts/PairData";
import PairList from "apps/charts/components/PairList";
import { PageWrapper, FullWrapper } from "apps/charts/components";
import { RowBetween, AutoRow } from "apps/charts/components/Row";
import Search from "apps/charts/components/Search";
import CheckBox from "apps/charts/components/Checkbox";
import BasePopover from "components/Base/Popover/BasePopover";

const AllPairsPage: FC = () => {
  const allPairs = useAllPairData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const below800 = useMediaQuery("(max-width: 800px)");

  const [useTracked, setUseTracked] = useState(true);

  return (
    <PageWrapper minHeight={"70vh"}>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Top Pairs</TYPE.largeHeader>
          {!below800 && <Search small={true} />}
        </RowBetween>
        <AutoRow gap="4px">
          <CheckBox
            checked={useTracked}
            setChecked={() => setUseTracked(!useTracked)}
            text={"Hide untracked pairs"}
          />
          <BasePopover
            id="untracked_pairs"
            text="USD amounts may be inaccurate in low liquidity pairs or pairs without XDC or stablecoins."
          />
        </AutoRow>
        <PairList
          pairs={allPairs}
          maxItems={50}
          useTracked={useTracked}
          color={"#fff"}
        />
      </FullWrapper>
    </PageWrapper>
  );
};

export default AllPairsPage;
