import { Box, styled, Typography } from "@mui/material";

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
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/gGhBAL4SyHo?si=G568oJvrvkuZsolL"
          title="Fathom Vault Tutorial"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </EmbedVideoWrapper>
    </Box>
  );
};

export default VaultTutorial;
