

function NetworkComponent() {
    return (
        <div className="bg-[#F7EFDA] h-fit flex flex-col justify-center items-center overflow-y-auto py-[3vh] px-4 gap-5 text-[#658F8D]">
            <h1 className="text-[#658F8D] text-center  text-3xl font-bold lg:text-4xl">Client Network Management </h1>

            <div className="flex flex-col w-full gap-3">
                <select className={`bg-white py-3 px-2 border border-[#B7C0B2] rounded-xl text-[#658F8D] font-bold`}>
                    <option value="">Select Client</option>
                </select>
                <select className={`bg-white py-3 px-2 border border-[#B7C0B2] rounded-xl text-[#658F8D] font-bold`}>
                    <option value="">Select Network Layer</option>
                </select>
            </div>

            <div className="flex flex-col p-5 rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3">
                <h1 className="text-[#658F8D] text-center text-2xl font-bold mb-3 lg:text-3xl"> Current Network - John Doe (Layer 1) </h1>
                {Array.from({ length: 7 }).map((_, index) => (
                    <div className="flex flex-row justify-between text-xl" key={index}>
                        <h1> John Doe </h1>
                        <button> Remove </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col p-5 rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3">
                    <h1 className="text-[#658F8D] text-2xl text-center font-bold lg:text-4xl"> Available Buddies </h1>
                    <input placeholder="Search buddies" className=""/>
                    {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-col" key={index}>
                        <h1> John Doe </h1>
                        <p> Number </p>
                        <p> Address </p>
                    </div>
                ))}
                </div>

                <div className="flex flex-col p-5 rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3">
                <h1 className="text-[#658F8D] text-2xl font-bold text-center lg:text-4xl"> Pending Network Changes </h1>

                <h2 className="text-[#658F8D] text-2xl font-bold lg:text-4xl"> To be Added </h2>

                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-row" key={index}>
                        <h1> John Doe </h1>
                        <button>Undo</button>
                    </div>
                ))}

                <h2 className="text-[#658F8D] text-2xl font-bold lg:text-4xl"> To be Removed </h2>

                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-row" key={index}>
                        <h1> John Doe </h1>
                        <button>Undo</button>
                    </div>
                ))}

                </div>
            </div>

            <button> Commit Network Changes</button>
        </div>
    );
}

export default NetworkComponent;