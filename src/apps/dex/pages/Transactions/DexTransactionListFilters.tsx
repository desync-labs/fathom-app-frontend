import { FC } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import {
  BaseSearchTextField,
  BaseSortSelect,
  SearchFieldLogo,
} from "components/Base/Form/Filters";
import { TXN_TYPE } from "apps/charts/components/TxnList";
import { TXN_KEYS_TYPE } from "apps/dex/hooks/useDexTransactionList";

const SearchFieldWrapper = styled(Box)`
  position: relative;
  width: 100%;
`;

type PositionsTransactionFiltersProps = {
  filterByType: TXN_KEYS_TYPE;
  handleFilterByType: (event: SelectChangeEvent<unknown>) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
};

const DexTransactionListFilters: FC<PositionsTransactionFiltersProps> = ({
  filterByType,
  handleFilterByType,
  searchValue,
  setSearchValue,
}) => {
  const filterOptions = Object.values(TXN_TYPE);
  const filterValues = Object.keys(TXN_TYPE);
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
              : "Search by transaction description or transaction hash"
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

export default DexTransactionListFilters;
