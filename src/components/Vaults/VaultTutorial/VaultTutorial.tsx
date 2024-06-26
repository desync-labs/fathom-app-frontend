import { Box, styled, Typography } from "@mui/material";
import ReactPlayer from "react-player";
import useSharedContext from "context/shared";

const EmbedVideoWrapper = styled("div")`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  overflow: hidden;
  margin: 1rem 0;

  width: 100%;
  height: auto;
  min-height: 540px;
  max-height: 70vh;
`;

const VaultTutorial = () => {
  const { isMobile } = useSharedContext();

  return (
    <Box>
      <Typography variant={"h1"}>Vault Tutorial</Typography>
      <EmbedVideoWrapper>
        <ReactPlayer
          url={"/videos/vaults/vault-tutorial.mp4"}
          controls={true}
          width={isMobile ? "400px" : "1000px"}
          height={isMobile ? "320px" : "540px"}
        />
      </EmbedVideoWrapper>
    </Box>
  );
};

export default VaultTutorial;
