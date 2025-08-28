/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormInputs } from "@/schemas/authSchema";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import MobileError from "./MobileError";
import SupportFeedback from "../../components/SupportFeedback";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/authService";

import type { AxiosError } from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState<"error" | "support" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string | undefined>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSupportLoading, setIsSupportLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormInputs) =>
      authService.login(data.email, data.password),
    onSuccess: (data) => {
      // update store here
      useAuthStore.getState().setUser(data.user);

      if (!data.user.role) {
        throw new Error("User role is missing after login");
      }

      const normalizedRole = data.user.role.toString().trim().toUpperCase();

      switch (normalizedRole) {
        case "SUPER_ADMIN":
          navigate("/manager/dashboard");
          break;

        case "MAINTAINER":
          navigate("/maintainer/dashboard");
          break;

        case "ADMIN":
          navigate("/admin/dashboard/overview");
          break;

        case "STAFF":
          navigate("/staff/dashboard/s-overview");
          break;

        default:
          console.error("Unknown user role detected:", {
            originalRole: data.user.role,
            normalizedRole,
            //  data.user,
          });
          throw new Error(`Unknown user role: ${data.user.role}`);
      }

      toast.success(`Welcome ${data.user.name}`);
    },
    onError: (
      error: AxiosError<
        string | { message: string | string[]; errors?: string[] }
      >
    ) => {
      let backendMessage = "Login failed. Please try again.";

      const data = error.response?.data;

      if (typeof data === "string") {
        backendMessage = data; // plain string
      } else if (data?.message) {
        backendMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
      } else if (Array.isArray(data?.errors)) {
        backendMessage = data.errors.join(", ");
      }

      const backendCode: string | undefined = error.response?.status
        ? `AUTH-${error.response.status}`
        : undefined;

      setErrorMessage(backendMessage);
      setErrorCode(backendCode);
      console.error("Login failed", backendMessage);
      openModal("error");
      toast.error(backendMessage);
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    mutation.mutate(data);

    //   toast.success(`Welcome back, ${user.name || "User"}!`);
  };

  // function to set a loading spinner before oprning the support modal
  const openSupportModal = () => {
    setIsSupportLoading(true);

    setTimeout(() => {
      setIsSupportLoading(false);
      openModal("support");
      reset();
    }, 2000); // 2 seconds
  };

  const openModal = (type: "error" | "support") => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const closeModalAndReset = () => {
    closeModal();
    reset();
  };

  // handle error on mobile
  const handleMobileError = () => openModal("error");

  const toggleVisibility = () => setPasswordVisible((v) => !v);

  return (
    <main className="bg-[var(--cl-bg-light)] min-h-screen flex justify-center items-center">
      <section className="md:max-w-3xl w-full mx-auto lg:bg-white lg:rounded-3xl lg:shadow-lg lg:border border-[var(--cl-secondary)] px-6 sm:px-20 pt-10 pb-14">
        <div className="max-w-34 mx-auto mb-6">
          <img src="/logo.png" alt="Mfon-Obong Enterprise Logo" />
        </div>
        <p className="font-semibold text-xl md:text-4xl text-[var(--text-dark)] text-center">
          Mfon-Obong Nigeria Enterprise
        </p>

        <form
          onSubmit={handleSubmit(onSubmit, handleMobileError)}
          className="mt-8 md:mt-6"
          noValidate
        >
          <input
            type="text"
            {...register("email")}
            placeholder="Email address"
            disabled={mutation.isPending}
            aria-invalid={!!formErrors.email}
            className={`bg-transparent border px-4 py-3 rounded-[0.625rem] text-base w-full ${
              formErrors.email
                ? "border-[var(--cl-error)]"
                : "border-[var(--cl-gray-a1)]"
            } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
          />
          <p className="text-[var(--cl-error)] text-sm pt-1">
            {formErrors.email?.message ?? ""}
          </p>

          <div className="relative mt-4">
            <input
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              aria-invalid={!!formErrors.password}
              disabled={mutation.isPending}
              className={`border outline-0 pl-4 pr-10 py-3 rounded-[0.625rem] text-base w-full ${
                formErrors.password
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <button
              type="button"
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--cl-secondary)]"
              onClick={toggleVisibility}
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          <p className="text-[var(--cl-error)] text-sm pt-1" aria-live="polite">
            {formErrors.password?.message ?? ""}
          </p>

          <div className="mt-10">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className={`w-full h-12 ${
                Object.keys(formErrors).length > 0
                  ? "bg-[#D9D9D9] hover:bg-[#D9D9D9]/90 text-[#444444]"
                  : "bg-[#2ECC71] hover:bg-[#27ae60]"
              } ${mutation.isPending ? "cursor-not-allowed" : ""}`}
            >
              {Object.keys(formErrors).length > 0
                ? "Retry"
                : mutation.isPending
                ? "Logging in..."
                : "Login"}
            </Button>
          </div>

          <div className="flex gap-2.5 justify-center items-center mt-5">
            {!formErrors && (
              <span className="text-[var(--cl-blue)] border-b border-[var(--cl-blue)] text-sm">
                need help?
              </span>
            )}
            <span
              className="text-[var(--cl-blue)] hover:text-blue-700 text-sm"
              // onClick={() => {
              //   openModal("support");
              //   reset();
              // }}
              onClick={openSupportModal}
            >
              {isSupportLoading && <LoadingSpinner />}
              Contact Support
            </span>
          </div>
        </form>
        {activeModal === "error" && (
          <MobileError
            message={errorMessage}
            code={errorCode}
            onClose={closeModalAndReset}
            onSupport={() => {
              closeModal();
              openModal("support");
            }}
          />
        )}

        {activeModal === "support" && <SupportFeedback onClose={closeModal} />}
      </section>
    </main>
  );
};

export default Login;
