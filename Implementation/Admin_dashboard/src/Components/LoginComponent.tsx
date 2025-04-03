import { useState } from "react";
import logo from "../assets/Logo.png";

function LoginComponent() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = "Email must be filled in.";
        }

        if (!password) {
            newErrors.password = "Password must be filled in.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const loginCall = () => {
        if (validate()) {
            console.log("Good!");
        }
    }

    return (
        <div className="flex flex-col w-[100vw] h-[100vh]">

            {/* 🐢 Logo Section */}
            <div className="flex items-center justify-center h-[35vh] sm:h-[35vh] md:h-[35vh] lg:h-[40vh] bg-[#D9D9D9]">
                <img src={logo} alt="Logo" className="w-40 ml-5 h-auto sm:w-52 sm:ml-10 md:w-64 md:ml-15 lg:w-72 lg:ml-20" />
            </div>

            {/* ⬜ Login Form */}
            <div className="flex flex-col items-center justify-center gap-8 border-y h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[50vh] bg-white">

                <input
                    placeholder="Email"
                    value={email}
                    onChange={changeEmail}
                    className="w-5/6 h-12 p-1 text-center text-base font-bold text-gray-500 bg-[#D9D9D9] border placeholder-gray-500 focus:placeholder-transparent sm:w-2/3 sm:h-14 sm:text-lg md:w-1/2 md:h-16 md:text-xl lg:w-1/3 lg:h-20 lg:text-2xl"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={changePassword}
                    className="w-5/6 h-12 p-1 text-center text-base font-bold text-gray-500 bg-[#D9D9D9] border placeholder-gray-500 focus:placeholder-transparent sm:w-2/3 sm:h-14 sm:text-lg md:w-1/2 md:h-16 md:text-xl lg:w-1/3 lg:h-20 lg:text-2xl"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <button
                    onClick={loginCall}
                    className="w-1/2 h-10 p-1 text-center text-base font-bold text-gray-500 bg-[#D9D9D9] border border-gray-500 rounded-lg shadow hover:bg-gray-300 active:scale-95 transition duration-200 cursor-pointer sm:w-1/3 sm:h-12 sm:text-lg md:w-1/4 md:h-14 md:text-xl lg:w-1/5 lg:h-16 lg:text-2xl"
                >
                    Log In
                </button>
            </div>

            {/* 📦 Bottom Spacer */}
            <div className="h-[25vh] sm:h-[20vh] md:h-[20vh] lg:h-[20vh] bg-[#D9D9D9]"></div>
        </div>


    );
}

export default LoginComponent;