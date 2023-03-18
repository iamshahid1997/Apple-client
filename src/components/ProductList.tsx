import React from 'react';
import { Tab } from '@headlessui/react';

interface Props {
  showProducts: (category: number) => any;
}

function ProductList({ showProducts }: Props) {
  return (
    <Tab.Panels className='mx-auto max-w-fit pt-10 pb-24 sm:px-4'>
      <Tab.Panel className='tabPanel'>{showProducts(0)}</Tab.Panel>
      <Tab.Panel className='tabPanel'>{showProducts(1)}</Tab.Panel>
      <Tab.Panel className='tabPanel'>{showProducts(2)}</Tab.Panel>
      <Tab.Panel className='tabPanel'>{showProducts(3)}</Tab.Panel>
    </Tab.Panels>
  );
}

export default ProductList;
