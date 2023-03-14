import { memo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { TShowComponent } from '../Home';
import { AddTransactionProps, addTransactionSchema } from './schema';
import { useHttpRequest } from '../../hooks/useHttp';

export type AvailableTypes = 'Expense' | 'Income';
export type AvailableCurrency = 'RON' | 'EUR';
type TAddTransaction = TShowComponent & {
  setShowComponent: Dispatch<SetStateAction<TShowComponent>>;
};

const typeProps: { value: AvailableTypes }[] = [
  { value: 'Expense' },
  { value: 'Income' },
];
const currencyProps: { value: AvailableCurrency }[] = [
  { value: 'EUR' },
  { value: 'RON' },
];

const AddTransaction: FC<TAddTransaction> = ({
  show,
  componentName,
  setShowComponent,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTransactionProps>({
    resolver: zodResolver(addTransactionSchema),
    mode: 'onSubmit',
  });
  const { error, isLoading, sendRequest } = useHttpRequest();

  const closeAddTransaction = useCallback(() => {
    setShowComponent({
      show: false,
      componentName: '',
    });
  }, []);

  const onSubmit: SubmitHandler<AddTransactionProps> = async (data) => {
    console.log('data', data);

    const response = await sendRequest({
      url: '/test',
      method: 'POST',
      withCredentials: true,
      body: {
        transactionType: data.transactionType,
        amount: data.amount,
        merchant: data.merchant,
        currency: data.currency,
        date: data.date,
      },
    });

    console.log('response', response);
  };

  return (
    <>
      {show && componentName === 'AddTransaction' && (
        <>
          <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black/40 flex items-center justify-center z-10">
            <div className="max-w-sm md:max-w-md w-full relative bg-black text-white gap-6 z-[11] rounded-xl ">
              <div className="w-full h-full flex flex-col pt-2 pb-5">
                <div className="flex">
                  <h2 className="text-center flex-1 text-lg">
                    New Transaction
                  </h2>
                  <span
                    className="ml-auto mr-4 text-lg cursor-pointer"
                    onClick={closeAddTransaction}
                  >
                    X
                  </span>
                </div>
                <form
                  id="addTransaction"
                  className="flex flex-col space-y-10 w-full mt-3 px-7"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Select
                    {...register('transactionType')}
                    error={errors.transactionType?.message}
                    className=" block w-full mt-2 py-2 text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA]"
                    required
                    dataSourceGroup={typeProps}
                    id="type"
                    placeholder="Select Type"
                  />
                  <div className="relative z-0">
                    <Input
                      {...register('amount', {
                        valueAsNumber: true,
                      })}
                      type="number"
                      error={errors.amount?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
                      placeholder=" "
                      label="Amount"
                      required
                    />
                  </div>
                  <Select
                    {...register('currency')}
                    error={errors.currency?.message}
                    className=" block w-full mt-2 py-2 text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA]"
                    required
                    dataSourceGroup={currencyProps}
                    id="type"
                    placeholder="Select Currency"
                  />
                  <div className="relative z-0">
                    <Input
                      {...register('merchant')}
                      error={errors.merchant?.message}
                      className="block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
                      placeholder=" "
                      label="Merchant"
                      required
                    />
                  </div>
                  <div className="relative z-0">
                    <Input
                      {...register('date')}
                      type="date"
                      error={errors.date?.message}
                      className="block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
                      placeholder=" "
                      label="Date"
                      required
                    />
                  </div>
                  <button
                    form="addTransaction"
                    className="disabled:cursor-not-allowed disabled:pointer-events-none w-full bg-[#1f1f1f] p-3 rounded-md text-lg uppercase hover:bg-white hover:text-[#1f1f1f] focus:bg-white focus:text-[#1f1f1f] focus:outline-none transition-all duration-100 ease-in"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(AddTransaction);
