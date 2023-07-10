import {
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  MenuItem
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppSelect,
  AppTextField
} from "components/AppComponents/AppForm/AppForm";
import SearchSrc from "assets/svg/search.svg";

const FarmToggleButtonGroup = styled(ToggleButtonGroup)`
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
      background: #3D5580;
      border-radius: 8px !important;
      color: #fff;

      &:hover {
        background: #3D5580;
      }
    }
  }
`;

const FilterLabel = styled("div")`
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  color: #6D86B2;
  text-transform: uppercase;
  padding-bottom: 5px;
`;

const GridSwitcher = styled(Grid)`
  display: flex;
  justify-content: right;
`;

const StackedLabel = styled("span")`
  font-size: 14px;
  color: #fff;
`;

const FarmFilterContainer = styled(Grid)`
  padding-bottom: 55px;
`

const FarmFilters = () => {
  const [farmType, setFarmType] = useState<string>("live");
  const [showStacked, setShowStacked] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  return (
    <FarmFilterContainer container spacing={2}>
      <Grid item xs={2}>
        <FilterLabel>Filter by</FilterLabel>
        <FarmToggleButtonGroup
          color="primary"
          value={farmType}
          exclusive
          onChange={(event, farmType: string) => setFarmType(farmType)}
          aria-label="Platform"
        >
          <ToggleButton value="live">Live Now</ToggleButton>
          <ToggleButton value="finished">Finished</ToggleButton>
        </FarmToggleButtonGroup>
      </Grid>
      <GridSwitcher item xs={2}>
        <div>
          <FilterLabel>Show only</FilterLabel>
          <Switch onChange={() => setShowStacked(!showStacked)} checked={showStacked} />
          <StackedLabel>Stacked</StackedLabel>
        </div>
      </GridSwitcher>
      <Grid item xs={2}></Grid>
      <Grid item xs={3}>
        <FilterLabel>Sort by</FilterLabel>
        <AppSelect
          value={sortBy}
          // @ts-ignore
          onChange={(event: SelectChangeEvent) => {
            setSortBy(event.target.value);
          }}
        >
          <MenuItem value="all">All time</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
        </AppSelect>
      </Grid>
      <Grid item xs={3}>
        <FilterLabel>Search</FilterLabel>
        <AppFormInputWrapper sx={{ margin: 0 }}>
          <AppTextField
            id="outlined-helperText"
            placeholder="Search LP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AppFormInputLogo
            sx={{ top: "10px", left: "9px" }}
            src={SearchSrc}
            alt="search"
          />
        </AppFormInputWrapper>
      </Grid>
    </FarmFilterContainer>
  );
};

export default FarmFilters;