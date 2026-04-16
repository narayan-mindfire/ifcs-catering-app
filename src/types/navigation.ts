export type RootStackParamList = {
  Login: undefined;
  Dashboard: { selectedTaskId?: string; selectedDate?: string } | undefined;
  SpotCheck:
    | { flightId: string; initialTab?: "required" | "completed" }
    | undefined;
  SpotCheckDetails: { checkId: string; title: string; flightId: string };
  Flights: { flightId: string };
  Memos: undefined;
  MemoDetail: { memoId: string; showVersion?: boolean };
  Documents: undefined;
  CreateMemo: undefined;
  FlightDetails: {
    flightId: string;
    flightNumber: string;
    route: string;
    date: string;
    fromDashboard?: boolean;
    taskId?: string;
    taskDate?: string;
    openDriverDeclaration?: boolean;
    selectedDeliveryId?: string;
  };
  SpotCheckSelection: undefined;
  QRCodeScanner: {
    title?: string;
    subtitle?: string;
    continuous: boolean;
    onClose?: () => void;
  };
};
