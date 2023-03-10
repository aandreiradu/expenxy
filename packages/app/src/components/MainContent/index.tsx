import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../store/User/index.slice';
import Header from './Header';

const MainContent = ({ children }: PropsWithChildren) => {
  const userData = useSelector(selectUserData);

  return (
    <div className="flex flex-col rounded-md mt-12 mb-10 w-screen h-[90vh] bg-red p-[60px] bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5 sm:ml-0 md:ml-[175px]">
      <Header
        title={'welcome back'}
        userFullname={userData?.fullName || userData?.username || ''}
      />
      {children}
    </div>
  );
};

export default MainContent;
