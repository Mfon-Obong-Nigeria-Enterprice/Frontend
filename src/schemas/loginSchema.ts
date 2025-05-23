import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Please enter a valid Username"),
  password: yup.string().required("Password don't match"),
});
