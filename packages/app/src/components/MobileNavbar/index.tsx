import { Transition } from '@headlessui/react';
import { List, SignOut, X } from 'phosphor-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { ISidebarProps, sidebarNavigation } from '../Sidebar';
import SidebarLink from '../Sidebar/SidebarLink';
import { useHttpRequest } from '../../hooks/useHttp';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/User/index.slice';

const MobileNav: FC<ISidebarProps> = ({ setShowComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendRequest, error, isLoading } = useHttpRequest();
  const [show, setShow] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  const sidebarHandler = useCallback(() => {
    if (show) {
      document.querySelector('body')!.style.overflow = 'unset';
      setShow(false);
    } else {
      document.querySelector('body')!.style.overflow = 'hidden';
      setShow(true);
    }
  }, [show]);

  const handleLogOut = useCallback(async () => {
    const response = await sendRequest({
      method: 'GET',
      url: '/logout',
      withCredentials: true,
    });

    if (response?.data) {
      const { status } = response;
      const { message } = response.data;

      if ((message === 'Logout completed' && status === 200) || status === 204) {
        dispatch(logOut());
        navigate('/login');
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      setShowModal({
        show: true,
        message: error.message || 'Unexpected error occured',
      });
    }
  }, [error]);

  return (
    <>
      {/* {!show && ( */}
      <nav className="w-full flex justify-between items-center h-full bg-[#1f1f1f] p-4 md:hidden">
        <div>
          <h1 className="uppercase text-lg text-white">expenxy</h1>
        </div>
        <List onClick={sidebarHandler} className="text-white w-7 h-7 cursor-pointer" />
      </nav>
      {/* )} */}
      {show && (
        <Transition.Root show={show} className="md:hidden">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </Transition.Child>
          <Transition.Child
            as="section"
            className="w-3/4 h-full bg-[#1f1f1f] absolute top-0 left-0 right-0 z-20 flex flex-col p-5"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="flex justify-between items-center pb-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-yellow-400 after:animate-growingWidth">
              <h1 className="text-center uppercase text-lg text-white">expenxy</h1>
              <X onClick={sidebarHandler} className="text-white w-6 h-6 cursor-pointer ml-auto" />
            </div>
            <ul>
              {sidebarNavigation.map((si) => (
                <li key={si.href} className="flex items-center text-white my-7 cursor-pointer">
                  <SidebarLink
                    key={si.href}
                    href={si.href}
                    icon={si.icon}
                    setShowComponent={() => {
                      setShowComponent({ show: true, componentName: si.name });
                      setShow(false);
                    }}
                    name={si.name}
                    isLink={si.isLink}
                    className="flex items-center gap-2"
                  >
                    {si.name}
                  </SidebarLink>
                </li>
              ))}
            </ul>
            {/* </section> */}

            <div
              className="cursor-pointer mt-auto p-3 flex items-center gap-x-2 rounded-md relative before:absolute before:left-0 before:-top-4 before:w-full before:h-[1px] before:bg-gray-400"
              onClick={handleLogOut}
            >
              <SignOut className=" w-8 h-8 text-white rotate-180 group-hover:text-white " onClick={handleLogOut} />
              <span className="text-base text-white">LogOut</span>
            </div>
          </Transition.Child>
        </Transition.Root>
      )}
    </>
  );
};

export default MobileNav;
