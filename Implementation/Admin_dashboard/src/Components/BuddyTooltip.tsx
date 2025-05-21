import * as Tooltip from '@radix-ui/react-tooltip';
import { User } from '../interfaces/Interfaces';

type BuddyTooltipProps = {
  user: User;
  className?: string;
};

const BuddyTooltip = ({ user, className = "" }: BuddyTooltipProps) => {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={`cursor-pointer font-semibold ${className}`}>
            {user.first_name} {user.last_name}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="z-50 bg-white text-[#658F8D] p-2 py-4 rounded-xl shadow-md border border-[#B7C0B2] text-md font-semibold whitespace-nowrap"
          >
            <p>📞 {user.phone_number}</p>
            <p>📍 {user.address}</p>
            <Tooltip.Arrow className="fill-[#B7C0B2]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default BuddyTooltip;
