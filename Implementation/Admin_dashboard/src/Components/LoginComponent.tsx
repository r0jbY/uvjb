import { useState } from "react";
import logo from "../assets/Logo.png";
import { login } from "../Services/AuthenticationService";
import { useNavigate } from "react-router";
import background from "../assets/background.png";
import { useEffect } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";

function useIsShortScreen(threshold = 600) {
    const [isShort, setIsShort] = useState(false);

    useEffect(() => {
        const checkHeight = () => {
            setIsShort(window.innerHeight < threshold);
        };

        checkHeight(); // run on mount
        window.addEventListener('resize', checkHeight);

        return () => {
            window.removeEventListener('resize', checkHeight);
        };
    }, [threshold]);

    return isShort;
}

function LoginComponent() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const isShortScreen = useIsShortScreen();

    const validate = () => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return false;
        }

        if (!password) {
            toast.error("Password has to be filled in");
            return false;
        }
        
        return true;
    }

    const loginCall = async () => {
        if (validate()) {
            try {

                const res = await login(email, password);
                console.log(res);
                setEmail("");
                setPassword("");
                setLoginMessage(`Login successful!`);
                navigate('/akkssk');
                console.log("Good!");
            } catch (error) {
                setLoginMessage(`Invalid credentials. Try again!`);
                console.error(error);
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };


    return (
        <div
            className="relative flex flex-col items-center justify-center w-screen min-h-screen
             bg-[#F7EFDA] bg-contain bg-center lg:bg-cover overflow-y-auto px-4 pt-[12vh] pb-10"
            style={{ backgroundImage: `url(${background})` }}
        >
            <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                theme="light"
            />
            {/* 🐢 Logo */}
            {!isShortScreen && (<img
                src={logo}
                alt="Logo"
                className="absolute top-[6vh] left-1/2 transform -translate-x-1/2 
               w-[35vw] sm:w-[120px] md:w-[140px]"
            />)}

            {/* ⬜ Login Form */}
            <div
                className="
    flex flex-col items-center justify-center gap-5 w-full max-w-md py-6 px-6 rounded-2xl overflow-y-auto shadow-[0px_12px_32px_rgba(0,0,0,0.15)] bg-white border border-[#B7C0B2] md:h-auto xl:w-[23vw] xl:h-[47vh] xl:min-h-[350px]"
            >

                <h2 className="text-[#658F8D] text-3xl sm:text-4xl lg:text-[34px] font-bold mb-4 lg:mb-8">
                    Log in
                </h2>
                <div className="relative w-full max-w-[340px]" >
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#658F8D]" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={changeEmail}
                        className="w-full max-w-[340px] h-[48px] p-3 pl-9 border border-[#C3B295] rounded-lg
                    text-[#658F8D] text-base sm:text-lg bg-white placeholder-[#658F8D]
                    focus:outline-[#C3B295]"
                    />
                </div>

                <div className="relative w-full max-w-[340px]" >
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#658F8D]" />

                    {/* 👁️ Toggle Button (Right) */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#658F8D]"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={changePassword}
                        className="w-full max-w-[340px] h-[48px] p-3 pl-9 border border-[#C3B295] rounded-lg
                    text-[#658F8D] text-base sm:text-lg bg-white placeholder-[#658F8D]
                    focus:outline-[#C3B295]"
                    />
                </div>
                <button
                    onClick={loginCall}
                    className="w-full max-w-[340px] h-[48px] mt-2 lg:mt-6 p-2 rounded-lg
                 bg-[#658F8D] text-white text-base sm:text-lg font-bold
                 hover:bg-[#527674] focus:outline-none active:scale-95
                 transition duration-150 ease-in-out cursor-pointer"
                >
                    Log In
                </button>
            </div>
        </div>

    );
}

export default LoginComponent;