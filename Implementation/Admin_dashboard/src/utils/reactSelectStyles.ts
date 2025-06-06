import { ClassNamesConfig } from 'react-select';

// Define type for options (adjust Option type as needed)
type Option = { label: string; value: string };
export const reactSelectClassNames: ClassNamesConfig<Option, boolean> = {
    container: () => "w-full",
    
    control: ({ isFocused }) =>
        `bg-white py-3 px-2 border ${isFocused ? "border-[#658F8D]" : "border-[#B7C0B2]"
        } rounded-xl text-[#658F8D] font-bold w-full`,

    placeholder: () => "text-[#658F8D] font-bold",
    singleValue: () => "text-[#658F8D] font-bold",
    noOptionsMessage: () => "text-[#658F8D] text-center py-2 font-semibold",
    loadingMessage: () => "text-[#658F8D] text-center py-2 font-semibold",
    menu: () =>
        "bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#E9E2CD] overflow-hidden z-50 font-bold",

    option: ({ isFocused, isSelected }) =>
        `cursor-pointer px-4 py-2 text-xl transition-colors duration-150 ${isSelected
            ? "bg-[#C3DCD2] text-[#345452]"
            : isFocused
                ? "bg-[#E5F4F3] text-[#658F8D]"
                : "bg-white text-[#658F8D]"
        } hover:bg-[#DDEEEA]`,
    menuList: () => "text-[#658F8D]",
    
    dropdownIndicator: () => "text-[#658F8D]",
    indicatorSeparator: () => "hidden",
    input: () => "text-[#658F8D] font-bold",
};
