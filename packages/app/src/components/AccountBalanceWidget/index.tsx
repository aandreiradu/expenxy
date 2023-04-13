import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAccountById,
  selectBalanceEvolutionById,
  selectBalanceEvolutionWidgetData,
} from '../../store/Account/index.selector';
import Chart from 'react-apexcharts';
import { useHttpRequest } from '../../hooks/useHttp';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { setBalanceEvolutionById } from '../../store/Account/index.slice';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';
import { Warning } from 'phosphor-react';
import TopLevelNotification from '../UI/TopLevelNotification';

export interface IBalanceWidget {
  selectedAccount: string;
}

export type TBalanceWidget = {
  options: {
    chart: {
      id: string;
      title: string;
      toolbar: {
        show: boolean;
      };
    };
    legend: {
      show: boolean;
    };
    dataLabels: {
      enabled: boolean;
    };
    xaxis: {
      categories: number[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
};

const defaultState = {
  options: {
    chart: {
      id: 'balance-evolution',
      title: 'Account Balance Evolution',
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
    },
  },
  series: [
    {
      name: 'balance',
      data: [],
    },
  ],
};

const BalanceWidget: FC<IBalanceWidget> = ({ selectedAccount }) => {
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const [widgetData, setWidgetData] = useState<TBalanceWidget>(defaultState);
  const dispatch = useDispatch();
  const accountData = useSelector(selectAccountById(selectedAccount));
  const balanceEvolutionData = useSelector(selectBalanceEvolutionWidgetData(accountData?.id || ''));
  const { sendRequest, isLoading, error } = useHttpRequest();

  /* Errors */
  useEffect(() => {
    if (error) {
      const { message } = error;
      return setTopLevelNotification({
        show: true,
        message: message || 'Someting went wrong when getting informations about your balance',
        icon: <Warning className="w-14 h-8 text-red-700" />,
      });
    }
  }, [error]);

  useEffect(() => {
    const getAccountBalanceEvolution = async () => {
      if (!balanceEvolutionData?.balanceEvoluton) {
        const response = await sendRequest({
          method: 'GET',
          url: `/getBalanceEvolution?accountId=${accountData?.id}`,
          withCredentials: true,
        });

        console.log('response getBalanceEvolution', response);

        if (response) {
          const { data, status, message } = response;
          if (message === statsAndMaps['fetchBalanceEvolutionSuccessfully']?.message && status === 200) {
            const {
              accountId,
              balanceEvolution: { accountBalances, categories, data: dataBalances },
            } = data;
            if (accountBalances) {
              dispatch(
                setBalanceEvolutionById({
                  accountId: accountId,
                  balanceEvolution: accountBalances,
                  balanceEvolutionCategoriesData: categories,
                  balanceEvolutionDates: dataBalances,
                }),
              );
            }

            if (categories && dataBalances) {
              setWidgetData((prev) => ({
                ...prev,
                options: {
                  ...prev.options,
                  xaxis: {
                    categories: categories,
                  },
                },
                series: [
                  {
                    name: 'balance',
                    data: dataBalances,
                  },
                ],
              }));
            }
          }
        }
      } else {
        console.log('balance evolution din store', balanceEvolutionData?.balanceEvoluton);
        setWidgetData((prev) => ({
          ...prev,
          options: {
            ...prev.options,
            xaxis: {
              categories: balanceEvolutionData.balanceEvolutionCategoriesData,
            },
          },
          series: [
            {
              name: 'balance',
              data: balanceEvolutionData.balanceEvolutionDates,
            },
          ],
        }));
      }
    };

    getAccountBalanceEvolution();
  }, [accountData?.id]);

  /* Loader */
  if (isLoading) {
    return (
      <div className="max-w-md mt-5">
        <Loader
          icon={<PropagateLoader color="#1f1f1f" className="p-2" />}
          loadingText="Loading informations about your balance"
          textClasses="text-[#1f1f1f] text-base"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px] h-full flex items-center flex-col flex-1 p-2 bg-white /*rounded-md shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]*/">
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
      <p className="text-center text-gray-500 flex items-end">Your balance</p>
      <p className="text-base">
        {accountData?.currency?.code &&
          accountData?.balance &&
          (new Intl.NumberFormat('de-DE', { style: 'currency', currency: accountData.currency.code || '' }).format(
            Number(accountData.balance || 0),
          ) ??
            0)}
      </p>
      <Chart height="175px" width="275px" options={widgetData.options} series={widgetData.series} type="area" />
    </div>
  );
};

export default BalanceWidget;
