export interface StowageItem {
  id: string;
  stowage: string;
  carrier: string;
}

export const stowageData: StowageItem[] = [
  { id: "1", stowage: "101T", carrier: "JC Headsets X12" },
  { id: "2", stowage: "101B", carrier: "Ice" },
  { id: "3", stowage: "103F", carrier: "B737 Holloware ISC-MEA" },
  { id: "4", stowage: "104", carrier: "JC ISC - MEA NB Spare" },
  { id: "5", stowage: "204", carrier: "JC Oven" },
  { id: "6", stowage: "205TF", carrier: "JC Dry store NB" },
  { id: "7", stowage: "207F", carrier: "YC 2nd Service" },
  { id: "8", stowage: "208F", carrier: "WC 737 Bulk Food" },
  { id: "9", stowage: "209R", carrier: "JC 2nd Srv WC" },
  { id: "10", stowage: "402", carrier: "EY Amenites B737" },
  { id: "11", stowage: "404", carrier: "Dry Store" },
  { id: "12", stowage: "405", carrier: "EY Dry Store B737 405" },
];
