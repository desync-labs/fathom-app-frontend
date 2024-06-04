import { Token } from "into-the-fathom-swap-sdk";

import Modal from "apps/dex/components/Modal";
import { ImportToken } from "apps/dex/components/SearchModal/ImportToken";
import { FC } from "react";

type TokenWarningModalProps = {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
  onDismiss: () => void;
};

const TokenWarningModal: FC<TokenWarningModalProps> = ({
  isOpen,
  tokens,
  onConfirm,
  onDismiss,
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={100}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
};

export default TokenWarningModal;
