import { useState, useEffect, Key, SetStateAction } from 'react';
import { Tab } from '@headlessui/react';
import { GET_PRODUCTS } from '@/queries';
import { useQuery } from '@apollo/client';
import ProductList from './ProductList';
import Product from './Product';

interface Props {
  categories: [
    {
      _id: string;
      title: String;
    }
  ];
  firstCategory: String;
}

function Tabs({ categories, firstCategory }: Props) {
  const [selected, setSelected] =
    useState<SetStateAction<Key | null | undefined>>(0);
  const [selectedCategory, setSelectedCategory] = useState(firstCategory);
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      amount: 100,
      categoryId: selectedCategory,
    },
  });

  function showProducts(category: number) {
    return (
      categories &&
      data &&
      data.getProducts
        .filter(
          (product: { category: { _id: String } }) =>
            product.category._id === categories[category]?._id
        )
        .map((product: any) => <Product key={product._id} product={product} />)
    );
  }

  return (
    categories && (
      <Tab.Group>
        <Tab.List className='flex justify-center'>
          {categories.map(
            (
              category: { _id: string; title: String },
              index: Key | null | undefined
            ) => (
              <Tab
                key={index}
                id={category._id}
                className={`${
                  selected === index
                    ? 'borderGradient bg-[#35383c] text-white'
                    : 'border-b-2 border-[#35383c] text-[#747474]'
                } whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none transition-all md:py-4 md:px-6 md:text-base`}
                onClick={() => {
                  setSelected(index);
                  setSelectedCategory(category._id);
                }}
              >
                {category.title}
              </Tab>
            )
          )}
        </Tab.List>
        <ProductList showProducts={showProducts} />
      </Tab.Group>
    )
  );
}

export default Tabs;
