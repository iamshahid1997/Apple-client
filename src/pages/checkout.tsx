import Head from 'next/head';
import React, { useState, useEffect, Key } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import Button from '../components/Button';
import CheckoutProduct from '../components/Checkout-Product';
import Currency from 'react-currency-formatter';
import { fetchPostJSON } from '../utils/api-helper';
import getStripe from '../utils/get-stripe';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CART_ITEMS,
  GET_CART_PRICE,
  REMOVE_CART_ON_SUCCESS_PAYMENT,
} from '@/queries';
import BasketTotal from '@/components/BasketTotal';
import { useSession } from 'next-auth/react';

function Checkout() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [removeCartOnSuccessPayment] = useMutation(
    REMOVE_CART_ON_SUCCESS_PAYMENT
  );

  const {
    data: cart_price_data,
    loading: cart_loading,
    error: cart_error,
  } = useQuery(GET_CART_PRICE, {
    variables: {
      amount: 100,
      id: session?.user?.email,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: cart_data,
    loading: cartLoading,
    error,
  } = useQuery(GET_CART_ITEMS, {
    variables: {
      amount: 100,
      id: session?.user?.email,
    },
  });

  async function createCheckoutSession() {
    setLoading(true);

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      '/api/checkout_sessions',
      {
        items: cart_data.showCartItems,
      }
    );

    //Internal Server Error
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    if (checkoutSession.status === 'open') {
      removeCartOnSuccessPayment({
        variables: {
          userId: session?.user?.email,
        },
      });
    }

    // Redirect to checkout
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    console.warn(error.message);

    setLoading(false);
  }

  return (
    <div className='min-h-screen overflow-hidden bg-background'>
      <Head>
        <title>Bag - Apple</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='mx-auto max-w-5xl pb-24'>
        <div className='flex flex-col items-center px-5'>
          <h1 className='my-4 text-3xl font-semibold lg:text-4xl'>
            {cart_data && cart_data.showCartItems.length > 0
              ? 'Review your bag.'
              : 'Your bag is empty'}
          </h1>
          <p className='my-4'>Free Delivery and Free returns.</p>
          {cart_data && cart_data.showCartItems.length === 0 && (
            <Button
              title='Continue Shopping'
              onClick={() => router.push('/')}
            />
          )}
        </div>
        {cart_data && cart_data.showCartItems.length > 0 && (
          <div className='mx-5 md:mx-8'>
            {cart_data.showCartItems.map(
              (item: {
                product: {
                  _id: Key | null | undefined;
                  price: number;
                  name: String;
                  img: string;
                  description: String;
                };
                quantity: number;
                added_by: {
                  _id: String;
                };
              }) => (
                <CheckoutProduct key={item.product._id} item={item} />
              )
            )}
            <BasketTotal
              loading={cart_loading}
              error={error}
              data={cart_price_data}
            />
            <div className='my-14 space-y-4'>
              <h4 className='text-xl font-semibold'>
                How would you like to checkout?
              </h4>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center md:order-2'>
                  <h4 className='mb-4 flex flex-col text-xl font-semibold'>
                    Pay in full
                    <span>
                      {!cart_loading && !cart_error && cart_price_data && (
                        <Currency
                          quantity={cart_price_data.getTotalPrice.price}
                          currency='INR'
                        />
                      )}
                    </span>
                  </h4>
                  <Button
                    noIcon
                    loading={loading}
                    title='Check Out'
                    width='w-full'
                    onClick={createCheckoutSession}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
