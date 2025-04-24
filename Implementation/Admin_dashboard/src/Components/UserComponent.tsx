import { UserIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef, useCallback } from "react";
import { getUsers } from "../Services/UserService";
import { searchUsers } from "../Services/UserService";
import { toast } from "react-toastify";
interface User {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    active?: boolean;
    role: 'admin' | 'buddy' | 'superbuddy';
}

function UserComponent() {

    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerms, setSearchTerms] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const [searchPressed, setSearchPressed] = useState(false);

    const triggerRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prev => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const changeSearchTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerms(e.target.value);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's `lg` is 1024px
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await getUsers(page);
                console.log(res);
                setUsers(prev => [...prev, ...res]);
                setHasMore(res.length === 20);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        if (hasMore) {
            fetchUsers();
        }
    }, [page, hasMore])

    useEffect(() => {
        console.log("Users updated:", users.length);
    }, [users]);

    const doSearch = async () => {
        if (searchTerms === '') {
            toast.dismiss();
            toast.error("You need to fill in seach terms.");
            return;
        }

        setSearchPressed(true);
        try {
            const results = await searchUsers(searchTerms);

            // Reset scroll-related state
            setPage(0);
            setHasMore(false);
            setUsers(results ?? []);
        } catch (err) {
            console.error("Search failed:", err);
            toast.error("Search failed. Please try again.");
        }
    };

    const clearSearch = async () => {
        setSearchTerms("");
        setSearchPressed(false);
        setUsers([]);
        setPage(0);
        setHasMore(true); // enable lazy loading again
    };

    return (
        <div className="flex flex-col gap-6 items-center h-full bg-[#F7EFDA] overflow-y-hidden lg:gap-[5vh]">

            <div className="flex flex-row justify-between w-[92vw] items-center mt-[3vh] lg:justify-center lg:mt-[5vh]">
                <h1 className="text-[#658F8D] text-3xl font-bold lg:text-4xl"> User Overview </h1>
                <button className="bg-[#A2A654] text-white font-semibold px-5 py-2 rounded-full  cursor-pointer hover:bg-[#B7BB68] active:scale-[0.98] transition-all duration-150 ease-in-out lg:hidden">Add New</button>
            </div>
            <div className={`flex flex-col gap-2 ${searchPressed ? "mb-8" : 'mb-0'} 
            items-center lg:mb-0 lg:flex-row w-[92vw] h-12 rounded-full bg-white border border-[#B7C0B2]  lg:w-[50vw] lg:gap-4 lg:border-0  lg:justify-center lg:bg-transparent`}>

                <div className="flex flex-row w-[92vw] h-12 rounded-full bg-white border border-[#B7C0B2]  lg:w-[50vw] lg:gap-4 lg:border-0  lg:justify-center lg:bg-transparent">
                    <div className="relative w-full flex items-center">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#658F8D]" />

                        <input
                            type="text"
                            placeholder="Search user name, role ..."
                            value={searchTerms}
                            onChange={changeSearchTerms}
                            className="w-full py-4 pl-12 pr-3 focus:outline-0 text-[#658F8D] placeholder:text-[#658F8D] 
               lg:bg-white lg:border lg:border-[#B7C0B2] lg:py-3 lg:rounded-xl"
                        />
                    </div>
                    <button
                        onClick={doSearch}
                        className="bg-[#658F8D] text-white font-semibold px-5 rounded-full cursor-pointer  hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out lg:h-full lg:py-2 lg:w-30 lg:text-xl"
                    >
                        Search
                    </button>
                </div>

                {(searchPressed) && (
                    <button
                        onClick={clearSearch}
                        className=" py-2  justify-self-center ml-1 lg:ml-0 bg-[#658F8D] text-white font-semibold px-7 rounded-full cursor-pointer  hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out lg:h-full lg:py-2 lg:px-5 lg:w-30 lg:text-xl"
                    >
                        Clear
                    </button>
                )}
            </div>


            <div className="flex flex-col items-center h-full w-[92vw] mb-5 px-2 py-2 rounded-4xl border-1 border-[#E9E2CD] shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] bg-white overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:mb-10">
                {isLargeScreen ? (
                    <>
                        {/* Header */}
                        <div className="w-full font-extrabold text-[#658F8D] text-[18px] xl:text-[20px] border-b-2 border-[#E4DFCC] py-3 px-2 flex items-center">
                            <div className="basis-1/7 mr-5">Id</div>
                            <div className="basis-1/8 mr-5">Name</div>
                            <div className="basis-1/6 mr-5">Phone Number</div>
                            <div className="basis-1/5 mr-5">Address</div>
                            <div className="basis-1/11 mr-2">Role</div>
                            <div className="basis-1/11 mr-2">Status</div>
                            <button className="ml-auto rounded-4xl bg-[#A2A654] hover:bg-[#B7BB68] w-24 text-white  font-extrabold border-[#739B99] text-[14px] xl:text-[16px] h-11 cursor-pointer  active:scale-[0.98] transition-all duration-150 ease-in-out">
                                New User
                            </button>
                        </div>

                        <div className="w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {!loading && users.length === 0 ? (
                                <div className="h-full w-full  flex items-center justify-center  text-[#658F8D] text-3xl font-semibold">
                                    No users matching the search terms were found.
                                </div>
                            ) : users.map((user, index) => (

                                <div
                                    key={user.id}
                                    ref={index === users.length - 10 ? triggerRef : null}
                                    className={`flex items-center w-full h-[12%] min-h-[12%] font-semibold text-[#658F8D] text-[16px] border-[#E4DFCC] px-2 xl:text-[18px] ${index === users.length - 1 ? 'border-b-0' : 'border-b-1'
                                        }`}
                                >
                                    <div className="basis-1/7 flex items-center truncate mr-5">
                                        <span className="truncate">#{index + 1} {user.id}</span>
                                    </div>
                                    <div className="basis-1/8 flex items-center truncate mr-5">
                                        <span className="truncate">{user.first_name} {user.last_name}</span>
                                    </div>
                                    <div className="basis-1/6 flex items-center truncate mr-5">
                                        <span className="truncate">{user.phone_number}</span>
                                    </div>
                                    <div className="basis-1/5 flex items-center truncate mr-5">
                                        <span className="truncate">{user.address}</span>
                                    </div>
                                    <div className="basis-1/11 flex items-center mr-2">{user.role}</div>
                                    <div className="basis-1/11 flex items-center mr-2">
                                        {user.active ? 'Active' : 'Inactive'}
                                    </div>
                                    <button className="ml-auto rounded-4xl bg-[#658F8D] px-6 py-0 text-white font-bold border-[#739B99] text-[16px] h-10 cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {!loading && users.length === 0 ? (
                            <div className="h-full w-full  flex items-center justify-center  text-[#658F8D] text-3xl font-semibold text-center">
                                No users matching the search terms were found.
                            </div>
                        ) : users.map((user, index) => (
                            <div ref={index === users.length - 10 ? triggerRef : null} className={`flex flex-row items-center justify-between w-[100%] ${index === users.length - 1 ? `border-b-0` : `border-b-1`} border-[#E4DFCC] min-h-1/5 max-h-1/5  `} key={index}>
                                <UserIcon className="w-8 h-8 lg:hidden"></UserIcon>
                                <div className="flex flex-col justify-center w-5/8 h-[100%] text-[#658F8D]">
                                    <h2 className="font-bold text-1xl "> #{index + 1} {user.first_name} {user.last_name}</h2>
                                    <h2 className=" text-justify">{user.phone_number} - {user.address} - {user.role}</h2>
                                </div>
                                <button className="rounded-4xl bg-[#658F8D] px-5 py-3 text-white text-lg font-bold border-[#739B99] cursor-pointer hover:bg-[#739B99] active:scale-[0.98] transition-all duration-150 ease-in-out">
                                    Edit
                                </button>
                            </div>
                        ))}
                    </>
                )}


            </div>
        </div>




    );
}

export default UserComponent;