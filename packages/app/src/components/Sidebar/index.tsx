import {
  GoogleChromeLogo,
  Wallet,
  TrashSimple,
  CalendarBlank,
  User,
  Gear,
  SignOut,
} from 'phosphor-react';
import SidebarLink from './SidebarLink';
import type { SidebarLinkProps } from './SidebarLink';

const sidebarIconClasses = `w-8 h-8 group-hover:text-white`;

const sidebarNavigation: SidebarLinkProps[] = [
  {
    href: '/home',
    icon: <GoogleChromeLogo className={sidebarIconClasses} />,
  },
  {
    href: '/wallet',
    icon: <Wallet className={sidebarIconClasses} />,
  },
  {
    href: '/trash',
    icon: <TrashSimple className={sidebarIconClasses} />,
  },
  {
    href: '/calendar',
    icon: <CalendarBlank className={sidebarIconClasses} />,
  },
  {
    href: '/user',
    icon: <User className={sidebarIconClasses} />,
  },
  {
    href: '/settings',
    icon: <Gear className={sidebarIconClasses} />,
  },
];

const Sidebar = () => {
  return (
    <nav className="fixed top-0 left-0 bg-white w-[220px] h-screen flex items-center flex-col ">
      <h1 className="text-center mt-[20px] mb-[40px] uppercase text-[30px]">
        expenxy
      </h1>

      {/* Squares */}
      <div className="shadow-2xl w-[90px] h-[90px] text-center mb-[20px] rounded-[12px] bg-[#1f1f1f] text-white grid content-center justify-center place-items-center  grid-cols-2_20px gap-[10px] twoCols">
        <div className="w-4 h-4 bg-white rounded-sm"></div>
        <div className="w-4 h-4 bg-white rounded-sm"></div>
        <div className="w-4 h-4 bg-white rounded-sm"></div>
        <div className="w-4 h-4 bg-white rounded-sm"></div>
      </div>
      <div className="flex flex-col justify-between items-center h-full pb-10">
        <div className="flex flex-col items-center content-center gap-[40px] mt-5">
          {sidebarNavigation.map((si) => (
            <SidebarLink key={si.href} href={si.href} icon={si.icon} />
          ))}
        </div>
        {/* absolute bottom-[60px] */}
        <div className="p-3 group hover:bg-[#1f1f1f] rounded-md">
          <SignOut className=" w-8 h-8 grid te place-self-center my-0 mx-auto rotate-180 group-hover:text-white group-hover:bg-[#1f1f1f]" />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
