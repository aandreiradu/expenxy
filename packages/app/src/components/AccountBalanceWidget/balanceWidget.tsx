import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountById, selectBalanceEvolutionById } from '../../store/Account/index.selector';
import Chart from 'react-apexcharts';
import { useHttpRequest } from '../../hooks/useHttp';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { setBalanceEvolutionById } from '../../store/Account/index.slice';

export interface IBalanceWidget {
  selectedAccount: string;
}

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
  const dispatch = useDispatch();
  const accountData = useSelector(selectAccountById(selectedAccount));
  const balanceEvolution = useSelector(selectBalanceEvolutionById(accountData?.id || ''));
  const { sendRequest, isLoading, error } = useHttpRequest();

  useEffect(() => {
    const getAccountBalanceEvolution = async () => {
      const response = await sendRequest({
        method: 'GET',
        url: `/getBalanceEvolution?accountId=${accountData?.id}`,
        withCredentials: true,
      });

      console.log('response getBalanceEvolution', response);

      if (response) {
        const { data, status, message } = response;
        if (message === statsAndMaps['fetchBalanceEvolutionSuccessfully']?.message && status === 200) {
          const { accountId, balanceEvolution } = data;
          dispatch(setBalanceEvolutionById({ accountId: accountId, balanceEvolution: balanceEvolution }));

          if (balanceEvolution) {
            const categories: number[] = [];
            const data: number[] = [];
            balanceEvolution.forEach((be: any) => {
              categories.push(Number(new Date(be.createdAt).getFullYear()));
              data.push(Number(be.balance));
            });

            //@ts-expect-error
            defaultState.options.xaxis.categories = categories;
            //@ts-expect-error
            defaultState.series[0].data = data;
          }
        }
      }
    };

    getAccountBalanceEvolution();
  }, [accountData?.id]);

  return (
    <div className="w-full max-w-[250px] h-full flex items-center flex-col flex-1 bg-white">
      <p className="text-center text-gray-500 h-1/5 flex items-end mb-3">Your balance</p>
      <p>
        {accountData?.currency?.code &&
          accountData?.balance &&
          (new Intl.NumberFormat('de-DE', { style: 'currency', currency: accountData.currency.code || '' }).format(
            Number(accountData.balance || 0),
          ) ??
            0)}
      </p>
      <Chart options={defaultState.options} series={defaultState.series} type="area" />
    </div>
  );
};

export default BalanceWidget;
