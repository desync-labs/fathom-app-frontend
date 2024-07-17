import { Box, styled, Typography } from "@mui/material";
import ReactPlayer from "react-player";

const EmbedVideoWrapper = styled("div")`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
`;

const ResponsiveReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const VaultTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: -50px;
  }
`;

const VaultTutorial = () => {
  return (
    <Box>
      <VaultTitle variant={"h1"}>Vault Tutorial</VaultTitle>
      <EmbedVideoWrapper>
        <ResponsiveReactPlayer
          url={"/videos/vaults/vault-tutorial.mp4"}
          controls={true}
          width="100%"
          height="100%"
        />
      </EmbedVideoWrapper>
    </Box>
  );
};

export default VaultTutorial;
