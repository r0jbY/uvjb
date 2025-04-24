import { toast } from "react-toastify";
import InputField from "./InputField";
import { useState } from "react";
import { createUser } from "../Services/UserService";
function CreateUserOverlay({ onClose }: { onClose: () => void }) {

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"admin" | "buddy" | "superbuddy">("buddy");
    const [active, setActive] = useState(true);

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss(); 
      
        const isEmailValid = (email: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
        const isPasswordStrong = (pwd: string) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
      
        const isPhoneValid = (phone: string) =>
          /^\+?[0-9\s\-()]{6,20}$/.test(phone);
      
        const isNameValid = (name: string) =>
          /^[a-zA-Zà-ÿÀ-ß'’ -]{2,60}$/.test(name.trim());
      
        const isAddressValid = (address: string) =>
          address.trim().length > 5;
      
        if (!isNameValid(firstName)) return toast.error("Please enter a valid first name.");
        if (!isNameValid(lastName)) return toast.error("Please enter a valid last name.");
        if (!isEmailValid(email)) return toast.error("Please enter a valid email address.");
        if (!isPhoneValid(phoneNumber)) return toast.error("Please enter a valid phone number.");
        if (!isAddressValid(address)) return toast.error("Please enter a valid address.");
        if (!isPasswordStrong(password)) {
          return toast.error(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
          );
        }
        if (password !== confirmPassword) return toast.error("Passwords do not match.");
      
        if (!window.confirm(`Create new user "${firstName} ${lastName}" with role ${role}?`)) return;

        try {
        await createUser({
            firstName: firstName,
            lastName: lastName,
            email,
            phoneNumber: phoneNumber,
            address,
            password,
            role,
            active,
          });
          toast.success("User created successfully!");
        } catch (err: any) {
            console.log(err);
            toast.error(err || "Something went wrong");
        }
        
      };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 px-4">
            <div className="lg:flex lg:flex-col relative  items-center bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-1 border-[#C3B295] overflow-y-scroll max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[60vw]  lg:max-h-[90vh] lg:h-auto  lg:py-[5vh]">
                <div onClick={onClose} className="absolute top-4 right-4 text-2xl text-[#658F8D] cursor-pointer hidden lg:block mr-2 hover:text-gray-700  active:scale-[0.9]">
                    ✕
                </div>
                <div className="flex justify-between items-center mb-8 lg:justify-center">
                    <h2 className="text-xl font-bold text-[#658F8D] lg:text-4xl lg:mb-5">Create New User</h2>
                    <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer active:scale-[0.9] lg:hidden">✕</button>
                </div>

                <form className="flex flex-col space-y-4 lg:w-[80%] justify-center items-center lg:space-y-[3vh]">
                    <div className="flex flex-col lg:flex-row w-full gap-5">
                        <InputField
                            label="First Name"
                            name="FirstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <InputField
                            label="Last Name"
                            name="LastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>


                    <InputField
                        label="Email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                        label="Phone Number"
                        name="PhoneNumber"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                    />

                    <InputField
                        label="Address"
                        name="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <div className="flex flex-col lg:flex-row w-full gap-5">
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row w-full gap-5 ">
                        <div className="flex flex-col gap-1 w-full ">
                            <label className="text-[#658F8D] text-sm font-medium">Role</label>
                            <select
                                name="role"
                                className="w-full h-[48px] p-3 border border-[#C3B295] rounded-lg text-[#658F8D] text-base bg-[#F7F7F7] focus:outline-[#C3B295]"
                                value={role}
                                onChange={(e) => { setRole(e.target.value as any) }}
                            >
                                <option value="admin">Admin</option>
                                <option value="buddy">Buddy</option>
                                <option value="superbuddy">Superbuddy</option>
                            </select>
                        </div>

                        <div className="flex flex-row gap-1 w-full justify-center">

                            <label className="flex items-center just gap-4 mt-4 text-[#658F8D] text-base font-medium">
                                <span>Active</span>
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    className="appearance-none w-[44px] h-[24px] rounded-full bg-[#F7F7F7] border border-[#C3B295] relative cursor-pointer checked:bg-[#658F8D] transition-all duration-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-[20px] after:h-[20px] after:rounded-full after:bg-white after:transition-all checked:after:translate-x-[20px]"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex w-full justify-between mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border text-[#658F8D] bg-[#F7EFDA] hover:bg-[#ece9dc]  border-[#B7C0B2] cursor-pointer active:scale-[0.95] lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                        >
                            Cancel
                        </button>
                        <button

                            className="px-4 py-2 rounded-md text-white bg-[#658F8D] hover:bg-[#739B99] active:scale-[0.95] cursor-pointer lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                            onClick={handleSubmit}
                        >

                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default CreateUserOverlay;