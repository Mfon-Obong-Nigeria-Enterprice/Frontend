import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

import { useClientStore } from "@/store/ClientStore";
import { type AdminSetupClientData } from "@/types/types";
import { adminClientSetupSchema } from "@/lib/zodUtils";

import InputField from "@/components/InputField";
import Button from "@/components/MyButton";
import SetupTitle from "./components/SetupTitle";
import ProgressBar from "./components/ProgressBar";

const SetupFour = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminSetupClientData>({
    resolver: zodResolver(adminClientSetupSchema),
    mode: "onBlur",
  });

  const { clients, addClient } = useClientStore();
  const onSubmit = (data: AdminSetupClientData) => {
    const beforeAddCount = clients.length;
    addClient(data);
    const afterAddCount = useClientStore.getState().clients.length;
    if (beforeAddCount === afterAddCount) {
      alert("Client with this phone number or name already exists!");
      return;
    }

    reset();
  };

  return (
    <div>
      <SetupTitle
        title="Client Information"
        description="Before you can use the system, please complete this setup steps..."
      />
      <ProgressBar currentStep={4} totalSteps={5} />
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
        <h3 className="font-medium font-Inter text-xl leading-none text-[var(--cl-text-dark)]">
          Register New Clients
        </h3>
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 md:gap-8 mt-5 md:mt-10 border border-[var(--cl-border-gray)] rounded-[0.625rem] p-4">
          <InputField
            label="Client name"
            id="clientName"
            type="text"
            placeholder="Enter client name"
            {...register("clientName")}
            error={errors.clientName?.message}
          />
          <InputField
            label="Phone number"
            id="clientNumber"
            type="number"
            placeholder="080 xxx xxx xxx"
            {...register("clientNumber")}
            error={errors.clientNumber?.message}
          />
          <InputField
            label="Initial balance"
            id="initialBal"
            type="number"
            placeholder="0"
            {...register("initialBal")}
            error={errors.initialBal?.message}
          />
          <div className="lg:col-span-3">
            <InputField
              label="Address (Optional)"
              id="clientAddress"
              textarea
              placeholder="Enter client address"
              {...register("clientAddress")}
            />
          </div>
        </div>

        <div className="w-full lg:w-[30%] mt-5">
          <Button text="Register Client" type="submit" />
        </div>
      </form>

      {/* display data */}
      <section className="bg-[#F5F5F5] px-4 py-4 rounded-[0.625rem] flex flex-col gap-3 mb-8 mx-8">
        {clients.length === 0 ? (
          <p className="text-base italic text-[var(--cl-text-semidark)] py-8 text-center">
            No Clients have been added yet.
          </p>
        ) : (
          clients.map((client, index) => (
            <div
              key={index}
              className="bg-white rounded-sm p-5 flex gap-2 items-center"
            >
              <div className="flex-1">
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Name:
                  <span className="font-normal ml-1">{client.clientName}</span>
                </p>
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Phone:
                  <span className="font-normal ml-1">
                    {client.clientNumber}
                  </span>
                </p>

                {client.initialBal && (
                  <p className="font-medium text-[#333333] text-sm leading-tight">
                    Balance:
                    <span className="font-normal ml-1">
                      {client.initialBal}
                    </span>
                  </p>
                )}
                {client.clientAddress && (
                  <p className="font-medium text-[#333333] text-sm leading-tight">
                    Address:
                    <span className="font-normal ml-1">
                      {client.clientAddress}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <MdOutlineEdit className="text-[#FFA500] cursor-pointer" />
                <MdOutlineDelete className="cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </section>

      <div className="bg-gradient-to-t from-[#176639] to-[#2ECC71] mx-6 mb-10 rounded-xl p-0.5 font-Inter">
        <div className="bg-[var(--cl-bg-light-green)] rounded-[0.75rem] py-2 px-10">
          <h6 className="font-semibold text-sm text-[#05431F] mb-1.5">
            Clients Account Tips
          </h6>
          <p className="font-medium text-[0.75rem] text-[#0B6E35] leading-relaxed">
            Initial balance represents any pre-payment made by the clients
            before picking goods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupFour;
