import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Button from "./Button";
import MobileError from "./MobileError";
import SupportFeedback from "./SupportFeedback";

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<"error" | "support" | null>(
    null
  );
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data);
    alert("Login Successful");
    navigate("/dashboard");
  };

  // open/close functions
  const openModal = (type: "error" | "support") => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  // reset modal onclose
  const closeModalAndReset = () => {
    closeModal();
    reset();
  };

  // handle error on mobile
  const handleMobileError = () => openModal("error");

  // make password visible
  const toggleVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <main className="bg-bg-light min-h-screen flex justify-center items-center">
      <section className="md:max-w-3xl w-full mx-auto lg:bg-white lg:rounded-3xl lg:shadow-lg lg:border border-secondary px-6 sm:px-20 pt-10 pb-14">
        <div className="max-w-34 mx-auto mb-6">
          <img src="/logo.png" alt="Mfon-Obong Enterprise Logo" />
        </div>
        <p className="font-semibold text-xl md:text-4xl text-text-dark text-center [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
          Mfon-Obong Nigeria Enterprise
        </p>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit, handleMobileError)}
          className="mt-8 md:mt-6"
        >
          <input
            type="text"
            {...register("username")}
            placeholder="Username"
            aria-invalid={!!errors.username}
            className={`border outline-0 px-4 py-3 rounded-[0.625rem] text-secondary text-base w-full ${
              errors.username
                ? "border-error focus:border-error"
                : "border-[#A1A1A1] focus:border-[#A1A1A1]"
            }`}
          />
          <p
            className="hidden md:block md:min-h-6 text-error text-sm pt-1 transition-all duration-200 ease-in-out"
            aria-live="polite"
          >
            {errors.username?.message ?? ""}
          </p>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className={`border  outline-0  pl-4 pr-10 py-3 rounded-[0.625rem] text-secondary text-base w-full mt-4 ${
                errors.password
                  ? "border-error focus:border-error"
                  : "border-[#A1A1A1] focus:border-[#A1A1A1]"
              }`}
            />
            <button
              className="absolute top-1/2 text-secondary right-4 cursor-pointer hover:opacity-80"
              aria-label="Toggle password visibility"
              onClick={toggleVisibility}
            >
              {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          <p
            className="hidden md:block md:min-h-6 text-error text-sm pt-1 transition-all duration-200"
            aria-live="polite"
          >
            {errors.password?.message ?? ""}
          </p>

          <div className="mt-10">
            <Button
              text={
                Object.keys(errors).length > 0
                  ? "Retry"
                  : isSubmitting
                  ? "Logging in..."
                  : "Login"
              }
              type="submit"
              variant={Object.keys(errors).length > 0 ? "secondary" : "primary"}
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="flex gap-2.5 justify-center items-center font-Inter mt-5">
          <span className="text-blue-500 border-b border-blue-500 text-sm">
            need help?
          </span>

          <span
            className="text-blue-500 hover:text-blue-600 text-sm"
            onClick={() => {
              setActiveModal("support");
              reset();
            }}
          >
            Contact Support
          </span>
        </div>

        {/* Error state for mobile */}

        {activeModal === "error" && (
          <MobileError
            onClose={closeModalAndReset}
            onSupport={() => {
              closeModal();
              openModal("support");
              reset();
            }}
          />
        )}

        {/* Show feedback if support is contacted */}
        {activeModal === "support" && <SupportFeedback onClose={closeModal} />}
      </section>
    </main>
  );
};

export default Login;
