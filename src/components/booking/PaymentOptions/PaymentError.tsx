import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentErrorProps {
  error: string | null;
}

export const PaymentError = ({ error }: PaymentErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};