import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { AppTextField } from "components/AppComponents/AppForm/AppForm";
import { FarmFilterMobileBtn } from "components/AppComponents/AppButton/AppButton";

import FarmFilterSrc from 'assets/svg/Filter.svg';

const FarmFilterMobileContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`

const FarmFiltersMobile = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <FarmFilterMobileContainer>
      <AppTextField
        id="outlined-helperText"
        placeholder="Search LP"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FarmFilterMobileBtn>
        <img src={FarmFilterSrc} alt={'filter icon'} />
      </FarmFilterMobileBtn>
    </FarmFilterMobileContainer>
  )
}

export default FarmFiltersMobile;