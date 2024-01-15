import { Dispatch, FC, memo, SetStateAction } from "react";
import { Grid, ToggleButtonGroup, ToggleButton, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppSelect,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import SearchSrc from "assets/svg/search.svg";
import { SortType } from "hooks/useVaultList";
import { SelectChangeEvent } from "@mui/material/Select";

export const VaultToggleButtonGroup = styled(ToggleButtonGroup)`
  border-radius: 12px;
  padding: 4px;
  background: #132340;
  width: 200px;

  button {
    border: none !important;
    height: 36px;
    text-transform: none;
    font-weight: 600;
    text-align: center;
    color: #fff;
    width: 100px;

    &:hover {
      background: none;
      cursor: pointer;
    }

    &.Mui-selected {
      background: #3d5580;
      border-radius: 8px !important;
      color: #fff;

      &:hover {
        background: #3d5580;
      }
    }
  }
`;

export const FilterLabel = styled("div")`
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  color: #6d86b2;
  text-transform: uppercase;
  padding-bottom: 5px;
`;

const GridSwitcher = styled(Grid)`
  display: flex;
  justify-content: flex-start;
`;

export const StackedLabel = styled("span")`
  font-size: 14px;
  color: #fff;
`;

const VaultFilterContainer = styled(Grid)`
  justify-content: space-between;
  padding-bottom: 55px;
`;

export type VaultFiltersPropsType = {
  isShutdown: boolean;
  search: string;
  sortBy: SortType;
  setIsShutdown: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<SortType>>;
};

const VaultFilters: FC<VaultFiltersPropsType> = ({
  isShutdown,
  search,
  sortBy,
  setIsShutdown,
  setSearch,
  setSortBy,
}) => {
  return (
    <VaultFilterContainer container spacing={2}>
      <Grid item>
        <FilterLabel>Filter by</FilterLabel>
        <VaultToggleButtonGroup
          color="primary"
          value={isShutdown}
          exclusive
          onChange={(event, isShutdown: boolean) => setIsShutdown(isShutdown)}
          aria-label="Platform"
        >
          <ToggleButton value={false}>Live Now</ToggleButton>
          <ToggleButton value={true}>Finished</ToggleButton>
        </VaultToggleButtonGroup>
      </Grid>
      <GridSwitcher item xs={3}>
        <div></div>
      </GridSwitcher>
      <Grid item xs={3}>
        <FilterLabel>Sort by</FilterLabel>
        <AppSelect
          value={sortBy}
          onChange={(event: SelectChangeEvent<unknown>) => {
            setSortBy(event.target.value as SortType);
          }}
          sx={{ border: "none" }}
        >
          <MenuItem value="tvl">TVL</MenuItem>
          <MenuItem value="earned">Earned</MenuItem>
          <MenuItem value="staked">Staked</MenuItem>
        </AppSelect>
      </Grid>
      <Grid item xs={3}>
        <FilterLabel>Search</FilterLabel>
        <AppFormInputWrapper sx={{ margin: 0 }}>
          <AppTextField
            id="outlined-helperText"
            placeholder="Search token"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: "#566E99" }}
          />
          <AppFormInputLogo
            sx={{ top: "10px", left: "9px" }}
            src={SearchSrc}
            alt="search"
          />
        </AppFormInputWrapper>
      </Grid>
    </VaultFilterContainer>
  );
};

export default memo(VaultFilters);
