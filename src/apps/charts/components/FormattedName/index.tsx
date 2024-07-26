import { FC, memo } from "react";
import { Box, styled } from "@mui/material";
import BasePopover from "components/Base/Popover/BasePopover";

const TextWrapper = styled(Box)<{
  link?: boolean;
  fontSize?: string;
  adjustSize?: boolean;
}>`
  position: relative;
  color: #fafafa;
  font-size: ${({ fontSize }) => fontSize ?? "inherit"};

  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    font-size: ${({ adjustSize }) => adjustSize && "12px"};
  }
`;

type FormattedNameProps = {
  text: string;
  maxCharacters: number;
  Wrapper?: any;
  margin?: string;
  adjustSize?: boolean;
  fontSize?: string;
  link?: boolean;
} & Record<string, any>;

const FormattedName: FC<FormattedNameProps> = (props) => {
  const {
    text,
    maxCharacters,
    Wrapper,
    margin,
    adjustSize = false,
    fontSize,
    link,
    ...rest
  } = props;

  if (!text) {
    return null;
  }

  if (text.length > maxCharacters) {
    return (
      <BasePopover
        id={"help_text"}
        text={text}
        element={
          <TextWrapper
            margin={margin}
            adjustSize={adjustSize}
            link={link}
            fontSize={fontSize}
            {...rest}
          >
            {Wrapper ? (
              <Wrapper>
                {" " + text.slice(0, maxCharacters - 1) + "..."}
              </Wrapper>
            ) : (
              " " + text.slice(0, maxCharacters - 1) + "..."
            )}
          </TextWrapper>
        }
      />
    );
  }

  return (
    <TextWrapper
      margin={margin}
      adjustSize={adjustSize}
      link={link}
      fontSize={fontSize}
      {...rest}
    >
      {Wrapper ? <Wrapper>{text}</Wrapper> : text}
    </TextWrapper>
  );
};

export default memo(FormattedName);
