import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_TO_CART,
  GET_CART_PRICE,
  GET_PRODUCT,
  GET_PRODUCT_CART_QUANTITY,
  GET_TOTAL_CART_COUNT,
} from '../../queries';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Image from 'next/image';
import Currency from 'react-currency-formatter';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

function Product() {
  const router = useRouter();
  const { data: session } = useSession();
  const { productId } = router.query;
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      productId,
    },
  });

  const [addToCart] = useMutation(ADD_TO_CART);

  function addItemToBasket(productId: string) {
    addToCart({
      variables: {
        productId,
        userId: session?.user?.email,
      },
      onCompleted: (data) => {
        toast.success(`${data.addToCart.message}`, {
          position: 'bottom-center',
        });
      },
      refetchQueries: [
        {
          query: GET_TOTAL_CART_COUNT,
          variables: {
            amount: 100,
            id: session?.user?.email,
          },
        },
        {
          query: GET_PRODUCT_CART_QUANTITY,
          variables: {
            amount: 100,
            id: session?.user?.email,
          },
        },
        {
          query: GET_CART_PRICE,
          variables: {
            amount: 100,
            id: session?.user?.email,
          },
        },
      ],
    });
  }

  if (loading) return <Loading />;
  if (error) return <p>Error</p>;
  if (data === null)
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        Invalid Url
      </div>
    );

  return (
    <div>
      <Head>
        <title>{data.getProduct.name}</title>
        <link rel='icon' href='/favicon' />
      </Head>
      <Header />
      <main className='grid grid-cols-1 lg:grid-cols-9'>
        <section className='mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44 flex flex-col justify-center items-center'>
          <div className='relative w-full lg:w-full h-72 lg:h-1/2 transition-all mt-10 lg:mt-0'>
            <Image
              src={data.getProduct.img}
              layout='fill'
              objectFit='contain'
              alt=''
            />
          </div>
          <div className='flex items-center w-full flex-col'>
            <div className='flex flex-col items-center lg:items-start space-y-2 flex-wrap'>
              <span className='gradient bg-clip-text text-4xl text-transparent text-center lg:text-left'>
                {data.getProduct.name}
              </span>
              <p className='text-gray-600'>
                at just{' '}
                <Currency quantity={data.getProduct.price} currency='INR' />
              </p>
            </div>
          </div>
        </section>
        <section className='overflow-y-auto border-y border-l border-gray-300 bg-[#FAFAFA] lg:col-span-4 h-screen lg:border-y-0'>
          <div className='lg:h-3/4 flex flex-col justify-center px-4 lg:px-14 mt-6 lg:mt-0 space-y-7'>
            <p className='gradient bg-clip-text text-2xl text-transparent text-center lg:text-left'>
              Get your {data.getProduct.name} now!
            </p>
            <p className='text-3xl text-gray-700'>
              {data.getProduct.description}
            </p>
            <div className='flex'>
              <Button
                title='Add to Cart'
                onClick={() => addItemToBasket(data.getProduct._id)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Product;
