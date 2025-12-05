export const formatTime = (isoString: string | null): string => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDate = (isoString: string | null): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month} ${day} ${year}`;
};

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
