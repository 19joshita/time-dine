import * as Yup from "yup";
export const validationSchema = Yup.object({
  fullName: Yup.string().required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9] + $/, "Phone number must be digit ")
    .min(10, "Phone must be at least 10 digits"),
});
