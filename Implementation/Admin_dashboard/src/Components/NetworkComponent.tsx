import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchClients } from '../Services/ClientService';
import { toast } from "react-toastify";
import { reactSelectClassNames } from '../utils/reactSelectStyles';
import { getClientNetwork, sendNetworkChanges } from '../Services/NetworkService';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from "react-select";
import AsyncSelect from 'react-select/async';
import { searchUsers } from '../Services/UserService';
import { Client, User } from '../interfaces/Interfaces';
import BuddyTooltip from './BuddyTooltip';

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
    const [clientNetwork, setClientNetwork] = useState<User[]>([]);
    const [searchTerms, setSearchterms] = useState("");
    const [buddies, setBuddies] = useState<User[]>([]);
    const [toBeAdded, setToBeAdded] = useState<User[]>([]);
    const [toBeRemoved, setToBeRemoved] = useState<User[]>([]);
    const [comit, setComit] = useState(1);
    const [layer1Network, setLayer1Network] = useState<User[]>([]);
    const [layer2Network, setLayer2Network] = useState<User[]>([]);
    const oppositeLayerIds = selectedLayer === "1"
        ? layer2Network.map(u => u.id)
        : layer1Network.map(u => u.id);


    const loadClientOptions = async (inputValue: string): Promise<OptionType[]> => {
        try {
            const res = await searchClients(inputValue, 5);
            console.log(res);
            if (!res) return [];

            const mappped = res.map((client: Client) => ({
                label: client.first_name + " " + client.last_name + " - " + client.address + " - " + client.phone_number,
                value: client.id
            }));
            return mappped;
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error");
            }
            return [];
        }
    }

    useEffect(() => {
        if (!selectedClient) return;

        const fetchAllLayers = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    getClientNetwork(selectedClient.value, "1"),
                    getClientNetwork(selectedClient.value, "2"),
                ]);

                const layer1Users = res1; // now full User[]
                const layer2Users = res2;

                setLayer1Network(layer1Users);
                setLayer2Network(layer2Users);

                if (selectedLayer === "1") {
                    setClientNetwork(layer1Users);
                } else if (selectedLayer === "2") {
                    setClientNetwork(layer2Users);
                }

                setToBeAdded([]);
                setToBeRemoved([]);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Unknown error");
                }
            }
        };

        fetchAllLayers();
    }, [selectedClient, selectedLayer, comit]);


    useEffect(() => {


        const getBuddies = async () => {
            try {

                const res = await searchUsers(searchTerms);
                console.log(res);
                setBuddies(res ?? []);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Unknown error");
                }
            }

        };
        getBuddies();

    }, [searchTerms])

    const handleRemoveBuddy = (buddyId: string) => {
        const buddyToRemove = clientNetwork.find(b => b.id === buddyId);
        if (!buddyToRemove) return;
      
        setClientNetwork(prev => prev.filter(b => b.id !== buddyId));
        setToBeRemoved(prev => [...prev, buddyToRemove]);
      };

    const handleAddBuddy = (buddy: User) => {
        const alreadyInNetwork = clientNetwork.some(b => b.id === buddy.id);
        const alreadyAdded = toBeAdded.some(b => b.id === buddy.id);
    
        if (!alreadyInNetwork && !alreadyAdded) {
            setToBeAdded(prev => [...prev, buddy]);
        }
    };

    const handleUndoAdd = (buddyId: string) => {
        setToBeAdded(prev => prev.filter(b => b.id !== buddyId));
    }

    const handleUndoRemove = (buddyId: string) => {
        const buddyToRestore = toBeRemoved.find(b => b.id === buddyId);
        if (!buddyToRestore) return;
      
        setToBeRemoved(prev => prev.filter(b => b.id !== buddyId));
        setClientNetwork(prev => [...prev, buddyToRestore]);
      };
      

    const commitNetworkChanges = async () => {
        if (!selectedClient || !selectedLayer) return;

        const payload = {
            clientId: selectedClient.value,
            addBuddies: toBeAdded.map(b => b.id),
            removeBuddies: toBeRemoved.map(b => b.id),
            layer: parseInt(selectedLayer),
        };

        try {
            // Replace this with your actual service call
            toast.loading("Sending netowrk changes");
            await sendNetworkChanges(payload);

            toast.dismiss();
            toast.success("Network changes submitted!");

            // Clear pending changes
            setToBeAdded([]);
            setToBeRemoved([]);
            setComit(prev => prev + 1);
            // Optionally, refresh current network


        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.dismiss();
                toast.error(error.message);
            } else {
                toast.dismiss();
                toast.error("Unknown error");
            }
        }
    };

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
                    <h1 className="text-[#658F8D] text-center text-xl font-semibold pb-3 border-b-1 border-[#E9E2CD]">
                        {`${selectedClient?.label} - Layer ${selectedLayer}`}
                    </h1>
                    <div className="flex flex-1 flex-col gap-3 pr-2 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#E4DFCC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb:hover]:bg-[#cfc8af] lg:gap-7 pb-2">
                        {clientNetwork.length > 0 ? (clientNetwork.map((buddy, index) => (
                            <div className="flex flex-row items-center justify-between text-xl" key={index}>
                                <BuddyTooltip user={buddy} />
                                <button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out"
                                    onClick={() => handleRemoveBuddy(buddy.id)}>
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
                            <input placeholder="Search buddies" className="w-full p-2 pl-10 border rounded-xl border-[#B7C0B2] bg-[#FEF5E4] placeholder:text-[#658F8D] placeholder:font-semibold font-semibold focus:outline-[#B7C0B2] " value={searchTerms} onChange={(e) => { setSearchterms(e.target.value) }} />
                        </div>
                        {buddies.length > 0 ? (<div className="flex flex-col min-h-0 gap-1 px-2 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#E4DFCC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb:hover]:bg-[#cfc8af]">
                            {
                                buddies
                                    .filter(
                                        (buddy) =>
                                            !clientNetwork.some(b => b.id === buddy.id) &&
                                            !oppositeLayerIds.includes(buddy.id) &&
                                            !toBeAdded.some((b) => b.id === buddy.id) &&
                                            !toBeRemoved.some((b) => b.id === buddy.id)
                                    ).map((buddy, index) => (
                                        <div className="flex flex-col border border-[#B7C0B2] rounded-xl py-2 px-3 bg-[#FEF5E4] gap-1" key={index}>
                                            <div className="flex flex-row justify-between items-center">
                                                <h1 className="font-semibold text-2xl"> {`${buddy.first_name} ${buddy.last_name}`} </h1>
                                                <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out" onClick={() => handleAddBuddy(buddy)}>Add</button>
                                            </div>
                                            <p className="font-normal text-lg">📞 {buddy.phone_number} </p>
                                            <p className="font-normal text-lg">📍 {buddy.address} </p>
                                        </div>
                                    ))}
                        </div>) : (
                            <div className='h-full mt-4'>
                                <p className='w-full text-lg font-bold'>No buddies matching the search terms were found.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col p-4 overflow-hidden  rounded-2xl border border-[#E9E2CD] w-full shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] lg:shadow-none lg:border-0 lg:border-l-1 lg:rounded-none bg-white">
                        <h1 className="text-[#658F8D] text-2xl font-bold text-center mb-3 lg:text-3xl "> Pending Network Changes </h1>

                        <div className="flex flex-col overflow-hidden h-full mt-4 lg:gap-2">
                            <div className="flex flex-col gap-2 flex-1 min-h-0  ">
                                <h2 className="text-[#658F8D] text-xl font-bold lg:text-xl"> To Be Added </h2>

                                <div className="flex  flex-col gap-3 overflow-y-auto border-t-1 border-[#E4DFCC] pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-3">
                                    {toBeAdded.length > 0 ? (<div className="flex  flex-col min-h-0 gap-3  pr-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#E4DFCC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb:hover]:bg-[#cfc8af] lg:gap-3 mt-3">
                                        {toBeAdded.map((buddy, index) => (
                                            <div className="flex flex-row justify-between items-center border-3  border-[#90EE90]   bg-[#FEF5E4] rounded-xl px-2 py-1" key={index}>
                                                <BuddyTooltip user={buddy} />
                                                <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-4 py-1 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out" onClick={() => handleUndoAdd(buddy.id)}>Undo</button>
                                            </div>
                                        ))}
                                    </div>) : (
                                        <p className='font-semibold text-xl mt-3'>None.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2  flex-1 min-h-0">
                                <h2 className="text-[#658F8D] text-xl font-bold lg:text-xl"> To Be Removed </h2>

                                <div className="flex  flex-col gap-3 overflow-y-auto border-t-1 border-[#E4DFCC] pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-3">
                                    {toBeRemoved.length > 0 ? (<div className="flex  flex-col min-h-0 gap-3 pr-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#E4DFCC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb:hover]:bg-[#cfc8af] lg:gap-3 mt-3">
                                        {toBeRemoved.map((buddy, index) => (
                                            <div className="flex flex-row justify-between items-center border-3 border-[#e64a1b] bg-[#FEF5E4] rounded-xl px-2 py-1" key={index}>
                                                <BuddyTooltip user={buddy} />
                                                <button className="bg-[#658F8D] text-white rounded-2xl text-md border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-4 py-1 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out" onClick={() => handleUndoRemove(buddy.id)}>Undo</button>
                                            </div>
                                        ))}
                                    </div>) : (
                                        <p className='font-semibold text-xl mt-3'>None.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>)}






            {selectedClient && selectedLayer && (<button className="bg-[#658F8D] text-white rounded-2xl text-lg border border-[#5B7C6F] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] px-3 py-2 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out lg:mt-auto lg:mb-4" onClick={commitNetworkChanges}> Commit Network Changes</button>)}
        </div>

    );
}

export default NetworkComponent;