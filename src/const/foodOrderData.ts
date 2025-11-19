export interface FoodOrderItem {
  id: string;
  station: string;
  flightNumber: string;
  sku: string;
  cabin: string;
  mealName: string;
  ordered: number;
  distributed: number;
  loaded: number;
}

// --- Mock Data based on your Image ---
export const foodOrderData: FoodOrderItem[] = [
  {
    id: "1",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "ECO Beef Lasagnette",
    ordered: 2,
    distributed: 1,
    loaded: 2,
  },
  {
    id: "2",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "ECO Beef Lasagnette",
    ordered: 1,
    distributed: 0,
    loaded: 1,
  },
  {
    id: "3",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "ECO Beef Lasagnette",
    ordered: 4,
    distributed: 2,
    loaded: 4,
  },
  {
    id: "4",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "ECO Beef Lasagnette",
    ordered: 3,
    distributed: 1,
    loaded: 3,
  },
  {
    id: "5",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "ECO Beef Lasagnette",
    ordered: 8,
    distributed: 3,
    loaded: 8,
  },
  // Duplicates to test scrolling
  {
    id: "6",
    station: "MCT",
    flightNumber: "405",
    sku: "1046",
    cabin: "Bistro",
    mealName: "Chicken Biryani",
    ordered: 2,
    distributed: 2,
    loaded: 2,
  },
  {
    id: "7",
    station: "MCT",
    flightNumber: "405",
    sku: "1048",
    cabin: "Bistro",
    mealName: "Veg Pasta",
    ordered: 1,
    distributed: 0,
    loaded: 1,
  },
];
