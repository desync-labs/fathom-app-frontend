import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { AppTextField } from "components/AppComponents/AppForm/AppForm";
import { FarmFilterMobileBtn } from "components/AppComponents/AppButton/AppButton";

import VaultFilterSrc from "assets/svg/Filter.svg";

const VaultFilterMobileContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const VaultFiltersMobile = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <VaultFilterMobileContainer>
      <AppTextField
        id="outlined-helperText"
        placeholder="Search LP"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FarmFilterMobileBtn>
        <img src={VaultFilterSrc} alt={"filter icon"} />
      </FarmFilterMobileBtn>
    </VaultFilterMobileContainer>
  );
};

export default VaultFiltersMobile;
