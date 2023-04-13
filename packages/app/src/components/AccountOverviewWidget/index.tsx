import React, { useEffect, useState } from 'react';
import { useHttpRequest } from '../../hooks/useHttp';
import { useSelector } from 'react-redux';
import { accountSelected } from '../../store/User/index.selector';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';

const ExpensesWidget = () => {
  const [accountOverviewData, setAccountOverviewData] = useState({
    incomesPercentage: 0,
    expensesPercentage: 0,
    favoriteMerchant: 'test',
  });
  const accountSelectedId = useSelector(accountSelected);
  console.log('accountSelectedId', accountSelectedId);
  const { isLoading, error, sendRequest } = useHttpRequest();

  useEffect(() => {
    console.log('accountSelectedId changed, running effect');

    const getAccountOverview = async () => {
      const accountOverviewResponse = await sendRequest({
        method: 'GET',
        url: `/accountOverview?overviewFilter=${'THISMONTH'}&accountId=${accountSelectedId}`,
        withCredentials: true,
      });

      console.log('accountOverviewResponse', accountOverviewResponse);

      if (accountOverviewResponse) {
        const { accountOverview } = accountOverviewResponse?.data;

        if (accountOverview) {
          setAccountOverviewData((prev) => ({
            ...prev,
            incomesPercentage: Number(accountOverview.IncomesPercentage || 0),
            expensesPercentage: Number(accountOverview.ExpensesPercentage || 0),
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
      {/* {error && topLevelNotification.show && (
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
  )} */}

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
          <div className="w-full h-full bg-red-500 flex flex-col">
            <div className="w-full flex items-center bg-blue-600">
              <div className="flex-[2] h-full flex flex-col bg-green-400 p-2 pb-0">
                <p className="font-bold text-lg">{accountOverviewData.incomesPercentage}%</p>
                <p className="font-base">Incomes</p>
              </div>
              <div className="flex-[1] flex h-full flex-col bg-pink-500 p-2 pb-0">
                <p className="font-bold text-lg">{accountOverviewData.expensesPercentage}%</p>
                <p className="font-base">Expenses</p>
              </div>
              <div className="flex-[1] flex h-full flex-col bg-amber-500 p-2 pb-0">
                <p className="font-bold text-lg">{accountOverviewData.favoriteMerchant}</p>
                <p className="font-base">Favorite Merchant</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-base capitalize font-bold">No overview available</p>
        )}
      </div>
    </div>
  );
};

export default ExpensesWidget;
