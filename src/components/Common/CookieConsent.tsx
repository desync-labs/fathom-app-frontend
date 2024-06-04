import { Snackbar, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";
import Link from "@mui/material/Link";

const StyledSnackbar = styled(Snackbar)`
  & .MuiSnackbarContent-root {
    border-radius: 16px;
    border: 1px solid #2c4066;
    background: #132340;
    max-width: 600px;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.14px;
    padding: 16px;
  }

  & .MuiSnackbarContent-action {
    gap: 8px;
    margin-right: 0;

    & button {
      height: 36px;
      font-size: 13px;
      line-height: 16px;
      font-weight: bold;
      padding: 0 16px;
    }
  }
`;

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setOpen(false);
  };

  return (
    <StyledSnackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      message={
        <Typography variant="body2">
          This site uses cookies to deliver its service and to analyse traffic.
          By browsing this site, you accept the{" "}
          <Link href={"https://docs.fathom.fi/privacy-policy"} target="_blank">
            privacy policy
          </Link>
          .
        </Typography>
      }
      action={
        <>
          <ButtonPrimary onClick={handleAccept} size="small">
            Accept
          </ButtonPrimary>
          <ButtonSecondary onClick={handleDecline} size="small">
            Reject
          </ButtonSecondary>
        </>
      }
    />
  );
};

export default CookieConsent;
