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

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);

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

  if (!offset) {
    return new Date(utcDateString).toISOString().substring(11, 16);
  }

  try {
    const date = new Date(utcDateString);
    const utcTime = date.getTime();

    const sign = offset.startsWith("-") ? -1 : 1;
    const parts = offset.replace(/[+-]/, "").split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;

    const shiftedDate = new Date(utcTime + offsetMs);

    return shiftedDate.toISOString().substring(11, 16);
  } catch (error) {
    console.error("Error formatting time with offset", error);
    return "--:--";
  }
};

export const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
