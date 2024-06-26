import { Dispatch, FC, memo, SetStateAction } from "react";
import { MenuItem, Box, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import { SortType } from "hooks/Vaults/useVaultList";
import {
  AppFormInputLogo,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

import SearchSrc from "assets/svg/search.svg";

const SearchFieldWrapper = styled(Box)`
  position: relative;
  width: 50%;
`;

const SearchTextField = styled(AppTextField)`
  input {
    background: #091433;
    height: 38px;
    color: #8ea4cc;
    border: 1px solid #3d5580;
  }
`;

const SortSelect = styled(Select)`
  width: auto;
  height: 40px;
  min-width: 100px;
  background: #091433;
  border: 1px solid #3d5580 !important;
  border-radius: 8px;

  & .MuiSelect-select {
    background-color: transparent !important;
  }

  &:hover,
  &:focus {
    border: 1px solid #5a81ff;
    box-shadow: 0 0 8px #003cff;
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #5a81ff !important;
    box-shadow: 0 0 8px #003cff !important;
  }
  fieldset {
    border: none !important;
    outline: none !important;
  }
`;

export type VaultFiltersPropsType = {
  isShutdown: boolean;
  search: string;
  sortBy: SortType;
  handleIsShutdown: (value: boolean) => void;
  setSearch: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<SortType>>;
};

const VaultFilters: FC<VaultFiltersPropsType> = ({
  isShutdown,
  search,
  sortBy,
  handleIsShutdown,
  setSearch,
  setSortBy,
}) => {
  return (
    <AppFlexBox sx={{ justifyContent: "flex-start", marginBottom: "16px" }}>
      <SearchFieldWrapper>
        <SearchTextField
          id="outlined-helperText"
          placeholder="Search by Vault, token name or token address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AppFormInputLogo
          sx={{ top: "10px", left: "9px" }}
          src={SearchSrc}
          alt="search"
        />
      </SearchFieldWrapper>
      <SortSelect
        value={isShutdown ? "finished" : "live"}
        onChange={(event: SelectChangeEvent<unknown>) => {
          handleIsShutdown(event.target.value !== "live");
        }}
      >
        <MenuItem value={"live"}>Live Now</MenuItem>
        <MenuItem value={"finished"}>Finished</MenuItem>
      </SortSelect>
      <SortSelect
        value={sortBy}
        onChange={(event: SelectChangeEvent<unknown>) => {
          setSortBy(event.target.value as SortType);
        }}
      >
        <MenuItem value="tvl">TVL</MenuItem>
        <MenuItem value="earned">Earned</MenuItem>
        <MenuItem value="staked">Staked</MenuItem>
      </SortSelect>
    </AppFlexBox>
  );
};

export default memo(VaultFilters);
