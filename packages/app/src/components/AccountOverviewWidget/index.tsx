import React, { useEffect, useState } from 'react';
import { useHttpRequest } from '../../hooks/useHttp';
import { useSelector } from 'react-redux';
import { accountSelected } from '../../store/User/index.selector';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';
import AccountOverviewHeader from './overviewHeader';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';
import TopLevelNotification from '../UI/TopLevelNotification';

const ExpensesWidget = () => {
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const [accountOverviewData, setAccountOverviewData] = useState({
    incomesPercentage: 0,
    expensesPercentage: 0,
    favoriteMerchant: '',
  });
  const accountSelectedId = useSelector(accountSelected);
  const { isLoading, error, sendRequest } = useHttpRequest();

  useEffect(() => {
    const getAccountOverview = async () => {
      const accountOverviewResponse = await sendRequest({
        method: 'GET',
        url: `/accountOverview?overviewFilter=${'THISMONTH'}&accountId=${accountSelectedId}`,
        withCredentials: true,
      });

      console.log('accountOverviewResponse', accountOverviewResponse);

      if (accountOverviewResponse) {
        const { name, incomes, expenses, merchant } = accountOverviewResponse?.data;

        if (name) {
          setAccountOverviewData((prev) => ({
            ...prev,
            incomesPercentage: Number(incomes.percentage || 0),
            expensesPercentage: Number(expenses.percentage || 0),
            favoriteMerchant: merchant.name,
          }));
        }
      }
    };

    getAccountOverview();
  }, [accountSelectedId]);

  useEffect(() => {
    console.log('accountOverviewData', accountOverviewData);
  }, [accountOverviewData]);

  return (
    <div className="relative w-full h-full max-h-[350px] overflow-hidden">
      {error && topLevelNotification.show && (
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
      )}

      <div className="sticky top-0 left-0 w-full flex justify-between items-center py-3">
        <p className="text-black font-bold text-lg">Account Overview</p>
        <span className="w-fit text-xl cursor-pointer relative after:content-[''] after:absolute after:w-full after:bottom-0 after:left-0 after:h-[2px] after:bg-gray-400 px-5 leading-7 text-[12px] text-gray-400 after:hover:w-full after:hover:animate-growingWidth after:focus:w-full after:focus:animate-growingWidth after:hover:bg-yellow-400">
          This month
        </span>
      </div>
      <div className="relative w-full h-full max-h-[300px] flex flex-col items-center gap-3 overflow-y-auto">
        {isLoading ? (
          <div className="max-w-md mt-5">
            <Loader
              icon={<PropagateLoader color="#1f1f1f" className="p-2" />}
              loadingText="Getting your latest transactions"
              textClasses="text-[#1f1f1f] text-lg  uppercase"
            />
          </div>
        ) : Object.keys(accountOverviewData).length > 0 ? (
          <div className="flex flex-col w-full h-full bg-white">
            <AccountOverviewHeader
              EXPENSES={{
                flexIndex: 2,
                percentage: accountOverviewData.expensesPercentage,
                text: 'Expenses',
              }}
              INCOMES={{
                flexIndex: 1,
                percentage: accountOverviewData.incomesPercentage,
                text: 'Incomes',
              }}
              MERCHANT={{
                flexIndex: 1,
                name: accountOverviewData.favoriteMerchant,
                categoryText: 'Favorite Merchant',
              }}
            />
            {/* <div className="h-[1px] bg-red-500 mt-5"></div> */}
            <hr className="mt-3 mx-2 md:mt-5 md:mx-4" />
          </div>
        ) : (
          <p className="mt-3 text-base capitalize font-bold">No overview available</p>
        )}
      </div>
    </div>
  );
};

export default ExpensesWidget;