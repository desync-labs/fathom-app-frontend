import { Box, styled, Typography } from "@mui/material";
import ReactPlayer from "react-player";

const EmbedVideoWrapper = styled("div")`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  margin: 1rem 0;

  & iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 70vh;
  }
`;

const VaultTutorial = () => {
  return (
    <Box>
      <Typography variant={"h1"}>Vault Tutorial</Typography>
      <EmbedVideoWrapper>
        <ReactPlayer
          url={"/videos/vaults/vault-tutorial.mp4"}
          controls={true}
          width={"1000px"}
          height={"540px"}
        />
      </EmbedVideoWrapper>
    </Box>
  );
};

export default VaultTutorial;
