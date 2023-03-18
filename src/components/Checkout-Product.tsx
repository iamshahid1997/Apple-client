import {
  ADD_TO_CART,
  GET_CART_PRICE,
  GET_PRODUCT_CART_QUANTITY,
  GET_TOTAL_CART_COUNT,
  REMOVE_ITEM_FROM_CART,
} from '@/queries';
import { useMutation } from '@apollo/client';
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { Key, useState } from 'react';
import Currency from 'react-currency-formatter';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Props {
  item: {
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
  };
}

function CheckoutProduct({ item }: Props) {
  const { data: session } = useSession();
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [removeItemFromCart] = useMutation(REMOVE_ITEM_FROM_CART);
  const [addToCart] = useMutation(ADD_TO_CART);
  function removeItemfromBasket() {
    removeItemFromCart({
      variables: {
        productId: item.product._id,
        userId: session?.user?.email,
      },
      onCompleted: (data) =>
        toast.error(data.removeItemFromCart.message, {
          position: 'bottom-center',
        }),
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

  function addItemToBasket() {
    addToCart({
      variables: {
        productId: item.product._id,
        userId: session?.user?.email,
      },
      onCompleted: (data) =>
        toast.success(data.addToCart.message, {
          position: 'bottom-center',
        }),
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
    <div className='flex flex-col gap-x-4 border-b border-gray-300 py-5 lg:flex-row lg:items-center'>
      <div className='relative h-44 w-44'>
        <Image
          src={item.product.img}
          alt=''
          layout='fill'
          objectFit='contain'
        />
      </div>
      <div className='flex flex-1 items-end lg:items-center'>
        <div className='flex-1 space-y-4'>
          <div className='flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl'>
            <h4 className='font-semibold lg:w-96'>{item.product.name}</h4>
            <div className='flex items-center gap-x-1 font-semibold'>
              <p>{item.quantity}</p>
              <span
                className='ml-3 flex cursor-pointer text-sm'
                onClick={addItemToBasket}
              >
                <PlusIcon className='h-5 w-5 text-blue-500' />
              </span>
            </div>
          </div>
          <p
            className='flex cursor-pointer items-center text-blue-500 hover:underline'
            onClick={() => setShowDescription((prev) => !prev)}
          >
            Show product details
            <ChevronDownIcon className='ml-3 h-5 w-5' />
          </p>
          {showDescription && (
            <p className='pr-3 text-gray-600'>
              {`${item.product.description.substring(0, 50)}...`}
            </p>
          )}
        </div>
        <div className='spcae-y-4 flex flex-col items-end'>
          <h4 className='text-xl font-semibold lg:text-2xl'>
            <Currency
              quantity={item.product.price}
              currency='INR'
            />
          </h4>
          <button
            onClick={removeItemfromBasket}
            className='text-blue-500 hover:underline'
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutProduct;
