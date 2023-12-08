import { Token } from "into-the-fathom-swap-sdk";

import Modal from "apps/dex/components/Modal";
import { ImportToken } from "apps/dex/components/SearchModal/ImportToken";

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
  onDismiss,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={100}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
}
