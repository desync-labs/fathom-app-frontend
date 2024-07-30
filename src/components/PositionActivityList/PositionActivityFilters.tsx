import { FC } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FilterTxType,
  FilterTxTypeKeys,
} from "hooks/Pools/usePositionsTransactionList";
import useSharedContext from "context/shared";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import {
  BaseSearchTextField,
  BaseSortSelect,
  SearchFieldLogo,
} from "components/Base/Form/Filters";

const SearchFieldWrapper = styled(Box)`
  position: relative;
  width: 100%;
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
  const { isMobile } = useSharedContext();

  return (
    <BaseFlexBox
      sx={{
        justifyContent: "stretch",
        marginBottom: isMobile ? "-10px" : "-24px",
      }}
    >
      <SearchFieldWrapper>
        <BaseSearchTextField
          id="outlined-helperText"
          placeholder={
            isMobile
              ? "Search"
              : "Search by Pool symbol, collateral address or transaction hash"
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <SearchFieldLogo />
      </SearchFieldWrapper>
      <BaseSortSelect
        autoWidth
        value={filterByType}
        onChange={handleFilterByType}
        sx={{ minWidth: isMobile ? "40%" : "210px" }}
      >
        {filterOptions.map((option, index) => (
          <MenuItem key={option} value={filterValues[index]}>
            {option}
          </MenuItem>
        ))}
      </BaseSortSelect>
    </BaseFlexBox>
  );
};

export default PositionActivityFilters;
