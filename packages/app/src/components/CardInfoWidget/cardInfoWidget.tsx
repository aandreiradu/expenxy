import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectAccountById } from '../../store/Account/index.selector';

export interface ICartInfoWidget {
  selectedAccount: string;
}

const CardInfoWidget: FC<ICartInfoWidget> = ({ selectedAccount }) => {
  const accountData = useSelector(selectAccountById(selectedAccount));

  console.log('accountData', accountData);

  return (
    <div className="w-full max-w-[250px] h-full flex items-center flex-col flex-1 bg-white">
      <h3 className="text-center text-gray-500 h-1/5 flex items-end mb-3">Card Info</h3>
      <div className="w-full bg-red-500 grid grid-cols-2 p-3 overflow-hidden">
        <div className="w-full flex flex-col justify-end text-left">
          <p>Status</p>
          <p>Balance</p>
          <p>Opened at</p>
        </div>
        <div className="w-full flex flex-col justify-start text-right">
          <p>Active</p>
          <p>
            {accountData?.balance} {accountData?.currency.code}
          </p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CardInfoWidget;
