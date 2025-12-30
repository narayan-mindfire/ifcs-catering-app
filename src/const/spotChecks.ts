import { CompletedCheckItem } from "../components/SpotCheck/CompletedCheckListItem";

export const MOCK_COMPLETED_CHECKS: CompletedCheckItem[] = [
  {
    id: "1",
    flight: "WY225",
    route: "MCT-COK",
    departure: "12 01",
    galley: "G1",
    stowage: "103F",
    category: "Atlas Half Size Meal Cart",
    carrier: "B737 Holloware ISC-MEA",
    status: "Pass",
  },
  {
    id: "2",
    flight: "WY225",
    route: "MCT-COK",
    departure: "12 01",
    galley: "G2",
    stowage: "205TF",
    category: "Atlas Small Unit Aluminum",
    carrier: "JC Dry store NB",
    status: "Pass",
  },
  {
    id: "3",
    flight: "WY225",
    route: "MCT-COK",
    departure: "12 01",
    galley: "G3",
    stowage: "401A",
    category: "Atlas Full Size Trolley",
    carrier: "Standard Unit",
    status: "Fail",
  },
];
