import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchClients } from '../Services/ClientService';
import { toast } from "react-toastify";
import { reactSelectClassNames } from '../utils/reactSelectStyles';
import { getClientNetwork } from '../Services/NetworkService';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from "react-select";
import AsyncSelect from 'react-select/async';

type OptionType = {
    label: string;
    value: string;
};


function NetworkComponent() {

    const options: OptionType[] = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
    ];

    const [selectedClient, setSelectedClient] = useState<OptionType | null>(null);
    const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
    const [clientNetwork, setClientNetwork] = useState<string[]>([]);


    const loadClientOptions = async (inputValue: string): Promise<OptionType[]> => {
        try {
            const res = await searchClients(inputValue, 5);
            console.log(res);
            if (!res) return [];

            const mappped = res.map((client: any) => ({
                label: client.first_name + " " + client.last_name + " - " + client.address + " - " + client.phone_number,
                value: client.id
            }));
            return mappped;
        } catch (error: any) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error");
            }
            return [];
        }
    }

    useEffect(() => {
        if (selectedClient === null || selectedLayer === null) {
            return;
        }

        const fetchClientNetwork = async () => {
            try {

                const res = await getClientNetwork(selectedClient.value, selectedLayer);
                const buddyIds = res.map((r: any) => r.buddy_id);
                setClientNetwork(buddyIds);
            } catch (error: any) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Unknown error");
                }
            }
        };

        fetchClientNetwork();





    }, [selectedClient, selectedLayer])



    return (
        <div className="flex flex-col items-center gap-5 text-[#658F8D] w-full h-full bg-[#F7EFDA] px-4 pb-4 overflow-y-scroll lg:overflow-y-hidden lg:px-[4vw] xl:px-[8vw] 2xl:px-[12vw] lg:gap-[4vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <h1 className="text-[#658F8D] text-center  text-3xl font-bold lg:text-4xl lg:mt-[3vh]">Client Network Management </h1>

            <div className="flex flex-col w-full gap-3 lg:flex-row lg:gap-10">
                <AsyncSelect
                    classNames={reactSelectClassNames}
                    unstyled  /* remove default styles, use Tailwind */
                    cacheOptions
                    defaultOptions={true}
                    loadOptions={(input, callback) => {
                        loadClientOptions(input).then(callback);
                    }}
                    value={selectedClient}
                    onChange={(selectedOption) => setSelectedClient(selectedOption as OptionType | null)}
                    placeholder="Select Client"
                />

                <Select<OptionType>
                    options={options}
                    unstyled
                    classNames={reactSelectClassNames}
                    value={options.find((opt) => opt.value === selectedLayer) || null}
                    onChange={(selected: SingleValue<OptionType>) =>
                        setSelectedLayer(selected?.value || null)
                    }
                    placeholder="Select Layer"
                />

            </div>

            
            {selectedClient && selectedLayer && (<div className="flex flex-col gap-5 lg:flex-row items-center lg:h-full w-full  lg:overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
                <div className="flex flex-col p-6 rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3 lg:w-1/3 h-full min-h-0">
                    <h1 className="text-[#658F8D] text-center text-2xl font-bold  lg:text-2xl">
                        {`Current Network`}
                    </h1>
                    <h1 className="text-[#658F8D] text-center text-xl font-semibold mb-3">
                        {`${selectedClient?.label} - Layer ${selectedLayer}`}
                    </h1>
                    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-7 pb-2">
                        {clientNetwork.length > 0 ? (clientNetwork.map((buddy, index) => (
                            <div className="flex flex-row items-center justify-between text-xl" key={index}>
                                <h1> {`${buddy}`} </h1>
                                <button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                                    Remove
                                </button>
                            </div>
                        ))) : (
                            <div className="w-full h-full flex items-center">
                                <h1 className='text-2xl text-center font-bold'>No buddies currently added to the network.</h1>
                            </div>
                        )}
                    </div>
                </div>



                <div className="flex flex-col lg:p-3 gap-4 w-full lg:flex-row lg:gap-0 lg:w-2/3 h-[100%] lg:bg-white lg:rounded-2xl lg:border lg:border-[#E9E2CD] lg:shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] ">
                    <div className="flex flex-col  rounded-2xl border border-[#E9E2CD] p-4 w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white gap-3 lg:bg-transparent lg:shadow-none lg:border-0 ">
                        <h1 className="text-[#658F8D] text-2xl text-center font-bold lg:text-3xl lg:mb-3"> Available Buddies </h1>
                        <div className='relative w-full'>
                            <MagnifyingGlassIcon className='w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#658F8D]' />
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


            </div>)}






            {selectedClient && selectedLayer && (<button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out lg:mt-auto lg:mb-4"> Commit Network Changes</button>)}
        </div>
    
    );
}

export default NetworkComponent;