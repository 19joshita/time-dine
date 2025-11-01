import * as Yup from "yup";
export const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid Email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be min 6 character"),
});
