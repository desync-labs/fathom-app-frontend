import { styled } from "@mui/material";
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
      <EmbedVideoWrapper>
        <ResponsiveReactPlayer
          url={"/videos/vaults/vault-tutorial.mp4"}
          controls={true}
          width="100%"
          height="100%"
        />
      </EmbedVideoWrapper>
    </>
  );
};

export default VaultTutorial;
