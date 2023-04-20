import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AddTransactionProps, EditTransactionProps } from '../../pages/AddTransaction/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTransactionSchema, editTransactionSchema } from '../../pages/AddTransaction/schema';
import { Input } from '../Input';
import { Listbox, Transition } from '@headlessui/react';
import { CaretCircleDown, Check, Warning } from 'phosphor-react';
import { typeProps } from '../../pages/AddTransaction/types';
import { PulseLoader } from 'react-spinners';
import { useHttpRequest } from '../../hooks/useHttp';
import { TransactionItemDetailsProps } from '../RecentTransactions/TransactionItemDetails';
import { useDispatch, useSelector } from 'react-redux';
import { selectTransactionById } from '../../store/User/index.selector';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { setLatestTransactions } from '../../store/User/index.slice';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';
import TopLevelNotification from '../UI/TopLevelNotification';

type EditTransactionArgs = TransactionItemDetailsProps & {
  onClose: () => void;
};

const EditTransaction: FC<EditTransactionArgs> = ({ transactionId, onClose }) => {
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const dispatch = useDispatch();
  const { isLoading, sendRequest, error } = useHttpRequest();
  const { date, merchant, transactionType, amount } = useSelector(selectTransactionById(transactionId)) || {};
  const [type, setType] = useState(transactionType || '');
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<EditTransactionProps>({
    resolver: zodResolver(editTransactionSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (transactionType) {
      setValue('transactionType', transactionType);
    }
  }, []);

  useEffect(() => {
    if (error) {
      const { message, fieldErrors, status } = error;

      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        for (let idx in fieldErrors) {
          setError(String(idx) as any, { message: String(fieldErrors[idx]) });
        }

        return setTopLevelNotification({
          show: true,
          message: message || 'Someting went wrong, please try again later!',
          icon: <Warning className="w-14 h-8 text-red-700" />,
        });
      }

      return setTopLevelNotification({
        show: true,
        message: message || 'Someting went wrong, please try again later!',
        icon: <Warning className="w-14 h-8 text-red-700" />,
      });
    }
  }, [error]);

  const handleTransactionTypeChange = (e: any) => {
    setType(e.value);
    setValue('transactionType', e.value);
  };

  const onSubmit: SubmitHandler<EditTransactionProps> = async (data) => {
    const response = await sendRequest({
      method: 'POST',
      url: `/editTransaction/${transactionId}`,
      body: {
        transactionType: data.transactionType,
        amount: Number(data.amount),
        merchant: data.merchant,
        date: data.date,
      },
      withCredentials: true,
    });

    if (response) {
      const { data, status, message } = response;

      if (
        status === statsAndMaps['editTransactionSuccess']?.status &&
        message === statsAndMaps['editTransactionSuccess'].message
      ) {
        reset();
        setTopLevelNotification({
          show: true,
          message: statsAndMaps['editTransactionSuccess']?.frontendMessage || '',
          icon: <Check className="w-14 h-8 text-green-400" />,
        });

        dispatch(setLatestTransactions({ latestTransactions: data.latestTransactions }));
        const timeout = setTimeout(() => {
          onClose();
          clearTimeout(timeout);
        }, 2000);
      }
    }
  };

  return (
    <>
      {topLevelNotification.show && (
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
      <div className="relative md:max-w-xl w-full bg-[#1f1f1f] text-yellow-400 gap-6 z-[11] rounded-xl mx-2 md:mx-0">
        <div className="w-full h-full flex flex-col pt-2 pb-5">
          <span
            className="bg-yellow-400 text-[#1f1f1f] p-1 px-3 rounded-full ml-auto mr-4 text-lg cursor-pointer"
            onClick={onClose}
          >
            X
          </span>
          <h2 className="text-center flex-1 text-lg uppercase tracking-wide">Edit Transaction</h2>

          <form
            className="
          w-full flex flex-col px-3 mt-2 gap-3 overflow-hidden overflow-y-visible
          md:gap-5 md:px-5 md:mt-2 md:grid md:grid-cols-2 md:justify-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Type */}
            <Listbox value={type} onChange={handleTransactionTypeChange}>
              <div className="relative" id="type">
                <Listbox.Label className={`${errors?.transactionType && 'text-red-500'}`}>Type</Listbox.Label>
                <Listbox.Button
                  className={`text-white bg-transparent border border-white 
                                        relative w-full cursor-default rounded-lg 
                                        py-2 pl-3 pr-10 text-left shadow-md 
                                        focus:outline-none sm:text-sm
                                        ${errors?.transactionType && 'border-red-500'}`}
                >
                  <span className="block truncate">{type || 'Select Type'}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <CaretCircleDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                {errors.transactionType && <span className="text-red-500 text-sm">{errors.transactionType?.message}</span>}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {typeProps.map((type, typeIdx) => (
                      <Listbox.Option
                        key={typeIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-yellow-400 text-amber-900' : 'text-gray-900'
                          }`
                        }
                        value={type}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {type.value}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
              {/* </div> */}
            </Listbox>

            {/* Amount */}
            <div className="relative z-0">
              <Input
                {...register('amount', {
                  valueAsNumber: true,
                })}
                type="number"
                error={errors.amount?.message}
                className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                label="Amount"
                required
                step="any"
                defaultValue={amount}
              />
            </div>

            {/* Merchant */}
            <div className="relative z-0">
              <Input
                {...register('merchant')}
                error={errors.merchant?.message}
                className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                label="Merchant"
                defaultValue={merchant}
              />
            </div>

            {/* Date */}
            <div className="relative z-0">
              <Input
                {...register('date')}
                type="date"
                error={errors.date?.message}
                className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                label="Date"
                value={date}
                required
              />
            </div>

            <button
              disabled={isLoading || topLevelNotification.show}
              className="col-span-2 disabled:cursor-not-allowed disabled:pointer-events-none w-full text-[#1f1f1f] bg-yellow-400 p-3 rounded-md text-lg uppercase hover:bg-white focus:bg-white focus:outline-none transition-all duration-100 ease-in"
            >
              {!isLoading ? 'Submit' : <PulseLoader color="#1f1f1f" />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTransaction;
