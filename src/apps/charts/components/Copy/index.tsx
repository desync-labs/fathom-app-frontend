import styled from "styled-components";
import { useCopyClipboard } from "apps/charts/hooks";
import { CheckCircle, Copy } from "react-feather";
import { StyledIcon } from "apps/charts/components";
import { FC, memo } from "react";

const CopyIcon = styled.div`
  color: #aeaeae;
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 0.5rem;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
`;
const TransactionStatusText = styled.span`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  color: black;
`;

type CopyHelperProps = { toCopy: any };

const CopyHelper: FC<CopyHelperProps> = (props) => {
  const { toCopy } = props;
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <StyledIcon>
            <CheckCircle size={"14"} />
          </StyledIcon>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <StyledIcon>
            <Copy size={"14"} />
          </StyledIcon>
        </TransactionStatusText>
      )}
    </CopyIcon>
  );
};

export default memo(CopyHelper);
