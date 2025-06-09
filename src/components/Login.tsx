import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/zodUtils";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Button from "./MyButton";
import MobileError from "./MobileError";
import SupportFeedback from "./SupportFeedback";

type LoginFormInputs = {
  username: string;
  password: string;
};
// const LOGIN_API_URL = import.meta.env.VITE_LOGIN_API;

const Login = () => {
  const navigate = useNavigate();
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"error" | "support" | null>(
    null
  );
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormInputs) => {
    navigate("/admin/setup");
    console.log(data);
    // try {
    //   const response = await fetch(`${LOGIN_API_URL}login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });
    //   // console.log(response);

    //   if (!response.ok) {
    //     throw new Error("Invalid username or password");
    //   }

    //   // simulated response from backend
    //   const user = await response.json();
    //   console.log("User from API:", user);
    //   // const user = {
    //   //   role: "manager",
    //   //   isSetupComplete: false,
    //   // };

    //   // store user info
    //   localStorage.setItem("role", user.role);
    //   localStorage.setItem("isSetupComplete", String(user.isSetupComplete));
    //   if (user.token) {
    //     localStorage.setItem("token", user.token);
    //   }

    //   // role-based navigation
    //   switch (user.role) {
    //     case "manager":
    //       if (user.isSetupComplete) {
    //         navigate("/manager-dashboard");
    //       } else {
    //         navigate("/manager-setup");
    //       }
    //       break;

    //     case "admin":
    //       if (user.isSetupComplete) {
    //         navigate("/admin-dashboard");
    //       } else {
    //         navigate("/admin-setup");
    //       }
    //       break;

    //     case "staff":
    //     default:
    //       navigate("/staff-dashboard");
    //       break;
    //   }
    // } catch (error) {
    //   console.error("Login failed", error);
    // }
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
    <main className="bg-[var(--cl-bg-light)] min-h-screen flex justify-center items-center">
      <section className="md:max-w-3xl w-full mx-auto lg:bg-white lg:rounded-3xl lg:shadow-lg lg:border border-[var(--cl-secondary)] px-6 sm:px-20 pt-10 pb-14">
        <div className="max-w-34 mx-auto mb-6">
          <img src="/logo.png" alt="Mfon-Obong Enterprise Logo" />
        </div>
        <p className="font-semibold text-xl md:text-4xl text-[var(--text-dark)] text-center [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
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
            className={`border outline-0 px-4 py-3 rounded-[0.625rem] text-[var(--cl-secondary)] text-base w-full ${
              errors.username
                ? "border-[var(--cl-error)] focus:border-[var(--cl-error)]"
                : "border-[var(--cl-gray-a1)] focus:border-[var(--cl-gray-a1)]"
            }`}
          />
          <p
            className="hidden md:block md:min-h-6 text-[var(--cl-error)] text-sm pt-1 transition-all duration-200 ease-in-out"
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
              className={`border  outline-0  pl-4 pr-10 py-3 rounded-[0.625rem] text-[var(--cl-secondary)] text-base w-full mt-4 ${
                errors.password
                  ? "border-[var(--cl-error)] focus:border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)] focus:border-[var(--cl-gray-a1)]"
              }`}
            />
            <button
              className="absolute top-1/2 text-[var(--cl-secondary)] right-4 cursor-pointer hover:opacity-80"
              aria-label="Toggle password visibility"
              onClick={toggleVisibility}
            >
              {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          <p
            className="hidden md:block md:min-h-6 text-[var(--cl-error)] text-sm pt-1 transition-all duration-200"
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
          <span className="text-[var(--cl-blue)] border-b border-[var(--cl-blue)] text-sm">
            need help?
          </span>

          <span
            className="text-[var(--cl-blue)] hover:text-blue-700 text-sm transition-colors duration-200 ease-in-out"
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
