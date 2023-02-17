import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const AuthLayout = ({ children, description, title }: AuthLayoutProps) => {
  return (
    <div className="w-full h-screen flex">
      <div className="flex-1 bg-black flex lg:flex-[0.55] h-full justify-center flex-col">
        <div className="flex flex-col items-start justify-center  text-white lg:w-4/5 sm:w-full pl-14 pr-14 lg:pr-0">
          {children}
        </div>
      </div>
      <div className="hidden lg:flex flex-col flex-1 h-full bg-landing bg-cover bg-no-repeat bg-opacity-40 opacity-80 grayscale">
        <div className="w-3/4 p-24">
          <h2 className="animate-typing text-3xl font-bold mb-4 font-mono w-[27ch] whitespace-nowrap overflow-hidden border-r-4 border-solid border-black">
            {title || 'Your Finances In One Place'}
          </h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
