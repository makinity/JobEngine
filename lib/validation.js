import { z } from "zod";

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required.").max(120),
  position: z.string().trim().min(1, "Position is required.").max(120),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]).default("Applied"),
  location: z.string().trim().max(120).optional().nullable(),
  applied_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Applied date must use YYYY-MM-DD.")
    .optional()
    .nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export function normalizeApplication(input) {
  return {
    ...input,
    location: input.location || null,
    applied_date: input.applied_date || null,
    notes: input.notes || null,
  };
}
