import React, { Key, useEffect, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Currency from 'react-currency-formatter';
import {
  ADD_TO_CART,
  GET_CART_PRICE,
  GET_PRODUCT_CART_QUANTITY,
  GET_TOTAL_CART_COUNT,
} from '@/queries';
import Link from 'next/link';

interface Props {
  product: {
    _id: Key | null | undefined;
    description: String;
    img: any;
    name: String;
    price: number;
  };
}

function Product({ product }: Props) {
  const { data: session } = useSession();
  const [addToCart, { loading, error }] = useMutation(ADD_TO_CART);
  const {
    data,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_PRODUCT_CART_QUANTITY, {
    variables: {
      amount: 100,
      id: session?.user?.email,
    },
  });
  function addItemToBasket(productId: Key | null | undefined) {
    addToCart({
      variables: {
        productId: productId,
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

  return (
    <div className='flex h-fit w-[320px] select-none flex-col space-y-3 rounded-xl bg-[#35383c] p-3 md:h-[500px] md:w-[400px] md:p-7'>
      <Link href={`/product/${product._id}`}>
        <div className='relative h-64 w-full md:h-72'>
          <Image src={product.img} layout='fill' objectFit='contain' alt='' />
        </div>
      </Link>
      <div className='flex items-center justify-between space-x-3'>
        <div className='text-lg text-white md:text-xl'>
          <p className='mb-3'>{product.name}</p>
          <Currency quantity={product.price} currency='USD' />
        </div>
        <div
          className='flex-shrink-8 gradient relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full md:h-[60px] md:w-[60px]'
          onClick={() => addItemToBasket(product._id)}
        >
          <ShoppingCartIcon className='h-8 w-8 text-white' />
          {!cartLoading &&
            !cartError &&
            data &&
            data.showCartItems.map(
              (productCount: {
                product: {
                  _id: Key | null | undefined;
                };
                quantity: number;
              }) =>
                productCount.product._id === product._id && (
                  <span
                    key={productCount.product._id}
                    className='gradient absolute -right-2 -top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full text-[10px] text-white'
                  >
                    {productCount.quantity}
                  </span>
                )
            )}
        </div>
      </div>
    </div>
  );
}

export default Product;
