import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CreateUserModal = () => {
  return (
    <section className="font-Inter">
      <h4 className="text-xl text-[#1E1E1E] font-medium border-b py-6 px-9">
        Create New User
      </h4>

      <form>
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
              placeholder="Enter first name"
              className="text-[#7D7D7D] md:text-sm"
            />
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
              placeholder="Enter last name"
              className="text-[#7D7D7D] md:text-sm"
            />
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
              placeholder="Enter user phone number"
              className="text-[#7D7D7D] md:text-sm"
            />
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
              placeholder="Enter user address"
              className="text-[#7D7D7D] md:text-sm"
            />
          </div>

          {/* user password */}
          <div>
            <label
              htmlFor="userpassword"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Password
            </label>
            <Input
              type="text"
              id="userpassword"
              placeholder="Enter user password"
              className="text-[#7D7D7D] md:text-sm"
            />
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
              placeholder="Enter user email address"
              className="text-[#7D7D7D] md:text-sm"
            />
          </div>
          {/* role */}
          <div>
            <label
              htmlFor="userrole"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Role
            </label>
            <Select>
              <SelectTrigger className="w-full">Select Role</SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* branch */}
          <div>
            <label
              htmlFor="userrole"
              className="text-[13px] md:text-sm text-[#444444]"
            >
              Branch
            </label>
            <Select>
              <SelectTrigger className="w-full">Select Role</SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-[#F5F5F5] h-24 flex justify-end items-center gap-5 px-5">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="button">Create User</Button>
        </div>
      </form>
    </section>
  );
};

export default CreateUserModal;
