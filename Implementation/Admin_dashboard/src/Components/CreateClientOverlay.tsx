import { toast } from "react-toastify";
import InputField from "./InputField";
import { useCallback, useState } from "react";
import { createClient, editClient, deleteClient } from "../Services/ClientService";
import { searchSuperbuddies } from "../Services/UserService";
import { getClient } from "../Services/ClientService";
import { useEffect } from "react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import AsyncSelect from "react-select/async";
import { UserForClient } from "../interfaces/Interfaces";


type CreateClientOverlayProps = {
    onClose: () => void;
    edit: boolean;
    id?: string;
};

type OptionType = {
    label: string;
    value: string;
};


type FormErrors = {
    firstName: boolean;
    lastName: boolean;
    deviceCode: boolean;
    phoneNumber: boolean;
    address: boolean;
    superbuddyId: boolean;
};

function CreateClientOverlay({ onClose, edit, id }: CreateClientOverlayProps) {

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [deviceCode, setDeviceCode] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [superbuddyId, setSuperbuddyId] = useState("");
    const [active, setActive] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({
        firstName: false,
        lastName: false,
        deviceCode: false,
        phoneNumber: false,
        address: false,
        superbuddyId: false,
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const openDeleteModal = () => setDeleteConfirmOpen(true);
    const closeDeleteModal = () => setDeleteConfirmOpen(false);
    const [selectedSuperbuddy, setSelectedSuperbuddy] = useState<OptionType | null>(null);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setDeviceCode("");
        setPhonenumber("");
        setAddress("");
        setSuperbuddyId("");
        setActive(true);
        setErrors({
            firstName: false,
            lastName: false,
            deviceCode: false,
            phoneNumber: false,
            address: false,
            superbuddyId: false,
        });
    };


    const loadClientData = useCallback(async () => {
    if (!id) return;
    
    try {
        const client = await getClient(id);
        if (client) {
            setFirstName(client.firstName);
            setLastName(client.lastName);
            setDeviceCode(client.deviceCode);
            setPhonenumber(client.phoneNumber);
            setAddress(client.address);
            setActive(client.active);
            setSuperbuddyId(client.superbuddyId);
            setSelectedSuperbuddy({
                label: client.superbuddyEmail,
                value: client.superbuddyId
            });
        }

    } catch (error) {
        toast.error("Failed to load client data.");
        console.error("Error loading client data:", error);
    }
}, [id]);

    
    const loadSuperbuddyOptions = async (inputValue: string): Promise<OptionType[]> => {
        try {
            const res = await searchSuperbuddies(inputValue);
            console.log(res);
            if (!res) return [];

            const mapped = res.superBuddies.map((user: UserForClient) => ({
                label: user.email,
                value: user.id,
              }));
              console.log("Options:", mapped);
              return mapped;
        } catch (error) {
            console.error("Failed to load superbuddies:", error);
            return [];
        }
    };

    useEffect(() => {
        if (edit && id) {
            loadClientData();
        }
    }, [edit, id, loadClientData]);

    const validateClientForm = (data: {
        firstName: string;
        lastName: string;
        deviceCode: string;
        phoneNumber: string;
        address: string;
        superbuddyId?: string;
        isEdit?: boolean;
    }) => {
        const localErrors: FormErrors = {
            firstName: data.firstName.trim() === "",
            lastName: data.lastName.trim() === "",
            deviceCode: data.deviceCode.trim() === "",
            phoneNumber: data.phoneNumber.trim() === "",
            address: data.address.trim() === "",
            superbuddyId: data.superbuddyId?.trim() === "",
        };

        const isdeviceCodeValid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(data.deviceCode);
        const isPhoneValid = /^\+?[0-9\s\-()]{6,20}$/.test(data.phoneNumber);
        const isNameValid = (name: string) => /^[a-zA-Zà-ÿÀ-ß'’ -]{2,60}$/.test(name.trim());
        const isAddressValid = (address: string) => address.trim().length > 5;

        if (Object.values(localErrors).some((val) => val)) {
            return { valid: false, errors: localErrors, message: "Please fill in all required fields." };
        }

        if (!isNameValid(data.firstName)) return { valid: false, errors: localErrors, message: "Please enter a valid first name." };
        if (!isNameValid(data.lastName)) return { valid: false, errors: localErrors, message: "Please enter a valid last name." };
        if (!isdeviceCodeValid) return { valid: false, errors: localErrors, message: "Please enter a valid deviceCode." };
        if (!isPhoneValid) return { valid: false, errors: localErrors, message: "Please enter a valid phone number." };
        if (!isAddressValid(data.address)) return { valid: false, errors: localErrors, message: "Please enter a valid address." };

        return {
            valid: true, errors: {
                firstName: false,
                lastName: false,
                deviceCode: false,
                phoneNumber: false,
                address: false,
                superbuddyId: false,
            }, message: ""
        };
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();
        setIsSubmitting(true);
        const { valid, errors, message } = validateClientForm({
            firstName,
            lastName,
            deviceCode,
            phoneNumber,
            address,
            superbuddyId,
            isEdit: false,
        });

        setErrors(errors);

        if (!valid) {
            toast.error(message);
            setIsSubmitting(false);
            return;
        }

        try {

            await createClient({
                firstName,
                lastName,
                phoneNumber,
                address,
                deviceCode,
                superbuddyId,
                active,
            });
            toast.success("Client created successfully!");
            setTimeout(() => {
                resetForm();
                onClose(); // Close the modal
                // Refresh the page
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {

        e.preventDefault();
        toast.dismiss();
        setIsSubmitting(true);

        const { valid, errors, message } = validateClientForm({
            firstName,
            lastName,
            deviceCode,
            phoneNumber,
            address,
            superbuddyId,
            isEdit: true,
        });

        setErrors(errors);

        if (!valid) {
            toast.error(message);
            setIsSubmitting(false);
            return;
        }

        if (!id) return;

        console.log(id);
        try {
            await editClient({
                firstName,
                lastName,

                phoneNumber,
                address,
                deviceCode,
                superbuddyId,
                active,
            }, id);
            toast.success("Client data edited successfully!");
            setTimeout(() => {
                resetForm();
                onClose(); // Close the modal
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();

        if (!id) return;

        try {
            await deleteClient(id);
            toast.success("Client deleted successfully!");
            setTimeout(() => {
                resetForm();
                onClose(); // Close the modal
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30 px-4">
            <div className="lg:flex lg:flex-col relative  items-center bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-1 border-[#C3B295] overflow-y-scroll max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[60vw]  lg:max-h-[90vh] lg:h-auto  lg:py-[3.5vh]">
                <div onClick={() => { onClose(); resetForm() }} className="absolute top-4 right-4 text-2xl text-[#658F8D] cursor-pointer hidden lg:block mr-2 hover:text-gray-700  active:scale-[0.9]">
                    ✕
                </div>
                <div className="flex justify-between items-center mb-8 lg:justify-center">
                    <h2 className="text-xl font-bold text-[#658F8D] lg:text-4xl">{!edit ? "Create New Client" : `Edit Client`}</h2>
                    <button onClick={() => { onClose(); resetForm() }} className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer active:scale-[0.9] lg:hidden">✕</button>
                </div>

                <form className="flex flex-col space-y-4 lg:w-[80%] justify-center items-center lg:space-y-[3vh]">
                    <div className="flex flex-col lg:flex-row w-full gap-5">
                        <InputField
                            label="First Name"
                            name="FirstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errors.firstName}
                        />

                        <InputField
                            label="Last Name"
                            name="LastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors.lastName}
                        />
                    </div>


                    <InputField
                        label="Device code"
                        name="deviceCode"
                        placeholder="Device code"
                        value={deviceCode}
                        onChange={(e) => setDeviceCode(e.target.value)}
                        error={errors.deviceCode}
                    />

                    <InputField
                        label="Phone Number"
                        name="PhoneNumber"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        error={errors.phoneNumber}
                    />

                    <InputField
                        label="Address"
                        name="address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        error={errors.address}
                    />

                    <div className="flex flex-col lg:flex-row w-full gap-5 ">
                        <div className="flex flex-col gap-1 w-full ">
                            <label className="text-[#658F8D] text-lg font-medium">{errors.superbuddyId && "!"} Superbuddy </label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadSuperbuddyOptions}
                                defaultOptions={true}
                                onChange={(selected) => {
                                    setSuperbuddyId((selected as OptionType)?.value || "");
                                    setSelectedSuperbuddy(selected as OptionType); // ← Update state
                                  }}
                                placeholder="Search Superbuddy Email..."
                                value={selectedSuperbuddy}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#F7F7F7",
                                        borderColor: errors.superbuddyId ? "red" : "#C3B295",
                                        minHeight: "48px",
                                        borderWidth: errors.superbuddyId ? 2 : 1,
                                        boxShadow: "none",
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#658F8D",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "#658F8D",
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full ">
                            <label className="text-[#658F8D] text-lg font-medium"> Active </label>
                            <select
                                name="active"
                                className={`w-full h-[48px] p-3 border border-[#C3B295] rounded-lg text-[#658F8D] text-base  bg-[#F7F7F7] placeholder-[#658F8D] focus:outline-[#C3B295] disabled:opacity-60 disabled:cursor-not-allowed`}
                                value={String(active)}
                                onChange={(e) => setActive(e.target.value === "true")}

                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>


                            </select>
                        </div>
                    </div>
                    <div className={`${edit ? 'mt-7' : 'mt-0'} flex w-full justify-between mt-3`}>

                        <div className={`${!edit ? 'hidden' : 'block'} flex flex-row w-full justify-between`}>
                            <button
                                type="button"
                                className="bg-[#D96C6C] hover:bg-[#C0504D] text-white font-semibold px-4 py-2 rounded-md cursor-pointer active:scale-[0.98] transition-all duration-150 ease-in-out lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                                onClick={openDeleteModal}
                            >
                                Delete Client
                            </button>

                        </div>
                        <div className="flex flex-row w-full justify-between">
                            <button
                                type="button"
                                onClick={() => { onClose(); resetForm() }}
                                className="px-4 py-2 rounded-md border text-[#658F8D] bg-[#F7EFDA] hover:bg-[#ece9dc]  border-[#B7C0B2] cursor-pointer active:scale-[0.98] transition-all duration-150 ease-in-out lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                            >
                                Cancel
                            </button>

                            <button

                                className="px-4 py-2 rounded-md text-white bg-[#658F8D] hover:bg-[#739B99] active:scale-[0.98]  transition-all duration-150 ease-in-out cursor-pointer lg:rounded-xl lg:font-bold lg:text-xl lg:px-5"
                                onClick={!edit ? handleCreate : handleEdit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ClipLoader size={20} color="#ffffff" />
                                        <span className="ml-2">Loading...</span>
                                    </>
                                ) : (
                                    edit ? 'Edit' : 'Create'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Modal
                isOpen={deleteConfirmOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Confirm Delete"
                className="bg-white border-1 border-[#B7C0B2] rounded-3xl p-6 max-w-lg w-[90%] mx-auto shadow-xl"
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50"
            >
                <h2 className="text-xl lg:text-3xl font-bold text-[#658F8D] mb-6 text-center">
                    Are you sure you want to delete this client?
                </h2>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={(e) => {
                            closeDeleteModal();
                            handleDelete(e);
                        }}
                        className="rounded-3xl bg-[#D96C6C] px-6 py-2 text-white font-semibold hover:bg-[#C0504D] text-lg lg:text-2xl hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out transform cursor-pointer"
                    >
                        Yes, delete
                    </button>
                    <button
                        onClick={closeDeleteModal}
                        className="rounded-3xl text-lg lg:text-2xl bg-[#E4DFCC] px-6 py-2 text-[#658F8D] font-semibold hover:bg-[#e7e1c7] hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out transform cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

        </div >
    );
}

export default CreateClientOverlay;