import styled from "styled-components";
import { TYPE } from "apps/charts/Theme";
import { RowFixed } from "apps/charts/components/Row";

const StyleCheckbox = styled.input`
  background: ${({ theme }) => theme.bg2};

  :before {
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

const CheckBox = (props: { checked: any; setChecked: any; text: any }) => {
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

export default CheckBox;
