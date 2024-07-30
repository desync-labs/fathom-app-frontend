import { Dispatch, FC, memo, SetStateAction } from "react";
import { MenuItem, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import { SortType } from "hooks/Vaults/useVaultList";
import useSharedContext from "context/shared";
import {
  BaseSearchTextField,
  BaseSortSelect,
  SearchFieldLogo,
} from "components/Base/Form/Filters";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";

const SearchFieldWrapper = styled(Box)`
  position: relative;
  width: 50%;
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
  const { isMobile } = useSharedContext();
  return (
    <BaseFlexBox
      sx={{
        justifyContent: "flex-start",
        marginBottom: isMobile ? "0" : "-24px",
      }}
    >
      <SearchFieldWrapper>
        <BaseSearchTextField
          id="outlined-helperText"
          placeholder="Search by Vault, token name or token address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchFieldLogo />
      </SearchFieldWrapper>
      <BaseSortSelect
        value={isShutdown ? "finished" : "live"}
        onChange={(event: SelectChangeEvent<unknown>) => {
          handleIsShutdown(event.target.value !== "live");
        }}
      >
        <MenuItem value={"live"}>Live Now</MenuItem>
        <MenuItem value={"finished"}>Finished</MenuItem>
      </BaseSortSelect>
      <BaseSortSelect
        value={sortBy}
        onChange={(event: SelectChangeEvent<unknown>) => {
          setSortBy(event.target.value as SortType);
        }}
      >
        <MenuItem value="tvl">TVL</MenuItem>
        <MenuItem value="earned">Earned</MenuItem>
        <MenuItem value="staked">Staked</MenuItem>
      </BaseSortSelect>
    </BaseFlexBox>
  );
};

export default memo(VaultFilters);
