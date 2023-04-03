import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectAccountById } from '../../store/Account/index.selector';

export interface IBalanceWidget {
  selectedAccount: string;
}

const BalanceWidget: FC<IBalanceWidget> = ({ selectedAccount }) => {
  const accountData = useSelector(selectAccountById(selectedAccount));

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
    </div>
  );
};

export default BalanceWidget;
