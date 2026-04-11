import * as yup from "yup";

const operationalUserSchema = yup.object({
  email: yup.string().email().required(),
  role: yup.string().oneOf(["admin", "operator", "viewer"]).required(),
  active: yup.boolean().default(true).required(),
});

export type OperationalUser = yup.InferType<typeof operationalUserSchema>;

export const parseOperationalUser = async (input: unknown): Promise<OperationalUser> => {
  return operationalUserSchema.validate(input, {
    abortEarly: false,
    stripUnknown: true,
  });
};