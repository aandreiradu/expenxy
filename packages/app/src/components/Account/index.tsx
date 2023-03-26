import BankCard from '../BankCard';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const Account = () => {
  const carousel = useRef<null | HTMLDivElement>(null);

  const handleArrowsClicks = useCallback((direction: 'left' | 'right') => {
    if (!carousel?.current) return;

    switch (direction) {
      case 'left': {
        const currentScrollLeft = carousel.current.scrollLeft;
        const maxScrollLeft = carousel.current.scrollWidth - carousel.current.clientWidth;

        if (currentScrollLeft >= maxScrollLeft) {
          carousel.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.current.scrollTo({ left: carousel.current.scrollLeft + 208, behavior: 'smooth' });
        }

        break;
      }

      case 'right': {
        const currentScrollLeft = carousel.current.scrollLeft;
        const maxScrollLeft = carousel.current.scrollWidth - carousel.current.clientWidth;
        if (currentScrollLeft === 0) {
          carousel.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
          carousel.current.scrollTo({ left: carousel.current.scrollLeft - 208, behavior: 'smooth' });
        }

        break;
      }
    }
  }, []);

  return (
    <div
      className="
        relative rounded-md flex gap-5 items-center bg-white mt-3 py-5 px-5
        w-full max-w-xl h-52
        
        shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]
      "
    >
      <div className="absolute top-[50%] -translate-y-1/2 -left-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowLeft cursor="pointer" className="w-6 h-6 text-white" onClick={handleArrowsClicks.bind(this, 'right')} />
      </div>
      <div className="w-full overflow-y-auto flex gap-3" ref={carousel}>
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Debit" />
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Savings" />
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Savings" />
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Savings" />
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 -right-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowRight cursor="pointer" className="w-6 h-6 text-white" onClick={handleArrowsClicks.bind(this, 'left')} />
      </div>
    </div>
  );
};

export default Account;
