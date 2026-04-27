import { log } from "./logger";

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
    log.error("Error formatting time with offset", error);
    return "--:--";
  }
};

export const formatTo24Hour = (
  dateInput: string | Date | null | undefined,
): string => {
  if (!dateInput) return "--:--";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--:--";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getShiftTimeRange = (shiftType: string | null): string => {
  if (!shiftType) return "--:--";

  switch (shiftType.toUpperCase()) {
    case "MORNING":
      return "10:00 - 18:00";
    case "EVENING":
      return "18:00 - 02:00";
    default:
      return "--:--";
  }
};

export const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTodayDate = () => {
  const date = new Date();

  const dayName = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const dayNumber = date.getDate();

  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });

  return `${dayName}, ${dayNumber} ${monthName}`;
};
export const getISOStringWithOffset = (date: Date): string => {
  const tzo = -date.getTimezoneOffset();
  const diff = tzo >= 0 ? "+" : "-";
  const pad = (num: number) => String(num).padStart(2, "0");

  const localISO =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60);

  return localISO;
};

export const formatDurationSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};
