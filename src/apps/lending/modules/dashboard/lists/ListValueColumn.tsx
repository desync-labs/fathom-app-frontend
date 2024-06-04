import { Box, Tooltip } from "@mui/material";
import { FC, memo, ReactNode } from "react";

import {
  ListColumn,
  ListColumnProps,
} from "apps/lending/components/lists/ListColumn";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";

interface ListValueColumnProps {
  symbol?: string;
  value: string | number;
  subValue?: string | number;
  withTooltip?: boolean;
  capsComponent?: ReactNode;
  disabled?: boolean;
  listColumnProps?: ListColumnProps;
}

const Content: FC<ListValueColumnProps> = memo(
  ({ value, withTooltip, subValue, disabled, capsComponent }) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormattedNumber
            value={value}
            variant="secondary14"
            sx={{ mb: !withTooltip && !!subValue ? "2px" : 0 }}
            color={disabled ? "text.disabled" : "text.light"}
            data-cy={`nativeAmount`}
          />
          {capsComponent}
        </Box>

        {!withTooltip && !!subValue && !disabled && (
          <FormattedNumber
            value={subValue}
            symbol="USD"
            variant="secondary12"
            color="text.secondary"
          />
        )}
      </>
    );
  }
);

export const ListValueColumn: FC<ListValueColumnProps> = memo(
  ({
    symbol,
    value,
    subValue,
    withTooltip,
    capsComponent,
    disabled,
    listColumnProps = {},
  }) => {
    return (
      <ListColumn {...listColumnProps}>
        {withTooltip ? (
          <Tooltip
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FormattedNumber
                  value={subValue || 0}
                  symbol="USD"
                  variant="secondary14"
                  sx={{ mb: "2px" }}
                  compact={false}
                  color="text.light"
                  symbolsColor="text.light"
                />
                <FormattedNumber
                  value={value}
                  variant="secondary12"
                  symbol={symbol}
                  compact={false}
                  color="text.light"
                  symbolsColor="text.light"
                />
              </Box>
            }
            arrow
            placement="top"
            sx={{ maxWidth: "none" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Content
                symbol={symbol}
                value={value}
                subValue={subValue}
                capsComponent={capsComponent}
                disabled={disabled}
                withTooltip={withTooltip}
              />
            </Box>
          </Tooltip>
        ) : (
          <Content
            symbol={symbol}
            value={value}
            subValue={subValue}
            capsComponent={capsComponent}
            disabled={disabled}
            withTooltip={withTooltip}
          />
        )}
      </ListColumn>
    );
  }
);
