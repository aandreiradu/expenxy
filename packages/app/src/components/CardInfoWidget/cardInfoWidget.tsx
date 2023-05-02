import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectAccountById } from '../../store/Account/index.selector';

export interface ICartInfoWidget {
  selectedAccount: string;
}

const CardInfoWidget: FC<ICartInfoWidget> = ({ selectedAccount }) => {
  const accountData = useSelector(selectAccountById(selectedAccount));
  return (
    <div className="w-full max-w-full md:max-w-[300px] h-full flex items-center flex-col p-2 flex-1 bg-white /*rounded-md shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]*/">
      <h3 className="text-center text-gray-500 flex items-end mb-3">Card Info</h3>
      <div className="w-full h-full flex flex-col gap-2 p-3 overflow-hidden gap-x-2">
        <div className="w-full flex items-start justify-between">
          <span className="text-base">Status</span>
          <span className="text-base font-bold">{accountData?.status}</span>
        </div>
        <div className="w-full flex items-start justify-between">
          <span className="text-base">Name</span>
          <span className="text-base font-bold">{accountData?.name}</span>
        </div>
        <div className="w-full flex items-start justify-between">
          <span className="text-base">Balance</span>
          <span className="text-base font-bold">
            {accountData?.balance} {accountData?.currency.code}
          </span>
        </div>
        <div className="w-full flex items-start justify-between">
          <span className="text-base">Opened at</span>
          <span className="text-base font-bold">{new Date(accountData?.createdAt || '').toLocaleDateString()}</span>
        </div>
        <div className="w-full flex items-start justify-between">
          <span className="text-base">Expires at</span>
          <span className="text-base font-bold">{new Date(accountData?.expiresAt || '').toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CardInfoWidget;
