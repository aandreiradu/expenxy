import React from 'react';
import { Link } from 'react-router-dom';

interface UsefulPages {
  name: string;
  path: string;
}

const usefulPages: UsefulPages[] = [
  {
    name: 'login',
    path: '/login',
  },
  {
    name: 'register',
    path: '/register',
  },
  {
    name: 'contact',
    path: '/contact',
  },
];

const NotFound = () => {
  return (
    <section className="w-full h-screen bg-[#1f1f1f] text-white p-4 lg:p-14 bg-landing bg-cover bg-center inset-0 bg-no-repeat bg-opacity-60 relative z-10 overflow-hidden brightness-[90%]">
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 -z-[1]"></div>
      <h1 className="lg:text-3xl lg:text-left sm:text-center text-lg">
        EXPENXY
      </h1>
      <div className="h-full w-full text-white mt-4 grid place-content-center">
        <p className="text-2xl lg:text-5xl uppercase text-center font-bold lg:tracking-widest">
          Page not found
        </p>
        <span className="leading-5 text-base lg:text-lg text-center mt-2 lg:leading-6">
          Unfortunately, the page you are looking for does not exist. <br /> But
          there are other useful pages:
        </span>
        {usefulPages?.length > 0 && (
          <ul className="flex items-center justify-center space-x-7 lg:space-x-10 mt-4">
            {usefulPages.map((page) => (
              <Link
                className="bg-[#1f1f1f] text-white py-2 px-3 rounded-xl border-2 border-transparent hover:border-[#7289DA] transition-all ease-linear"
                key={page.path}
                to={page.path}
              >
                {page.name.toLocaleUpperCase()}
              </Link>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default NotFound;
