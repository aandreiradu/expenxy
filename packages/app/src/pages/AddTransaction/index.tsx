import { Fragment, memo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { addTransactionSchema } from './schema';
import { AddTransactionProps } from './types';
import { useHttpRequest } from '../../hooks/useHttp';
import { Listbox, Transition } from '@headlessui/react';
import { Check, CaretCircleDown, Warning } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserAccounts } from '../../store/Account/index.selector';
import { TAddTransaction, typeProps } from './types';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { TTopLevelNotification } from '../Account/CreateBankAccount/types';
import TopLevelNotification from '../../components/UI/TopLevelNotification';
import { PulseLoader } from 'react-spinners';
import { setLatestTransactions } from '../../store/User/index.slice';

const AddTransaction: FC<TAddTransaction> = ({ show, componentName, setShowComponent }) => {
  const dispatch = useDispatch();
  const userAccounts = useSelector(selectUserAccounts);
  const [selected, setSelected] = useState<{ name: string; id: string }>({
    name: '',
    id: '',
  });
  const [type, setType] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<AddTransactionProps>({
    resolver: zodResolver(addTransactionSchema),
    mode: 'onSubmit',
  });
  const { error, isLoading, sendRequest } = useHttpRequest();
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });

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

  const closeAddTransaction = useCallback(() => {
    setShowComponent({
      show: false,
      componentName: '',
    });
  }, []);

  const onSubmit: SubmitHandler<AddTransactionProps> = async (data) => {
    const response = await sendRequest({
      method: 'POST',
      url: '/addTransaction',
      body: {
        account: data.account,
        transactionType: data.transactionType,
        amount: data.amount,
        merchant: data.merchant,
        date: data.date,
        details: data.details,
      },
      withCredentials: true,
    });

    if (response) {
      const { latestTransactions } = response.data;
      const { status, message } = response;

      if (message === statsAndMaps['createTransactionSuccessfully']?.message && status === 201) {
        setTopLevelNotification({
          show: true,
          message: statsAndMaps['createTransactionSuccessfully']?.frontendMessage || 'Transaction created successfully',
          icon: <Check className="w-14 h-8 text-green-400" />,
        });

        /* Save to redux store */
        dispatch(setLatestTransactions({ latestTransactions: latestTransactions }));

        /* Reset to default state */
        reset();
        setType('');
        setSelected({ id: '', name: '' });
      }
    }
  };

  const handleAccountChange = (e: any) => {
    setSelected({
      name: e.name,
      id: e.id,
    });
    setValue('account', e.id);
  };

  const handleTransactionTypeChange = (e: any) => {
    setType(e.value);
    setValue('transactionType', e.value);
  };

  return (
    <>
      {show && componentName === 'AddTransaction' && (
        <>
          {/* Top Level Notification for successfull / error messages */}
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

          <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black/40 flex items-center justify-center z-10">
            <div className="relative md:max-w-xl w-full bg-[#1f1f1f] text-yellow-400 gap-6 z-[11] rounded-xl mx-2 md:mx-0">
              <div className="w-full h-full flex flex-col pt-2 pb-5">
                <span
                  className="bg-yellow-400 text-[#1f1f1f] p-1 px-3 rounded-full ml-auto mr-4 text-lg cursor-pointer"
                  onClick={closeAddTransaction}
                >
                  X
                </span>
                <h2 className="text-center flex-1 text-lg uppercase tracking-wide">New Transaction</h2>

                <form
                  className="
                    w-full flex flex-col px-3 mt-2 gap-3 overflow-hidden overflow-y-visible
                    md:gap-5 md:px-5 md:mt-2 md:grid md:grid-cols-2 md:justify-between"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Account */}
                  <Listbox value={selected.id} onChange={handleAccountChange}>
                    <div className="relative">
                      <Listbox.Label className={`${errors?.account && 'text-red-500'}`}>Account</Listbox.Label>

                      <Listbox.Button
                        className={`text-white bg-transparent border border-white relative 
                                                    w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left 
                                                    shadow-md focus:outline-none sm:text-sm
                                                    ${errors?.account && 'border-red-500'}`}
                      >
                        <span className="block truncate">{selected.name || `Select Account`}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <CaretCircleDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      {/* Error message */}
                      {errors.account && <span className="text-red-500 text-sm">{errors.account?.message}</span>}

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {userAccounts.map((account) => (
                            <Listbox.Option
                              key={account.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-4 ${
                                  active ? 'bg-yellow-400 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={account}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {account?.name} ({account?.currency.code}, {account?.bankAccountType?.name})
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
                  </Listbox>

                  {/* Type */}
                  <Listbox value={type} onChange={handleTransactionTypeChange}>
                    <div className="relative" id="type">
                      <Listbox.Label className={`${errors?.account && 'text-red-500'}`}>Type</Listbox.Label>
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
                      {errors.transactionType && (
                        <span className="text-red-500 text-sm">{errors.transactionType?.message}</span>
                      )}
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
                    />
                  </div>

                  {/* Merchant */}
                  <div className="relative z-0">
                    <Input
                      {...register('merchant')}
                      error={errors.merchant?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Merchant"
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
                      required
                    />
                  </div>

                  {/* Details */}
                  <div className="relative z-0">
                    <Input
                      {...register('details')}
                      type="text"
                      error={errors.details?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Details"
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    className="col-span-2 disabled:cursor-not-allowed disabled:pointer-events-none w-full text-[#1f1f1f] bg-yellow-400 p-3 rounded-md text-lg uppercase hover:bg-white focus:bg-white focus:outline-none transition-all duration-100 ease-in"
                  >
                    {!isLoading ? 'Login' : <PulseLoader color="#1f1f1f" />}
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
