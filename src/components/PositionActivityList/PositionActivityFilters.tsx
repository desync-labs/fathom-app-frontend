import { FC } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { Grid, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  FilterTxType,
  FilterTxTypeKeys,
} from "hooks/usePositionsTransactionList";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppSelect,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import SearchSrc from "assets/svg/search.svg";

const FilterLabel = styled("div")`
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  color: #6d86b2;
  text-transform: uppercase;
  padding-bottom: 5px;
`;

type PositionsTransactionFiltersProps = {
  filterByType: FilterTxTypeKeys;
  handleFilterByType: (event: SelectChangeEvent<unknown>) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
};

const PositionActivityFilters: FC<PositionsTransactionFiltersProps> = ({
  filterByType,
  handleFilterByType,
  searchValue,
  setSearchValue,
}) => {
  const filterOptions = Object.values(FilterTxType);
  const filterValues = Object.keys(FilterTxType);

  return (
    <Grid container spacing={2} py={3}>
      <Grid item xs={6} md={3}>
        <FilterLabel>Filter by tx type</FilterLabel>
        <AppSelect value={filterByType} onChange={handleFilterByType}>
          {filterOptions.map((option, index) => (
            <MenuItem key={option} value={filterValues[index]}>
              {option}
            </MenuItem>
          ))}
        </AppSelect>
      </Grid>
      <Grid item xs={6} md={3}>
        <FilterLabel>Search</FilterLabel>
        <AppFormInputWrapper sx={{ margin: 0 }}>
          <AppTextField
            id="outlined-helperText"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ color: "#566E99" }}
          />
          <AppFormInputLogo
            sx={{ top: "10px", left: "9px" }}
            src={SearchSrc}
            alt="search"
          />
        </AppFormInputWrapper>
      </Grid>
    </Grid>
  );
};

export default PositionActivityFilters;
