import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface PoolProps {
    pool: ICollatralPool;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function CustomizedDialogs(this: any, props: PoolProps) {
  const [open, setOpen] = React.useState(false);
  const [collatral, setCollatral] = React.useState(0);
  const [fathomToken, setFathomToken] = React.useState(0);

  let positionStore = useStores().positionStore;
  const { account } = useMetaMask()!

  const openNewPosition = () => {
    positionStore.openPosition(account,props.pool.id,collatral,fathomToken)
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCollatralTextFieldChange = (e:any) => {
    setCollatral(e.target.value)
  }

  const handlefathomTokenTextFieldChange = (e:any) => {
    setFathomToken(e.target.value)
  }
  

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open New Position
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Open New Position
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Create a new position for {props.pool.name} Pool to get guranteed return on your collatral.Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </Typography>
          <TextField
          id="outlined-helperText"
          label="Collatral Value"
          defaultValue="Default Value"
          helperText="Enter the collatral."
          sx={{ m: 3 }}
          value={collatral}
          onChange={handleCollatralTextFieldChange}
         />
          <TextField
          id="outlined-helperText"
          label="Fathom Token"
          defaultValue="Default Value"
          helperText="Enter the desired fathom token."
          sx={{ m: 3 }}
          value={fathomToken}
          onChange={handlefathomTokenTextFieldChange}
         />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={openNewPosition}>
            Open
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}