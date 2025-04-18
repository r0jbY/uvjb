import { Bars3Icon } from "@heroicons/react/24/outline";
import logo from "../assets/Logo.png"
import { useState } from "react";
import { UserIcon, UsersIcon, ArrowRightStartOnRectangleIcon, ShareIcon } from '@heroicons/react/24/outline';


function NavBarComponent() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuBackdropVisible, setMenuBackdropVisible] = useState(false);

    const changeMenuOpen = () => {
        if (!menuOpen) {
            setMenuOpen(true);
            setTimeout(() => setMenuBackdropVisible(true), 10); // match transition duration
        } else {
            setMenuOpen(false);
            setTimeout(() => setMenuBackdropVisible(false), 10); // match transition duration

        }
    }

    return (
        <div className="w-full z-50 shadow-[0_2px_4px_0_rgba(0,0,0,0.2)] bg-[#F7EFDA]">
            <div className="flex flex-row justify-between items-center w-full h-19 px-8 ">
                <img src={logo} alt="Logo" className="h-15  mr-auto ml-0" />
                {/* Left section: logo + nav buttons */}
                <div className="flex items-center gap-[5vw]">

                    <button
                        className="hidden lg:flex items-center gap-2 font-bold text-[#658F8D] text-2xl cursor-pointer hover:text-[#4C7472] hover:underline underline-offset-4 hover:decoration-[#4C7472] decoration-2 hover:scale-115 active:scale-95 transition-all duration-200 ease-in-out">
                        <UserIcon className="w-6 h-6" />
                        User Overview
                    </button>
                    <button className="hidden lg:flex items-center gap-2 font-bold text-[#658F8D] text-2xl cursor-pointer hover:text-[#4C7472] hover:underline underline-offset-4 hover:decoration-[#4C7472] decoration-2 hover:scale-115 active:scale-95 transition-all duration-200 ease-in-out">
                        <UsersIcon className="w-6 h-6" />
                        Client Overview
                    </button>
                    <button className="hidden lg:flex items-center gap-2 font-bold text-[#658F8D] text-2xl cursor-pointer hover:text-[#4C7472] hover:underline underline-offset-4 hover:decoration-[#4C7472] decoration-2 hover:scale-115 active:scale-95 transition-all duration-200 ease-in-out">
                        <ShareIcon className="w-6 h-6" />
                        Client Network
                    </button>
                </div>

                {/* Spacer pushes this content to the end */}
                <div className="ml-auto flex items-center">
                    <button className="hidden lg:flex items-center gap-2 font-bold text-[#658F8D] text-2xl cursor-pointer hover:text-[#4C7472] hover:underline underline-offset-4 hover:decoration-[#4C7472] decoration-2 hover:scale-115 active:scale-95 transition-all duration-200 ease-in-out">
                        <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                        Log out
                    </button>
                    <button onClick={changeMenuOpen} className="lg:hidden cursor-pointer active:scale-95">
                        <Bars3Icon className="w-8 h-8" />
                    </button>
                </div>
            </div>

            <div
                className={`${!menuOpen ? 'block' : 'hidden'}fixed inset-0 z-40`} // Clicking backdrop will close menu
            >
                {/* Background overlay */}
                {menuBackdropVisible && (
                    <div
                        className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm transition-opacity"
                        onClick={changeMenuOpen}
                    ></div>
                )}

                {/* Slide-in menu panel */}
                <div
                    className={`flex flex-col align-middle items-center gap-0 fixed top-0 right-0 ${!menuOpen ? 'translate-x-full' : 'translate-x-0'} w-[75%] pt-[2vh] h-full z-50 space-y-6 text-xl transition-all duration-300 ease-in-out shadow-lg bg-[#F7EFDA]`}
                >
                    <div className="w-full flex justify-end pr-4">
                        <button className="text-4xl text-[#658F8D] font-bold cursor-pointer hover:text-[#6C9492] active:scale-95 transition-all duration-200 ease-in-out px-3 py-1 rounded" onClick={changeMenuOpen}>✕</button>
                    </div>

                    <button className="w-full mb-0 py-6 text-[#658F8D] text-2xl font-bold border-b border-[#E4DFCC] cursor-pointer hover:bg-[#E4DFCC]/30 active:scale-[0.98] transition-all duration-150 ease-in-out flex items-center justify-center gap-3">
                        <UserIcon className="w-6 h-6" />
                        User Overview
                    </button>

                    <button className="w-full mb-0 py-6 text-[#658F8D] text-2xl font-bold border-b border-[#E4DFCC] cursor-pointer hover:bg-[#E4DFCC]/30 active:scale-[0.98] transition-all duration-150 ease-in-out flex items-center justify-center gap-3">
                        <UsersIcon className="w-6 h-6" />
                        Client Overview
                    </button>

                    <button className="w-full mb-0 py-6 text-[#658F8D] text-2xl font-bold border-b border-[#E4DFCC] cursor-pointer hover:bg-[#E4DFCC]/30 active:scale-[0.98] transition-all duration-150 ease-in-out flex items-center justify-center gap-3">
                        <ShareIcon className="w-6 h-6"></ShareIcon>
                        Client Network
                    </button>

                    <button className="flex items-center justify-center gap-3 w-fit  mt-auto mb-10 p-3 px-6  rounded-4xl bg-[#658F8D] text-white text-2xl font-bold border-[#739B99] cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                        <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                        Log out
                    </button>

                </div>
            </div>

        </div>
    );
}

export default NavBarComponent;