import BankCard from '../BankCard';
import { ArrowLeft, ArrowRight, Warning } from 'phosphor-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHttpRequest } from '../../hooks/useHttp';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';
import { TAccountsData } from './types';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';
import TopLevelNotification from '../UI/TopLevelNotification';

const Account = () => {
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const [accountsData, setAccountsData] = useState<TAccountsData | []>([]);
  const { error, isLoading, sendRequest } = useHttpRequest();
  const carousel = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    console.log('topLevelNotification state', topLevelNotification);
  }, [topLevelNotification]);

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

  useEffect(() => {
    const getAccountsData = async () => {
      const accountsData = await sendRequest({
        method: 'GET',
        withCredentials: true,
        url: '/getAccounts',
      });

      console.log('accountsData', accountsData);
      if (accountsData) {
        const { message, status } = accountsData;
        if (status === 200) {
          if (message === 'No accounts found') {
            return setAccountsData([]);
          }
          return setAccountsData(accountsData.data.accounts);
        }
      }
    };

    getAccountsData();
  }, []);

  /* Errors */
  useEffect(() => {
    if (error) {
      console.log('__Error Acount', error);
      const { message, status } = error;

      return setTopLevelNotification({
        show: true,
        message: message || 'Someting went wrong, please try again later!',
        icon: <Warning className="w-14 h-8 text-red-700" />,
      });
    }
  }, [error]);

  /* Loading State */
  if (isLoading) {
    return (
      <div className="max-w-md mt-5">
        <Loader
          icon={<PropagateLoader color="#1f1f1f" className="p-2" />}
          loadingText="Getting Your Accounts Data"
          textClasses="text-[#1f1f1f] text-lg  uppercase"
        />
      </div>
    );
  }

  /* Errors */
  if (error && topLevelNotification.show) {
    return (
      <TopLevelNotification
        hasCloseButton={false}
        dismissAfterXMs={error ? 10000 : 5500}
        message={topLevelNotification.message}
        show={topLevelNotification.show}
        onClose={() =>
          setTopLevelNotification({
            show: false,
            message: '',
            icon: <></>,
          })
        }
        icon={topLevelNotification.icon}
      />
    );
  }

  return accountsData?.length > 0 ? (
    <div
      className="
        relative rounded-md flex gap-5 items-center bg-white px-5
        w-full max-w-xl h-52
        shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]
      "
    >
      <div className="absolute top-[50%] -translate-y-1/2 -left-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowLeft cursor="pointer" className="w-6 h-6 text-white" onClick={handleArrowsClicks.bind(this, 'right')} />
      </div>
      <div className="w-full overflow-y-auto flex gap-3" ref={carousel}>
        {accountsData?.map((account) => (
          <BankCard
            key={`${account.bankAccountType.name} ${account.currency.code}`}
            balance={Number(account.balance)}
            currency={account.currency.code}
            type={account.bankAccountType.name}
            name={account.bankAccountType.name}
          />
        ))}
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 -right-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowRight cursor="pointer" className="w-6 h-6 text-white" onClick={handleArrowsClicks.bind(this, 'left')} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Account;
