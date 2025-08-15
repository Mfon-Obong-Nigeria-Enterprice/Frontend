type Props = {
  clientName: string;
  phoneNumber?: string;
  address?: string;
  balance: number;
};

const ClientDisplayBox = ({
  clientName,
  phoneNumber,
  address,
  balance,
}: Props) => {
  return (
    <div className="bg-gradient-to-r from-[#176639] via-[#2ECC71] to-[#2ECC72] border-l-[6px] border-[#2ECC71] my-8 py-5 px-8 rounded-md space-y-1 text-white">
      {/* name and number */}
      <div className="flex justify-between items-center">
        <p className="font-medium">
          <span>Client: </span>
          <span>{clientName}</span>
        </p>
        <p>{phoneNumber ?? "Not provided"}</p>
      </div>

      {/* address */}
      <div className="flex justify-between">
        <p>Address:</p>
        <address>{address ?? "Not provided"}</address>
      </div>

      {/* acc balan */}
      <div className="flex justify-between">
        <p>Current Account Balance:</p>
        <p className="font-semibold">₦ {balance.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ClientDisplayBox;
