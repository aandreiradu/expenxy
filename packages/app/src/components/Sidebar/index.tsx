import {
  GoogleChromeLogo,
  Wallet,
  TrashSimple,
  CalendarBlank,
  User,
  Gear,
  SignOut,
  Plus,
} from 'phosphor-react';
import SidebarLink from './SidebarLink';
import type { SidebarLinkProps } from './SidebarLink';
import { useAppDispatch } from '../../store/hooks';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHttpRequest } from '../../hooks/useHttp';
import { logOut } from '../../store/User/index.slice';
import { useNavigate } from 'react-router-dom';
import Modal from '../UI/Modal';
import { TShowComponent } from '../../pages/Home';

const sidebarIconClasses = `w-8 h-8 group-hover:text-white`;

export const sidebarNavigation: SidebarLinkProps[] = [
  {
    href: '/add-transaction',
    icon: <Plus className={sidebarIconClasses} />,
    name: 'AddTransaction',
    setShowComponent: () => {},
  },
  {
    href: '/wallet',
    name: 'Wallet',
    icon: <Wallet className={sidebarIconClasses} />,
    setShowComponent: () => {},
  },
  {
    href: '/trash',
    icon: <TrashSimple className={sidebarIconClasses} />,
    name: 'Trash',
    setShowComponent: () => {},
  },
  {
    href: '/calendar',
    icon: <CalendarBlank className={sidebarIconClasses} />,
    name: 'Calendar',
    setShowComponent: () => {},
  },
  {
    href: '/user',
    icon: <User className={sidebarIconClasses} />,
    name: 'User',
    setShowComponent: () => {},
  },
  {
    href: '/settings',
    icon: <Gear className={sidebarIconClasses} />,
    name: 'Settings',
    setShowComponent: () => {},
  },
];

interface ISidebarProps {
  setShowComponent: Dispatch<
    SetStateAction<{
      show: boolean;
      componentName: string;
    }>
  >;
}

const Sidebar = ({ setShowComponent }: ISidebarProps) => {
  const [showModal, setShowModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });
  const navigate = useNavigate();
  const { sendRequest, error, isLoading } = useHttpRequest();
  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(async () => {
    const response = await sendRequest({
      method: 'GET',
      url: '/logout',
      withCredentials: true,
    });

    if (response?.data) {
      const { status } = response;
      const { message } = response.data;

      if (
        (message === 'Logout completed' && status === 200) ||
        status === 204
      ) {
        console.log('logout completed');
        dispatch(logOut());
        navigate('/login');
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.log('error login', error);
      setShowModal({
        show: true,
        message: error.message || 'Unexpected error occured',
      });
    }
  }, [error]);

  return (
    <nav className="fixed top-0 left-0 bg-white w-[175px] h-screen  items-center flex-col hidden md:flex">
      <h1 className="text-center mt-[20px] mb-[40px] uppercase text-[30px]">
        expenxy
      </h1>

      {error && showModal && (
        <Modal
          onConfirm={() => setShowModal({ message: '', show: false })}
          show={showModal.show}
          title={'Ooops'}
          message={error.message}
        />
      )}

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
            <SidebarLink
              key={si.href}
              href={si.href}
              icon={si.icon}
              setShowComponent={setShowComponent}
              name={si.name}
            />
          ))}
        </div>
        <div className="p-3 group hover:bg-[#1f1f1f] rounded-md">
          <SignOut
            className=" w-8 h-8 grid te place-self-center my-0 mx-auto rotate-180 group-hover:text-white group-hover:bg-[#1f1f1f]"
            onClick={handleLogOut}
          />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
