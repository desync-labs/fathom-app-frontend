import { FC, memo, MouseEvent } from "react";
import { Box, MenuItem, ToggleButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AppSelect,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { FarmFilterMobileBtn } from "components/AppComponents/AppButton/AppButton";
import {
  FilterLabel,
  VaultFiltersPropsType,
  VaultToggleButtonGroup,
} from "components/Vault/VaultFilters";
import { MobileMenuWrapper } from "components/Dashboard/MobileMenu";
import VaultFilterSrc from "assets/svg/Filter.svg";
import { SelectChangeEvent } from "@mui/material/Select";
import { SortType } from "../../hooks/useVaultList";

const VaultFilterMobileContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

type VaultMobileFiltersPropsType = VaultFiltersPropsType & {
  isMobileFiltersOpen: boolean;
  openMobileFilterMenu: (event: MouseEvent<HTMLElement>) => void;
};

const VaultFiltersMobile: FC<VaultMobileFiltersPropsType> = ({
  isShutdown,
  search,
  sortBy,
  isMobileFiltersOpen,
  handleIsShutdown,
  setSearch,
  setSortBy,
  openMobileFilterMenu,
}) => {
  return (
    <VaultFilterMobileContainer>
      <AppTextField
        id="outlined-helperText"
        placeholder="Search token"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FarmFilterMobileBtn onClick={openMobileFilterMenu}>
        <img src={VaultFilterSrc} alt={"filter icon"} />
      </FarmFilterMobileBtn>
      {isMobileFiltersOpen && (
        <MobileMenuWrapper
          onClick={(e) => e.stopPropagation()}
          sx={{ left: "0", height: "220px" }}
        >
          <Box py={1}>
            <FilterLabel>Filter by</FilterLabel>
            <VaultToggleButtonGroup
              color="primary"
              value={isShutdown}
              exclusive
              onChange={handleIsShutdown}
              aria-label="Platform"
              sx={{ width: "100%", button: { width: "50%" } }}
            >
              <ToggleButton value={false}>Live Now</ToggleButton>
              <ToggleButton value={true}>Finished</ToggleButton>
            </VaultToggleButtonGroup>
          </Box>
          <Box py={1}>
            <FilterLabel>Sort by</FilterLabel>
            <AppSelect
              value={sortBy}
              onChange={(event: SelectChangeEvent<unknown>) => {
                setSortBy(event.target.value as SortType);
              }}
              sx={{ border: "none", fieldset: { borderColor: "transparent" } }}
            >
              <MenuItem value="tvl">TVL</MenuItem>
              <MenuItem value="earned">Earned</MenuItem>
              <MenuItem value="staked">Staked</MenuItem>
            </AppSelect>
          </Box>
        </MobileMenuWrapper>
      )}
    </VaultFilterMobileContainer>
  );
};

export default memo(VaultFiltersMobile);
