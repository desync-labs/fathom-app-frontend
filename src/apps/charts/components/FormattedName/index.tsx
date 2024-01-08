import { FC, memo, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "apps/charts/components/QuestionHelper";

const TextWrapper = styled.div<{
  margin?: boolean;
  link?: boolean;
  fontSize?: string;
  adjustSize?: boolean;
}>`
  position: relative;
  margin-left: ${({ margin }) => margin && "4px"};
  color: ${({ theme, link }) => (link ? theme.blue : theme.text1)};
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
  margin?: boolean;
  adjustSize?: boolean;
  fontSize?: string;
  link?: boolean;
} & Record<string, any>;

const FormattedName: FC<FormattedNameProps> = (props) => {
  const {
    text,
    maxCharacters,
    Wrapper,
    margin = false,
    adjustSize = false,
    fontSize,
    link,
    ...rest
  } = props;
  const [showHover, setShowHover] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length > maxCharacters) {
    return (
      <Tooltip text={text} show={showHover}>
        <TextWrapper
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
          margin={margin}
          adjustSize={adjustSize}
          link={link}
          fontSize={fontSize}
          {...rest}
        >
          {Wrapper ? (
            <Wrapper>{" " + text.slice(0, maxCharacters - 1) + "..."}</Wrapper>
          ) : (
            " " + text.slice(0, maxCharacters - 1) + "..."
          )}
        </TextWrapper>
      </Tooltip>
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
