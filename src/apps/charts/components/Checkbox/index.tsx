import { FC, memo } from "react";
import { styled } from "@mui/material";
import { TYPE } from "apps/charts/Theme";
import { RowFixed } from "apps/charts/components/Row";

const StyleCheckbox = styled("input")`
  background: transparent;
  border: 1px solid #253656;

  :checked {
    background: #f35429;
  }

  :hover {
    cursor: pointer;
  }
`;

const ButtonText = styled(TYPE.main)`
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
`;

type CheckBoxProps = { checked: boolean; setChecked: any; text: string };

const CheckBox: FC<CheckBoxProps> = (props) => {
  const { checked, setChecked, text } = props;
  return (
    <RowFixed>
      <StyleCheckbox
        name="checkbox"
        type="checkbox"
        checked={checked}
        onChange={setChecked}
      />
      <ButtonText ml={"4px"} onClick={setChecked}>
        {text}
      </ButtonText>
    </RowFixed>
  );
};

export default memo(CheckBox);
