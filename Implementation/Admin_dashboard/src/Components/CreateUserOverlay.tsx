import { toast } from "react-toastify";
import InputField from "./InputField";
import { useState } from "react";
import { createUser } from "../Services/UserService";
import { getUser } from "../Services/UserService";
import { useEffect } from "react";

type CreateUserOverlayProps = {
    onClose: () => void;
    edit: boolean;
    id?: string;
};

function CreateUserOverlay({ onClose, edit, id }: CreateUserOverlayProps) {

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"admin" | "buddy" | "superbuddy" | "">("");
    const [active, setActive] = useState(true);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        address: false,
        password: false,
        confirmPassword: false,
        role: false
    });

    const loadUserData = async () => {
        if (!id) return;

        try {
            const user = await getUser(id);
            if (user) {
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                setPhonenumber(user.phoneNumber);
                setAddress(user.address);
                setRole(user.role);
                setActive(user.active);
            }
        } catch (error) {
            toast.error("Failed to load user data.");
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        if (edit && id) {
            loadUserData();
        }
    }, [edit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();

        const newErrors = {
            firstName: firstName.trim() === "",
            lastName: lastName.trim() === "",
            email: email.trim() === "",
            phoneNumber: phoneNumber.trim() === "",
            address: address.trim() === "",
            password: password.trim() === "",
            confirmPassword: confirmPassword.trim() === "",
            role: role === ""
        };

        setErrors(newErrors);

        // If any field is missing, prevent submit
        if (Object.values(newErrors).some((val) => val)) {
            toast.error("Please fill in all required fields.");
            return;
        }

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

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            console.log(err);
            toast.error(err || "Something went wrong");
        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 px-4">
            <div className="lg:flex lg:flex-col relative  items-center bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-1 border-[#C3B295] overflow-y-scroll max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[60vw]  lg:max-h-[90vh] lg:h-auto  lg:py-[3.5vh]">
                <div onClick={onClose} className="absolute top-4 right-4 text-2xl text-[#658F8D] cursor-pointer hidden lg:block mr-2 hover:text-gray-700  active:scale-[0.9]">
                    ✕
                </div>
                <div className="flex justify-between items-center mb-8 lg:justify-center">
                    <h2 className="text-xl font-bold text-[#658F8D] lg:text-4xl">{!edit ? "Create New User" : `Edit User`}</h2>
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
                            error={errors.firstName}
                        />

                        <InputField
                            label="Last Name"
                            name="LastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors.lastName}
                        />
                    </div>


                    <InputField
                        label="Email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <InputField
                        label="Phone Number"
                        name="PhoneNumber"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        error={errors.phoneNumber}
                    />

                    <InputField
                        label="Address"
                        name="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        error={errors.address}
                    />

                    <div className={` flex-col lg:flex-row w-full gap-5 ${edit ? 'hidden' : 'flex'}`}>
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />

                        <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row w-full gap-5 ">
                        <div className="flex flex-col gap-1 w-full ">
                            <label className="text-[#658F8D] text-lg font-medium">{errors.role && "!"} Role</label>
                            <select
                                name="role"
                                className={`w-full h-[48px] p-3  rounded-lg text-[#658F8D] text-base ${errors.role ? "border-2 border-red-600" : "border border-[#C3B295]"} bg-[#F7F7F7] placeholder-[#658F8D] focus:outline-[#C3B295] disabled:opacity-60 disabled:cursor-not-allowed`}
                                value={role}
                                onChange={(e) => { setRole(e.target.value as any) }}

                            >
                                <option value="">Choose Role</option>
                                <option value="admin">Admin</option>
                                <option value="buddy">Buddy</option>
                                <option value="superbuddy">Superbuddy</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 w-full ">
                            <label className="text-[#658F8D] text-lg font-medium"> Active </label>
                            <select
                                name="active"
                                className={`w-full h-[48px] p-3 border border-[#C3B295] rounded-lg text-[#658F8D] text-base  bg-[#F7F7F7] placeholder-[#658F8D] focus:outline-[#C3B295] disabled:opacity-60 disabled:cursor-not-allowed`}
                                value={String(active)}
                                onChange={(e) => setActive(e.target.value === "true")}

                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>


                            </select>
                        </div>
                    </div>
                    <div className={`${edit ? 'mt-7' : 'mt-0'} flex w-full justify-between mt-3`}>

                        <div className={`${!edit ? 'hidden' : 'block'} flex flex-row w-full justify-between`}>
                            <button
                                type="button"

                                className={` bg-[#D96C6C] hover:bg-[#C0504D] text-white font-semibold px-4 py-2 rounded-md cursor-pointer active:scale-[0.98] transition-all duration-150 ease-in-out lg:rounded-xl lg:font-bold lg:text-xl lg:px-5`}
                            >
                                Delete User
                            </button>
                        </div>
                        <div className="flex flex-row w-full justify-between ml-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border text-[#658F8D] bg-[#F7EFDA] hover:bg-[#ece9dc]  border-[#B7C0B2] cursor-pointer active:scale-[0.98] transition-all duration-150 ease-in-out lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                            >
                                Cancel
                            </button>

                            <button

                                className="px-4 py-2 rounded-md text-white bg-[#658F8D] hover:bg-[#739B99] active:scale-[0.98]  transition-all duration-150 ease-in-out cursor-pointer lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                                onClick={!edit ? handleSubmit : () => { }}
                            >

                                {edit ? 'Edit' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default CreateUserOverlay;