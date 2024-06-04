import { Box } from "@mui/material";
import { FC, memo, ReactNode } from "react";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Row } from "apps/lending/components/primitives/Row";

interface ListValueRowProps {
  title: ReactNode;
  capsComponent?: ReactNode;
  value: string | number;
  subValue: string | number;
  disabled?: boolean;
}

export const ListValueRow: FC<ListValueRowProps> = memo(
  ({ title, capsComponent, value, subValue, disabled }) => {
    return (
      <Row
        caption={title}
        captionVariant="description"
        captionColor="primary.light"
        align="flex-start"
        mb={1}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.25 }}>
            <FormattedNumber
              value={value}
              variant="secondary14"
              color={disabled ? "text.disabled" : "primary.light"}
            />
            {capsComponent}
          </Box>

          {!disabled && (
            <FormattedNumber
              value={subValue}
              variant="secondary12"
              color="text.secondary"
              symbol="USD"
              mb={0.25}
            />
          )}
        </Box>
      </Row>
    );
  }
);
