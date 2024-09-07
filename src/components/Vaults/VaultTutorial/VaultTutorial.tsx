import { Grid, styled } from "@mui/material";
import ReactPlayer from "react-player";
import BasePageHeader from "components/Base/PageHeader";

const EmbedVideoWrapper = styled("div")`
  position: relative;
  padding-top: 50%;
`;

const ResponsiveReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const VaultTutorial = () => {
  return (
    <>
      <BasePageHeader title={"Vault Tutorial"} />
      <Grid container spacing={3} marginTop={3}>
        <Grid item xs={12} sm={6}>
          <EmbedVideoWrapper>
            <ResponsiveReactPlayer
              url={"/videos/vaults/vault-tutorial.mp4"}
              controls={true}
              width="100%"
              height="100%"
            />
          </EmbedVideoWrapper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <EmbedVideoWrapper>
            <ResponsiveReactPlayer
              url={
                "https://www.youtube.com/embed/AnQbJyvJNk4?si=-k_iRQeh4N6u63ZV"
              }
              controls={true}
              width="100%"
              height="100%"
            />
          </EmbedVideoWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default VaultTutorial;
