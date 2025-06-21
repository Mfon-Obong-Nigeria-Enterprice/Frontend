import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

const EditnDelete = () => {
  return (
    <div className="flex gap-3">
      <MdOutlineEdit className="text-[#FFA500] cursor-pointer" />
      <MdOutlineDelete className="cursor-pointer" />
    </div>
  );
};

export default EditnDelete;
