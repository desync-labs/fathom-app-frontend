import { FC, memo, ReactNode } from "react";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";

interface ListHeaderProps {
  head: ReactNode[];
}

export const ListHeader: FC<ListHeaderProps> = memo(({ head }) => {
  return (
    <ListHeaderWrapper>
      {head.map((title, i) => (
        <ListColumn overFlow={"visible"} key={i} isRow={i === 0}>
          <ListHeaderTitle>{title}</ListHeaderTitle>
        </ListColumn>
      ))}

      <ListButtonsColumn />
    </ListHeaderWrapper>
  );
});
