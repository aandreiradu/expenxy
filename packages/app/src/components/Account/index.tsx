import BankCard from '../BankCard';
import { ArrowLeft, ArrowRight } from 'phosphor-react';

const Account = () => {
  return (
    <div
      className="
        relative rounded-md flex gap-5 items-center bg-white mt-3 py-5 px-5
        w-full max-w-xl h-52
      "
    >
      <div className="absolute top-[50%] -translate-y-1/2 -left-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowLeft cursor="pointer" className="w-6 h-6 text-white" />
      </div>
      <div className="w-full overflow-y-auto flex gap-3">
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Debit" />
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Savings" />
        <BankCard balance={4500} currency="EUR" name="Bancomat" type="Test" />
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 -right-5 bg-[#1f1f1f] p-1 rounded">
        <ArrowRight cursor="pointer" className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default Account;
