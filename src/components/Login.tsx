// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import { IoEyeOffOutline } from "react-icons/io5";
import Button from "./Button";

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data);
    alert("Login Successful");
  };

  return (
    <main className="bg-bg-light min-h-screen flex justify-center items-center">
      <section className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-secondary px-20 pt-10 pb-14">
        <div className="max-w-34 mx-auto mb-6">
          <img src="/logo.png" alt="Logo" />
        </div>
        <p className="font-semibold text-4xl text-text-dark [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
          Mfon-Obong Nigeria Enterprise
        </p>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <input
            type="text"
            {...register("username")}
            placeholder="Username"
            className="border border-[#A1A1A1] outline-0 focus:border-[#A1A1A1] px-4 py-3 rounded-[0.625rem] text-secondary text-base w-full"
          />
          <p className="text-error text-sm mb-3">{errors.username?.message}</p>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="border border-[#A1A1A1] outline-0 focus:border-[#A1A1A1] pl-4 pr-10 py-3 rounded-[0.625rem] text-secondary text-base w-full mt-4"
            />
            <IoEyeOffOutline className="absolute top-1/2 right-4 " />
          </div>
          <p className="text-error text-sm pt-1">{errors.password?.message}</p>

          <div className="mt-10">
            <Button
              text={isSubmitting ? "Logging in..." : "Login"}
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="flex gap-2 justify-center items-center font-Inter mt-5">
          {/* <Link to="/"> */}
          <span className="text-blue-500 border-b border-blue-500 text-sm">
            Need help?
          </span>
          {/* </Link> */}
          {/* <Link to="/"> */}
          <span className="text-blue-500 text-sm">Contact Support</span>
          {/* </Link> */}
        </div>
      </section>
    </main>
  );
};

export default Login;
