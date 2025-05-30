import { AlertDialog } from "../ui/alert-dialog";

export interface ErrorAlert {
  title?: string;
  error?: string;
  technicalMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}
export const ErrorAlert = () => {
  return <AlertDialog></AlertDialog>;
};
