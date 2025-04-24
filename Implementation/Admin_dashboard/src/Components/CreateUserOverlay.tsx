import InputField from "./InputField";
import { useState } from "react";

function CreateUserOverlay({ onClose }: { onClose: () => void }) {

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Buddy");
    const [active, setActive] = useState(true);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] bg-opacity-30 px-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border-1 border-[#C3B295] overflow-y-scroll max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#658F8D]">Create New User</h2>
                    <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer active:scale-[0.9]">✕</button>
                </div>

                <form className="flex flex-col space-y-4">
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


                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-[#658F8D] text-sm font-medium">Role</label>
                        <select
                            name="role"
                            className="w-full h-[48px] p-3 border border-[#C3B295] rounded-lg text-[#658F8D] text-base bg-[#F7F7F7] focus:outline-[#C3B295]"
                            value={role}
                            onChange={(e) => {setRole(e.target.value)}}
                        >
                            <option value="admin">Admin</option>
                            <option value="buddy">Buddy</option>
                            <option value="superbuddy">Superbuddy</option>
                        </select>
                    </div>

                    <div className="flex   gap-5 py-1 items-center">

                        <label className="text-[#658F8D] text-lg font-medium">Active</label>

                        <input
                            type="checkbox"
                            name="active"
                            className="w-6 h-6 text-[#658F8D] accent-[#658F8D] rounded focus:ring-[#C3B295] focus:ring-2 cursor-pointer"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                        />
                    </div>

                    <div className="flex justify-between mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border text-[#658F8D] bg-[#f5f3e9] hover:bg-[#ece9dc] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            
                            className="px-4 py-2 rounded-md text-white bg-[#658F8D] hover:bg-[#739B99] cursor-pointer"
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