import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../store/User/index.selector';
import Header from './Header';

const MainContent = ({ children }: PropsWithChildren) => {
  const userData = useSelector(selectUserData);

  return (
    <div className="flex flex-col rounded-md my-0 mx-0 lg:mt-[7rem] lg:mb-10 w-screen h-screen md:max-w-[85vw] max-h-full md:max-h-[800px] bg-red py-7 md:py-[40px] px-5 md:px-10 lg:px-[60px] md:bg-gradient-to-t md:from-[#e6e9f0] md:to-[#eef1f5 sm:ml-0 md:ml-[175px] md:overflow-hidden">
      <Header title={'welcome back'} userFullname={userData?.fullName || userData?.username || ''} />
      {children}
    </div>
  );
};

export default MainContent;
