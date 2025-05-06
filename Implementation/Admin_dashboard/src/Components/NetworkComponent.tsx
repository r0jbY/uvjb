import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function NetworkComponent() {
    return (
        <div className="flex flex-col items-center gap-5 text-[#658F8D] w-full h-full bg-[#F7EFDA] px-4 pb-4 overflow-y-scroll lg:overflow-y-hidden lg:px-[4vw] xl:px-[8vw] 2xl:px-[12vw] lg:gap-[4vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <h1 className="text-[#658F8D] text-center  text-3xl font-bold lg:text-4xl lg:mt-[3vh]">Client Network Management </h1>

            <div className="flex flex-col w-full gap-3 lg:flex-row lg:gap-5">
                <select className={`bg-white py-3 px-2 border border-[#B7C0B2] rounded-xl text-[#658F8D] font-bold w-full`}>
                    <option value="">Select Client</option>
                </select>
                <select className={`bg-white py-3 px-2 border border-[#B7C0B2] rounded-xl text-[#658F8D] font-bold w-full`}>
                    <option value="">Select Network Layer</option>
                </select>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row items-center lg:h-full w-full  lg:overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
                <div className="flex flex-col p-6 rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3 lg:w-1/3 h-full min-h-0">
                    <h1 className="text-[#658F8D] text-center text-2xl font-bold mb-3 lg:text-3xl">
                        Current Network - John Doe - Layer 1
                    </h1>

                    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-7 pb-2">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div className="flex flex-row items-center justify-between text-xl" key={index}>
                                <h1> John Doe </h1>
                                <button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>



                <div className="flex flex-col lg:p-3 gap-4 w-full lg:flex-row lg:gap-0 lg:w-2/3 h-[100%] lg:bg-white lg:rounded-2xl lg:border lg:border-[#E9E2CD] lg:shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] ">
                    <div className="flex flex-col  rounded-2xl border border-[#E9E2CD] p-4 w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3 lg:bg-transparent lg:shadow-none lg:border-0 ">
                        <h1 className="text-[#658F8D] text-2xl text-center font-bold lg:text-3xl lg:mb-3"> Available Buddies </h1>
                        <div className='relative w-full'>
                            <MagnifyingGlassIcon className='w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#658F8D]'/>
                            <input placeholder="Search buddies" className="w-full p-2 pl-10 border rounded-xl border-[#B7C0B2] bg-[#FEF5E4] placeholder:text-[#658F8D] placeholder:font-semibold font-semibold focus:outline-[#B7C0B2] " />
                        </div>
                        <div className="flex flex-col min-h-0 gap-2 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div className="flex flex-col border border-[#B7C0B2] rounded-xl py-2 px-3 bg-[#FEF5E4] gap-1" key={index}>
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="font-semibold text-2xl"> John Doe </h1>
                                        <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">Add</button>
                                    </div>
                                    <p className="font-normal text-lg">📞 Number </p>
                                    <p className="font-normal text-lg">📍 Address </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col p-4 overflow-hidden  rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] lg:shadow-none lg:border-0 bg-white">
                        <h1 className="text-[#658F8D] text-2xl font-bold text-center mb-3 lg:text-3xl "> Pending Network Changes </h1>

                        <div className="flex flex-col overflow-hidden h-full mt-4 lg:gap-2">
                            <div className="flex flex-col gap-2 flex-1 min-h-0  ">
                                <h2 className="text-[#658F8D] text-xl font-bold lg:text-xl"> To Be Added </h2>

                                <div className="flex  flex-col min-h-0 gap-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-3">
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <div className="flex flex-row justify-between items-center border-3 border-[#90EE90] bg-[#FEF5E4] rounded-xl px-2 py-1" key={index}>
                                            <h1 className="font-medium"> John Doe </h1>
                                            <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-4 py-1 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">Undo</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2  flex-1 min-h-0">
                                <h2 className="text-[#658F8D] text-xl font-bold lg:text-xl"> To Be Removed </h2>

                                <div className="flex  flex-col gap-3 overflow-y-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-3">
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <div className="flex flex-row justify-between items-center border-3 border-[#FF7F7F] bg-[#FEF5E4] rounded-xl px-2 py-1 border-t-2" key={index}>
                                            <h1 className="font-medium"> John Doe </h1>
                                            <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-4 py-1 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">Undo</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>






            <button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out lg:mt-auto lg:mb-4"> Commit Network Changes</button>
        </div>
    );
}

export default NetworkComponent;