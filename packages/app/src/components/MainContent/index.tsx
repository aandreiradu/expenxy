import { PropsWithChildren } from 'react';
import Header from './Header';

const index = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col rounded-md mt-12 mb-10 w-screen h-[90vh] bg-red ml-[220px] p-[60px] bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5">
      <Header title={'welcome back'} userFullname={'Andrei Radu'} />
      {children}
    </div>
  );
};

export default index;
