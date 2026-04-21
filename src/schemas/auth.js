import { z } from "zod";

const genderValues = ["Male", "Female", "Non-Binary"];
const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  height_feet: z.coerce.number().int().min(0),
  height_inches: z.coerce.number().int().min(0).max(11),
  weight_lbs: z.coerce.number().positive("Weight must be greater than 0"),
  gender: z.enum(genderValues),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => new Date(value) <= new Date(), "Date of birth cannot be in the future"),
  user_id: z.string().min(1).max(64),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, "Password must include 1 number and 1 special character"),
});

export const settingsSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  height: z.coerce.number().positive("Height must be greater than 0"),
  weight_lbs: z.coerce.number().positive("Weight must be greater than 0"),
  gender: z.string().min(1).max(50),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => new Date(value) <= new Date(), "Date of birth cannot be in the future"),
  created_by: z
    .string()
    .min(1, "Created by is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Created by must be a valid date"),
});

export function buildSignupPayload(values) {
  return {
    first_name: values.first_name,
    last_name: values.last_name,
    height: values.height_feet * 12 + values.height_inches,
    weight_lbs: values.weight_lbs,
    date_of_birth: values.date_of_birth,
    gender: values.gender,
    user_id: values.user_id,
    password: values.password,
  };
}
