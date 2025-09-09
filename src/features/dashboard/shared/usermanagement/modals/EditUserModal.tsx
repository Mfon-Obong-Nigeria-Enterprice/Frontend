import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { updateUserData } from "@/services/userService";
import { toast } from "react-toastify";

import { useBranchStore } from "@/stores/useBranchStore";

// ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Define the edit user schema
const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "STAFF"], {
    required_error: "Please select a role",
  }),
  branch: z.string().min(1, "Please select a branch"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UpdateUserPayload {
  fullName?: string;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  role?: string;
  location?: string;
  branch?: string;
  branchId?: string;
}

interface EditUserModalProps {
  closeModal: () => void;
  userData: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
    branchId?:
      | {
          _id: string;
          name: string;
        }
      | string;
  };
}

const EditUserModal = ({ closeModal, userData }: EditUserModalProps) => {
  const branches = useBranchStore((s) => s.branches);
  const query = new QueryClient();

  // Extract first and last name from full name
  const nameParts = userData.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Get branch ID - handle both object and string formats
  const currentBranchId =
    typeof userData.branchId === "object"
      ? userData.branchId?._id
      : userData.branchId || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName,
      lastName,
      phone: userData.phone || "",
      address: userData.address || "",
      email: userData.email,
      role: userData.role as "ADMIN" | "STAFF",
      branch: currentBranchId,
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserPayload;
    }) => updateUserData(userId, data),
    onSuccess: () => {
      toast.success(`User updated successfully`);
      query.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: EditUserFormValues) => {
    const branch = branches.find((b) => b._id === data.branch);

    if (!branch) {
      toast.error("Selected branch not found");
      return;
    }

    const payload: UpdateUserPayload = {
      fullName: `${data.firstName} ${data.lastName}`,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      address: data.address,
      email: data.email,
      role: data.role,
      branchId: branch._id,
      branch: branch.name,
      location: branch.name,
    };

    mutation.mutate({
      userId: userData._id,
      data: payload,
    });
  };

  return (
    <section className="font-Inter">
      <h4 className="text-xl text-[#1E1E1E] font-medium border-b py-6 px-9">
        Edit User
      </h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6 py-6 px-9">
          {/* first name */}
          <div>
            <label
              htmlFor="userfirstname"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              First name
            </label>
            <Input
              type="text"
              id="userfirstname"
              {...register("firstName")}
              disabled={mutation.isPending}
              aria-invalid={!!errors.firstName}
              placeholder="Enter first name"
              className={`text-[#7D7D7D] md:text-sm ${
                errors.firstName
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.firstName?.message ?? ""}
            </p>
          </div>

          {/* last name */}
          <div>
            <label
              htmlFor="userlastname"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Last name
            </label>
            <Input
              type="text"
              id="userlastname"
              {...register("lastName")}
              disabled={mutation.isPending}
              aria-invalid={!!errors.lastName}
              placeholder="Enter last name"
              className={`text-[#7D7D7D] md:text-sm ${
                errors.lastName
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.lastName?.message ?? ""}
            </p>
          </div>

          {/*  user phone number */}
          <div>
            <label
              htmlFor="userphonenumber"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Phone number
            </label>
            <Input
              type="text"
              id="userphonenumber"
              {...register("phone")}
              disabled={mutation.isPending}
              aria-invalid={!!errors.phone}
              placeholder="Enter user phone number"
              className={`text-[#7D7D7D] md:text-sm ${
                errors.phone
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.phone?.message ?? ""}
            </p>
          </div>

          {/* user address */}
          <div>
            <label
              htmlFor="useraddress"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Address
            </label>
            <Input
              type="text"
              id="useraddress"
              {...register("address")}
              disabled={mutation.isPending}
              aria-invalid={!!errors.address}
              placeholder="Enter user address"
              className={`text-[#7D7D7D] md:text-sm ${
                errors.address
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.address?.message ?? ""}
            </p>
          </div>

          {/* user email */}
          <div>
            <label
              htmlFor="useremail"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="useremail"
              {...register("email")}
              disabled={mutation.isPending}
              aria-invalid={!!errors.email}
              placeholder="Enter user email address"
              className={`text-[#7D7D7D] md:text-sm ${
                errors.email
                  ? "border-[var(--cl-error)]"
                  : "border-[var(--cl-gray-a1)]"
              } ${mutation.isPending ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.email?.message ?? ""}
            </p>
          </div>

          {/* role - only show if not MAINTAINER */}
          {userData.role !== "MAINTAINER" && (
            <div>
              <label
                htmlFor="userrole"
                className="text-[13px] md:text-sm text-[#444444]"
              >
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[var(--cl-error)] text-sm pt-1">
                {errors.role?.message ?? ""}
              </p>
            </div>
          )}

          {/* branch */}
          <div>
            <label
              htmlFor="userbranch"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Branch
            </label>
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-[var(--cl-error)] text-sm pt-1">
              {errors.branch?.message ?? ""}
            </p>
          </div>
        </div>

        <div className="bg-[#F5F5F5] h-24 flex justify-end items-center gap-5 px-5">
          <Button type="button" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Updating user..." : "Update User"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditUserModal;
