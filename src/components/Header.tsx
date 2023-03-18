import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { GET_TOTAL_CART_COUNT } from '@/queries';

const HEADER = [
  {
    header: 'Home',
    link: '/',
  },
  {
    header: 'Orders',
    link: '/orders',
  },
  {
    header: 'Support',
    link: '/support',
  },
  // {
  //   header: 'Business',
  //   link: '/business',
  // },
];

function Header() {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_TOTAL_CART_COUNT, {
    variables: {
      amount: 100,
      id: session?.user?.email,
    },
  });
  return (
    <header className='sticky top-0 z-[9999] flex w-full items-center justify-between bg-background'>
      <div className='flex items-center justify-center pl-5 md:w-1/5 md:pl-0'>
        <Link href='/'>
          <div className='relative h-10 w-5 cursor-pointer opacity-75 transition hover:opacity-100'>
            <img
              src='https://rb.gy/vsvv2o'
              // layout='fill'
              // objectFit='contain'
              className='object-contain'
              alt={''}
            />
          </div>
        </Link>
      </div>
      <div className='hidden flex-1 items-center justify-center space-x-8 md:flex'>
        {HEADER.map((header, index) => (
          <div key={index} className='headerLink'>
            <Link href={header.link}>{header.header}</Link>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center gap-x-4 pr-5 md:w-1/5 md:pr-0'>
        <MagnifyingGlassIcon className='headerIcon' />
        <Link href='/checkout'>
          <div className='relative cursor-pointer'>
            {!loading && !error && data && data.getTotalCount.quantity > 0 ? (
              <span className='gradient absolute -right-1 -top-1 z-50 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white'>
                {data.getTotalCount.quantity}
              </span>
            ) : (
              ''
            )}
            <ShoppingBagIcon className='headerIcon' />
          </div>
        </Link>
        <UserIcon className='headerIcon' onClick={() => signOut()} />
      </div>
    </header>
  );
}

export default Header;
