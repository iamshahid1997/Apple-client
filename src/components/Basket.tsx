import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

function Basket() {
  return (
    <Link href='/checkout'>
      <div className='fixed bottom-10 right-10 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-300'>
        <span className='gradient absolute -right-2 -top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full text-[10px] text-white'>
          2
        </span>
        <ShoppingBagIcon className='headerIcon h-8 w-8' />
      </div>
    </Link>
  );
}

export default Basket;
