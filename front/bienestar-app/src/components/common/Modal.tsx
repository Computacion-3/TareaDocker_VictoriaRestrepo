import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default Modal;
