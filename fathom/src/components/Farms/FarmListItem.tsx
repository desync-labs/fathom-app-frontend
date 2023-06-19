import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { TableCell } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";

const FarmListItemPoolCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 20px;
  img.bigger {
    border-radius: 16px;
    width: 32px;
    height: 32px;
    margin-left: -10px;
    margin-top: 10px;
  } 
  img.smaller {
    width: 24px;
    height: 24px;
  }
`

const FarmListItemImageWrapper = styled('div')`
  display: flex;
  justify-content: left;
`

const FarmInfo = styled('div')`
  
`

const FarmTitle = styled('div')`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`

const FarmDescription = styled('div')`
  color: #9FADC6;
  font-size: 14px;
  line-height: 20px;
`

const FarmListItem = () => {
  return (
    <AppTableRow>
      <FarmListItemPoolCell>
        <FarmListItemImageWrapper>
          <img className={'smaller'} src={getTokenLogoURL('WXDC')} alt={'WXDC'} />
          <img className={'bigger'} src={getTokenLogoURL('FXD')} alt={'FXD'} />
        </FarmListItemImageWrapper>
        <FarmInfo>
          <FarmTitle>XDC - FXD</FarmTitle>
          <FarmDescription>LP</FarmDescription>
        </FarmInfo>
      </FarmListItemPoolCell>
    </AppTableRow>
  )
}

export default FarmListItem