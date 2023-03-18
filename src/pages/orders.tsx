import Loading from '@/components/Loading';
import { SHOW_ALL_ORDERS } from '@/queries';
import { useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Currency from 'react-currency-formatter';
import React, { Key, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';

function orders() {
  const { data: session } = useSession();
  const [totalPrice, setTotalPrice] = useState<SetStateAction<number[]>>([]);
  const { data, loading, error } = useQuery(SHOW_ALL_ORDERS, {
    variables: {
      amount: 100,
      id: session?.user?.email,
    },
  });

  useEffect(() => {
    if (data) {
      data.showAllOrders.map((allOrders: { orders: [] }) => {
        let totalOrderPrice = 0;
        allOrders.orders.map(
          (order: { quantity: number; order: { price: number } }) => {
            let orderPrice = 0;
            orderPrice = orderPrice + order.quantity * order.order.price;
            totalOrderPrice = orderPrice + totalOrderPrice;
          }
        );
        setTotalPrice((prev: number[]) => [...prev, totalOrderPrice]);
      });
    }
  }, [data]);
  if (loading)
    return (
      <p>
        <Loading />
      </p>
    );
  if (error) return <div>{error.message}</div>;
  return (
    <>
      <Head>
        <title>Orders</title>
        <link rel='icon' href='/favicon' />
      </Head>
      <Header />
      <div className='w-full min-h-screen flex justify-center bg-background'>
        <div className='w-5/6 lg:w-1/2  px-4 py-4 lg:mx-0 lg:px-10 lg:py-16 my-6 rounded-xl border-[1px] bg-white h-fit'>
          <p className='flex justify-center text-xl font-bold mb-2'>
            Your Orders
          </p>
          <div className='space-y-4 pb-4'>
            {data.showAllOrders.length > 0 ? (
              data.showAllOrders.map(
                (
                  allOrders: {
                    orders: [];
                  },
                  index: keyof SetStateAction<number[]>
                ) => (
                  <div>
                    {allOrders.orders.map(
                      (order: {
                        order: {
                          _id: Key | null | undefined;
                          img: string;
                          name: string;
                          price: number;
                        };
                        quantity: number;
                      }) => (
                        <div
                          key={order.order._id}
                          className='flex items-center space-x-4 text-sm font-medium py-4 border-b-[1px]'
                        >
                          <div className='relative flex h-16 w-16 items-center justify-center rounded-md border border-gray-300 bg-[#F1F1F1] text-xs text-white'>
                            <Image
                              src={order.order.img}
                              layout='fill'
                              objectFit='contain'
                              alt=''
                            />
                            <div className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[gray] text-xs'>
                              {order.quantity}
                            </div>
                          </div>
                          <p className='flex-1'>{order.order.name}</p>
                          <div className='flex flex-col items-end'>
                            <div className='mb-2'>
                              Price:{' '}
                              <Currency
                                quantity={order.order.price}
                                currency='INR'
                              />
                            </div>
                            <div>
                              Total: {order.quantity} * {order.order.price} = {' '}
                              <Currency
                                quantity={order.order.price * order.quantity}
                                currency='INR'
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div className='space-y-1 py-4'>
                      <div className='flex justify-between text-sm'>
                        <p className='text-[gray]'>Subtotal</p>
                        <p className='font-medium'>
                          <Currency
                            quantity={totalPrice[index]}
                            currency='INR'
                          />
                        </p>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <p className='text-[gray]'>Discount</p>
                        <p className='text-[gray]'></p>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <p className='text-[gray]'>Shipping</p>
                        <p className='font-medium'>
                          <Currency quantity={20} currency='INR' />
                        </p>
                      </div>
                    </div>
                    <div className='flex justify-between py-4 border-t-[1px]'>
                      <p>Total</p>
                      <p className='flex items-center gap-x-2 text-xs text-[gray]'>
                        INR
                        <span className='text-xl font-medium text-black'>
                          <Currency
                            quantity={totalPrice[index] + 20}
                            currency='INR'
                          />
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p>No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default orders;
