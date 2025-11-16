export type Flight = {
  type: "flight";
  airlineCode: "WY";
  id: string;
  airlineLogoUrl: string;
  route?: string; // Optional, as second row in pair doesn't have it
  flightNumber: string;
  flightType: string; // 'J'
  date: string; // 'Nov 06'
  departure: {
    status: string;
    time: string;
    code: string;
  };
  arrival: {
    status: string; // Not explicitly shown, but implied
    time: string;
    code: string;
  };
  statusText: string;
  aircraft: {
    type: string;
    reg: string;
  };
  groundTime?: string;
  pax: number;
};

export type Separator = {
  type: "separator";
  id: string;
};

export type FlightListItem = Flight | Separator;

const OMAN_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Oman_Air_Logo.svg/1200px-Oman_Air_Logo.svg.png";

export const flightsData: FlightListItem[] = [
  {
    type: "flight",
    id: "1",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "ADD-", // Image shows 'ADD-'
    flightNumber: "WY673",
    flightType: "J",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "00:00", code: "ADD" },
    arrival: { status: "Scheduled", time: "02:30", code: "ADA" },
    statusText: "",
    aircraft: { type: "B737-800", reg: "A4O-BAB" },
    pax: 36,
  },
  { type: "separator", id: "sep1" },
  {
    type: "flight",
    id: "2",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-MNL-MCT",
    flightNumber: "WY843",
    flightType: "J",
    date: "Nov 05",
    departure: { status: "Scheduled", time: "09:15", code: "MCT" },
    arrival: { status: "Scheduled", time: "21:30", code: "MNL" },
    statusText: "",
    aircraft: { type: "B787-9", reg: "A4OSC" },
    pax: 260,
  },
  {
    type: "flight",
    id: "3",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "", // Second row in pair has no route
    flightNumber: "WY844",
    flightType: "J",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "07:15", code: "MNL" },
    arrival: { status: "Scheduled", time: "12:00", code: "MCT" },
    statusText: "",
    aircraft: { type: "B787-9", reg: "A4OSC" },
    pax: 243,
  },
  { type: "separator", id: "sep2" },
  {
    type: "flight",
    id: "4",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-JED-MCT",
    flightNumber: "WY673",
    flightType: "J",
    date: "Nov 05",
    departure: { status: "Scheduled", time: "21:30", code: "MCT" },
    arrival: { status: "Scheduled", time: "00:05", code: "JED" },
    statusText: "",
    aircraft: { type: "B737-800", reg: "A4OBAE" },
    pax: 155,
  },
  {
    type: "flight",
    id: "5",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY674",
    flightType: "J",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "00:55", code: "JED" },
    arrival: { status: "Scheduled", time: "04:55", code: "MCT" },
    statusText: "",
    aircraft: { type: "B737-800", reg: "A4OBAE" },
    pax: 0, // Pax is blank in image, using 0
  },
  { type: "separator", id: "sep3" },
  {
    type: "flight",
    id: "6",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-KUL-MCT",
    flightNumber: "WY821",
    flightType: "J",
    date: "Nov 05",
    departure: { status: "Scheduled", time: "21:35", code: "MCT" },
    arrival: { status: "Scheduled", time: "08:10", code: "KUL" },
    statusText: "",
    aircraft: { type: "B787-9", reg: "A4OSJ" },
    pax: 237,
  },
  {
    type: "flight",
    id: "7",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY822",
    flightType: "J",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "09:25", code: "KUL" },
    arrival: { status: "Scheduled", time: "12:10", code: "MCT" },
    statusText: "",
    aircraft: { type: "B787-9", reg: "A4OSJ" },
    pax: 0,
  },
  { type: "separator", id: "sep4" },
  // --- Additional Sample Data Start ---
  {
    type: "flight",
    id: "8",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-DXB-MCT",
    flightNumber: "WY603",
    flightType: "R",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "08:00", code: "MCT" },
    arrival: { status: "Scheduled", time: "09:05", code: "DXB" },
    statusText: "On Time",
    aircraft: { type: "B737-900", reg: "A4O-BAF" },
    pax: 120,
  },
  {
    type: "flight",
    id: "9",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY604",
    flightType: "R",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "10:05", code: "DXB" },
    arrival: { status: "Scheduled", time: "11:10", code: "MCT" },
    statusText: "On Time",
    aircraft: { type: "B737-900", reg: "A4O-BAF" },
    pax: 115,
  },
  { type: "separator", id: "sep5" },
  {
    type: "flight",
    id: "10",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-BOM-MCT",
    flightNumber: "WY201",
    flightType: "T",
    date: "Nov 05",
    departure: { status: "Scheduled", time: "22:55", code: "MCT" },
    arrival: { status: "Scheduled", time: "02:50", code: "BOM" },
    statusText: "",
    aircraft: { type: "A330-200", reg: "A4O-DA" },
    pax: 198,
  },
  {
    type: "flight",
    id: "11",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY202",
    flightType: "T",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "04:10", code: "BOM" },
    arrival: { status: "Scheduled", time: "05:40", code: "MCT" },
    statusText: "",
    aircraft: { type: "A330-200", reg: "A4O-DA" },
    pax: 185,
  },
  { type: "separator", id: "sep6" },
  {
    type: "flight",
    id: "12",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-CDG-MCT",
    flightNumber: "WY131",
    flightType: "L",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "14:20", code: "MCT" },
    arrival: { status: "Scheduled", time: "19:40", code: "CDG" },
    statusText: "Delayed",
    aircraft: { type: "B787-8", reg: "A4O-SA" },
    pax: 205,
  },
  {
    type: "flight",
    id: "13",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY132",
    flightType: "L",
    date: "Nov 06",
    departure: { status: "Scheduled", time: "21:10", code: "CDG" },
    arrival: { status: "Scheduled", time: "06:15", code: "MCT" },
    statusText: "Delayed",
    aircraft: { type: "B787-8", reg: "A4O-SA" },
    pax: 190,
  },
  { type: "separator", id: "sep7" },
  {
    type: "flight",
    id: "14",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "MCT-ZNZ-MCT",
    flightNumber: "WY707",
    flightType: "J",
    date: "Nov 05",
    departure: { status: "Scheduled", time: "15:00", code: "MCT" },
    arrival: { status: "Scheduled", time: "18:25", code: "ZNZ" },
    statusText: "Landed",
    aircraft: { type: "B737-800", reg: "A4O-BAB" },
    pax: 140,
  },
  {
    type: "flight",
    id: "15",
    airlineLogoUrl: OMAN_LOGO,
    airlineCode: "WY",
    route: "",
    flightNumber: "WY708",
    flightType: "J",
    date: "Nov 06",
    departure: { status: "Landed", time: "19:25", code: "ZNZ" },
    arrival: { status: "Landed", time: "01:00", code: "MCT" },
    statusText: "Arrived",
    aircraft: { type: "B737-800", reg: "A4O-BAB" },
    pax: 135,
  },
  // --- Additional Sample Data End ---
];
