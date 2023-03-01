import { List, X } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { sidebarNavigation } from '../Sidebar';
import SidebarLink from '../Sidebar/SidebarLink';

const MobileNav = () => {
  const [show, setShow] = useState<boolean>(false);

  const sidebarHandler = useCallback(() => {
    if (show) {
      console.log('inchide');
      setShow(false);
    } else {
      console.log('deschide');
      setShow(true);
    }
  }, [show]);

  return (
    <>
      {!show && (
        <nav className="w-full flex justify-between items-center h-full bg-[#1f1f1f] p-4 md:hidden">
          <div>
            <h1 className="uppercase text-lg text-white">expenxy</h1>
          </div>
          <List
            onClick={sidebarHandler}
            className="text-white w-7 h-7 cursor-pointer"
          />
        </nav>
      )}
      {show && (
        <section
          className={`w-3/4 h-full bg-[#1f1f1f] absolute top-0 left-0 right-0 z-20 flex flex-col p-5 translate-x-[-200%] ${
            show && `translate-x-0`
          } transition-all`}
        >
          <div className="flex justify-between items-center pb-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-yellow-400 after:animate-growingWidth">
            <h1 className="text-center uppercase text-lg text-white">
              expenxy
            </h1>
            <X
              onClick={sidebarHandler}
              className="text-white w-6 h-6 cursor-pointer ml-auto"
            />
          </div>
          <ul>
            {sidebarNavigation.map((si) => (
              <li
                key={si.href}
                className="flex items-center text-white my-7 cursor-pointer"
              >
                <SidebarLink
                  href={si.href}
                  icon={si.icon}
                  name={si.name}
                  className="mr-2 hover:pointer-events-none p-1"
                />
                {si.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default MobileNav;
