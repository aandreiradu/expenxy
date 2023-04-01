import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../store/User/index.selector';
import Header from './Header';

const MainContent = ({ children }: PropsWithChildren) => {
  const userData = useSelector(selectUserData);

  return (
    <div className="flex flex-col rounded-md mt-[7rem] mb-10 w-screen h-screen md:max-w-[85vw] md:max-h-[800px] bg-red py-[40px] px-[60px] bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5 sm:ml-0 md:ml-[175px] overflow-hidden">
      <Header title={'welcome back'} userFullname={userData?.fullName || userData?.username || ''} />
      {children}
    </div>
  );
};

export default MainContent;
