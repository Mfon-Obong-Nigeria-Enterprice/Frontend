import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import MobileError from "./MobileError";
import SupportFeedback from "../../components/SupportFeedback";
import { useAuthStore } from "@/stores/useAuthStore";
import DevRoleSwitcher from "../../components/RoleSwitcher";

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [activeModal, setActiveModal] = useState<"error" | "support" | null>(
    null
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.username, data.password);
      const { user } = useAuthStore.getState();

      if (!user || !user.role) {
        throw new Error("User info is missing after login");
      }

      // Normalize the role to handle any case or whitespace issues
      const normalizedRole = user.role?.toString().trim().toUpperCase();

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
          navigate("/staff/dashboard");
          break;

        default:
          console.error("Unknown user role detected:", {
            originalRole: user.role,
            normalizedRole,
            user,
          });
          throw new Error(`Unknown user role: ${user.role}`);
      }
    } catch (error) {
      console.error("Login failed", error);
      openModal("error");
    }
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
            {...register("username")}
            placeholder="Username"
            aria-invalid={!!formErrors.username}
            className={`bg-transparent border px-4 py-3 rounded-[0.625rem] text-base w-full ${
              formErrors.username
                ? "border-[var(--cl-error)]"
                : "border-[var(--cl-gray-a1)]"
            }`}
          />
          <p className="text-[var(--cl-error)] text-sm pt-1">
            {formErrors.username?.message ?? ""}
          </p>

          <div className="relative mt-4">
            <input
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              aria-invalid={!!formErrors.password}
              className={`border outline-0 pl-4 pr-10 py-3 rounded-[0.625rem] text-base w-full ${
                formErrors.password
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              }`}
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
              disabled={isSubmitting}
              className="w-full h-12"
            >
              {Object.keys(formErrors).length > 0
                ? "Retry"
                : isSubmitting
                ? "Logging in..."
                : "Login"}
            </Button>
          </div>
        </form>

        <div className="flex gap-2.5 justify-center items-center mt-5">
          <span className="text-[var(--cl-blue)] border-b border-[var(--cl-blue)] text-sm">
            need help?
          </span>
          <span
            className="text-[var(--cl-blue)] hover:text-blue-700 text-sm"
            onClick={() => {
              openModal("support");
              reset();
            }}
          >
            Contact Support
          </span>
        </div>

        {activeModal === "error" && (
          <MobileError
            onClose={closeModalAndReset}
            onSupport={() => {
              closeModal();
              openModal("support");
            }}
          />
        )}

        {activeModal === "support" && <SupportFeedback onClose={closeModal} />}
      </section>

      {/* ✅ Dev Role Switcher (only visible in development) */}
      {import.meta.env.DEV && (
        <div className="mt-4">
          <DevRoleSwitcher />
        </div>
      )}
    </main>
  );
};

export default Login;
