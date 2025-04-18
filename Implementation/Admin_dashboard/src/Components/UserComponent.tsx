import { UserIcon } from "@heroicons/react/24/outline";

function UserComponent() {
    return (
        <div className="flex flex-col gap-6 items-center h-full bg-[#F7EFDA] ">
            <div className="flex flex-row justify-between w-[92vw] items-center mt-[3vh]">
                <h1 className="text-[#658F8D] text-3xl font-bold"> User Overview </h1>
                <button className="bg-[#A2A654] text-white font-semibold px-5 py-2 rounded-full  cursor-pointer hover:bg-[#B7BB68] active:scale-[0.98] transition-all duration-150 ease-in-out">Add New</button>
            </div>
            <div className="flex w-[92vw]  rounded-full shadow-sm bg-white border-1 border-[#B7C0B2] ">
                <input
                    type="text"
                    placeholder="Search user name, role ..."
                    className="flex-grow px-4 py-2 focus:outline-0 text-[#658F8D] placeholder:text-[#658F8D]"
                />
                <button
                    className="bg-[#658F8D] text-white font-semibold px-5 rounded-full  cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out"
                >
                    Search
                </button>
            </div>

            <div className="flex flex-col items-center justify-between h-full w-[92vw] mb-5 px-4 py-2 rounded-4xl border-1 border-[#E9E2CD] shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white">

                {[...Array(5)].map((_, index) => (
                    <div className={`flex flex-row items-center justify-between w-[100%] ${index === 4 ? `border-b-0` : `border-b-1`} border-[#E4DFCC] h-1/5 `} key={index}>
                        <UserIcon className="w-10 h-10"></UserIcon>
                        <div className="flex flex-col justify-center w-4/7 h-[100%] text-[#658F8D]">
                            <h2 className="font-bold text-1xl ">Robert Balint</h2>
                            <h2 className=" text-justify">+31 6 12345678 - Utrecht, Some Street 12A - Admin</h2>

                        </div>

                        <button className="rounded-4xl bg-[#658F8D] px-6 py-3 text-white text-lg font-bold border-[#739B99] cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserComponent;