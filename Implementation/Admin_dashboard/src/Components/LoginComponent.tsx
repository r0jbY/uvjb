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
        <div className="pt-0 flex flex-col items-center justify-center min-h-screen bg-[#D9D9D9] gap-0">
            
            <img src={logo} alt="Logo" className="ml-8 sm:ml-14 md:ml-14 lg:ml-20 mb-10 mt-0 p-0 w-32 sm:w-40 md:w-52 lg:w-60 xl:w-72 h-auto" />
            <div className="mt-15 mb-10 w-full h-[30vh] sm:h-[40vh] md:h-[45vh] l:h-[50vh] bg-white shadow-lg p-6 flex flex-col gap-8 justify-center items-center border-t-1 border-b-1">
                <input
                    placeholder="Email"
                    className="p-1 border-1 w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-[#D9D9D9] h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 text-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 placeholder-gray-500 focus:placeholder-transparent"
                    value={email}
                    onChange={changeEmail}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                <input
                    placeholder="Password"
                    type="password"
                    className="p-1 border-1 w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-[#D9D9D9] h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 text-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 xl:text-3xl placeholder-gray-500 focus:placeholder-transparent"
                    value={password}
                    onChange={changePassword}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                <button className="p-1 border border-gray-500 bg-[#D9D9D9] h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 text-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 rounded-lg shadow hover:bg-gray-300 active:scale-95 transition duration-200 cursor-pointer" onClick={() => { loginCall() }}>
                    Log In
                </button>
            </div>
        </div>
    );
}

export default LoginComponent;