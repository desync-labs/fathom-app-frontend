import { useState, useEffect, FC, memo } from "react";
import styled from "styled-components";
import { isAddress } from "apps/charts/utils";

const BAD_IMAGES = {};

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`;

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.075);
`;

type TokenLogoProps = {
  address: string;
  header?: boolean;
  size?: string;
} & Record<string, any>;

const TokenLogo: FC<TokenLogoProps> = (props) => {
  const { address, size = "24px", ...rest } = props;
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [address]);

  if (error || (BAD_IMAGES as any)[address]) {
    return (
      <Inline>
        <span {...rest} style={{ fontSize: size }} role="img" aria-label="face">
          🤔
        </span>
      </Inline>
    );
  }

  const path = `https://raw.githubusercontent.com/Into-the-Fathom/assets/master/blockchains/xinfin/${isAddress(
    address
  )}/logo.png`;

  return (
    <Inline>
      <Image
        {...rest}
        alt={""}
        src={path}
        size={size}
        onError={(event) => {
          (BAD_IMAGES as any)[address] = true;
          setError(true);
          event.preventDefault();
        }}
      />
    </Inline>
  );
};

export default memo(TokenLogo);
