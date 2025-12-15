// export const formatTime = (isoString: string | null): string => {
//   if (!isoString) return "--:--";
//   const date = new Date(isoString);
//   return date.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// export const formatDate = (isoString: string | null): string => {
//   if (!isoString) return "-";
//   const date = new Date(isoString);

//   const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
//   const day = String(date.getDate()).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${month} ${day} ${year}`;
// };

/**
 * Robust date formatter that handles Strings, Dates, and Nulls
 */
export const formatDateDetail = (
  dateInput: string | Date | null | undefined,
) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// src/utils/dateFormatter.ts

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // return date.toLocaleDateString("en-GB", {
  //   month: "short",
  //   day: "2-digit",
  //   year: "numeric",
  // });

  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month} ${day} ${year}`;
};

export const formatTime = (dateString: string | null) => {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toISOString().substring(11, 16);
};

export const formatTimeWithOffset = (
  utcDateString: string | null,
  offset: string | null,
): string => {
  if (!utcDateString) return "--:--";

  // Default to UTC if no offset provided
  if (!offset) {
    return new Date(utcDateString).toISOString().substring(11, 16);
  }

  try {
    // 1. Parse the UTC date
    const date = new Date(utcDateString);
    const utcTime = date.getTime();

    // 2. Parse the offset (e.g. "+02:00" or "-05:30")
    const sign = offset.startsWith("-") ? -1 : 1;
    // Remove sign, split by colon
    const parts = offset.replace(/[+-]/, "").split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // 3. Calculate offset in milliseconds
    const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;

    // 4. Create new date shifted by offset
    const shiftedDate = new Date(utcTime + offsetMs);

    // 5. Return HH:mm
    // We use toISOString() because we manually shifted the epoch to match local time
    return shiftedDate.toISOString().substring(11, 16);
  } catch (error) {
    console.error("Error formatting time with offset", error);
    return "--:--";
  }
};
