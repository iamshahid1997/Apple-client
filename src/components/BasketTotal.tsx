import React from 'react';
import Currency from 'react-currency-formatter';
import { ApolloError } from '@apollo/client';
interface Props {
  loading: Boolean;
  error: ApolloError | undefined;
  data: {
    getTotalPrice: {
      price: number;
    };
  };
}

function BasketTotal({ loading, error, data }: Props) {
  return (
    <div className='mx-w-3xl my-12 mt-6 ml-auto divide-y divide-gray-300'>
      <div className='divide-y divide-gray-300'>
        <div className='pb-4'>
          <div className='flex justify-between'>
            <p>SubTotal</p>
            <p>
              {!loading && !error && data && (
                <Currency quantity={data.getTotalPrice.price} currency='INR' />
              )}
            </p>
          </div>
          <div className='flex justify-between'>
            <p>Shipping</p>
            <p>FREE</p>
          </div>
        </div>
      </div>
      <div className='flex justify-between pt-4 text-xl font-semibold'>
        <h4>Total</h4>
        <h4>
          {!loading && !error && data && (
            <Currency quantity={data.getTotalPrice.price} currency='INR' />
          )}
        </h4>
      </div>
    </div>
  );
}

export default BasketTotal;
