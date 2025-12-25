import { z } from "zod";

const nameRegex = /^[a-zA-Z\s'-]+$/;
const nameErrorMsg = "Name must contain only letters, space";
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const alphanumericErrorMsg =
  "Must contain only letters and numbers (no spaces or symbols)";

// --- Crew Compliance Schema ---
export const crewComplianceSchema = z.object({
  airCrewRepresentative: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .regex(nameRegex, nameErrorMsg),

  crewName: z
    .string()
    .trim()
    .min(2, "Crew Name must be at least 2 characters")
    .regex(nameRegex, nameErrorMsg),

  staffNumber: z
    .string()
    .trim()
    .min(1, "Staff Number is required")
    .max(20, "Staff Number is too long")
    .regex(alphanumericRegex, alphanumericErrorMsg),

  signature: z.string().min(1, "Signature is required"),
  isCompliant: z.boolean().optional(),
});

export type CrewComplianceSchema = z.infer<typeof crewComplianceSchema>;

// --- Driver Declaration Schema ---
export const driverDeclarationSchema = z.object({
  driverName: z
    .string()
    .trim()
    .min(2, "Driver Name must be at least 2 characters")
    .regex(nameRegex, nameErrorMsg),

  driverStaffId: z
    .string()
    .trim()
    .min(1, "Staff ID is required")
    .max(20, "Staff ID is too long")
    .regex(alphanumericRegex, alphanumericErrorMsg),

  truckSeal: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9-]+$/.test(val), {
      message: "Truck Seal allows only letters, numbers, and hyphens",
    }),

  driverCompany: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  signature: z.string().min(1, "Signature is required"),
  sealIntact: z.boolean().optional(),
});

export type DriverDeclarationSchema = z.infer<typeof driverDeclarationSchema>;

// --- Security Compliance Schema ---
export const securityComplianceSchema = z.object({
  provider: z
    .string()
    .trim()
    .min(2, "Provider name must be at least 2 characters"),

  name: z
    .string()
    .trim()
    .min(2, "Security Name must be at least 2 characters")
    .regex(nameRegex, nameErrorMsg),

  staffNumber: z
    .string()
    .trim()
    .min(1, "Staff Number is required")
    .regex(alphanumericRegex, alphanumericErrorMsg),

  position: z.string().trim().optional().or(z.literal("")),
  signature: z.string().min(1, "Signature is required"),
  isCompliant: z.boolean().optional(),
});

export type SecurityComplianceSchema = z.infer<typeof securityComplianceSchema>;
