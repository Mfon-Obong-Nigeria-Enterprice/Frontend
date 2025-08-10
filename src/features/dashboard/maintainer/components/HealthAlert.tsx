import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";

interface HealthAlertProps {
  type: "default" | "destructive" | "warning";
  title: string;
  message: string;
}

export function HealthAlert({ type, title, message }: HealthAlertProps) {
  return (
    <Alert variant={type} className="mt-4">
      <BsExclamationTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
