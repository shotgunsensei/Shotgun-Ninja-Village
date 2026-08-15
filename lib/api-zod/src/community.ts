import { z } from "zod/v4";

export const ArchetypeSchema = z.enum([
  "builder",
  "protector",
  "tracer",
  "breaker",
]);
export const TransmissionIdSchema = z
  .string()
  .trim()
  .regex(/^\d{2}$/)
  .max(8);
export const CallsignSchema = z
  .string()
  .trim()
  .min(3, "Callsign must be at least 3 characters")
  .max(24, "Callsign must be 24 characters or fewer")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
    "Use letters, numbers, underscores, or hyphens",
  );

export const RegisterBody = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(320),
  callsign: CallsignSchema,
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(128),
  newsletterOptIn: z.boolean().default(false),
  termsAccepted: z.literal(true, {
    error: "You must accept the Terms and Privacy Policy",
  }),
  archetype: ArchetypeSchema.nullish(),
  watchedTransmissions: z.array(TransmissionIdSchema).max(12).default([]),
});

export const LoginBody = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

export const UpdateProfileBody = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    callsign: CallsignSchema.optional(),
    bio: z.string().trim().max(400).optional(),
    avatarColor: z
      .enum(["crimson", "cyan", "amber", "emerald", "violet"])
      .optional(),
    newsletterOptIn: z.boolean().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "No profile changes supplied",
  );

export const UpdateProgressBody = z
  .object({
    archetype: ArchetypeSchema.optional(),
    watchedTransmissions: z.array(TransmissionIdSchema).max(12).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "No progress supplied");

export const CreateTopicBody = z.object({
  categorySlug: z.string().trim().min(1).max(64),
  title: z
    .string()
    .trim()
    .min(6, "Title must be at least 6 characters")
    .max(140),
  body: z
    .string()
    .trim()
    .min(10, "Post must be at least 10 characters")
    .max(10_000),
});

export const UpdateTopicBody = z.object({
  title: z.string().trim().min(6).max(140),
});

export const CreateReplyBody = z.object({
  body: z
    .string()
    .trim()
    .min(2, "Reply must be at least 2 characters")
    .max(10_000),
});

export const UpdatePostBody = CreateReplyBody;

export type RegisterInput = z.infer<typeof RegisterBody>;
export type LoginInput = z.infer<typeof LoginBody>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileBody>;
export type UpdateProgressInput = z.infer<typeof UpdateProgressBody>;
export type CreateTopicInput = z.infer<typeof CreateTopicBody>;
export type CreateReplyInput = z.infer<typeof CreateReplyBody>;
