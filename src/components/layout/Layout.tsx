import React from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

function Layout({ children }: Props) {
  return (
    <div className='flex min-h-screen gradient w-screen justify-center'>
      <div className='m-auto bg-slate-50 rounded-md mx-3 w-full lg:w-4/5 xl:w-1/3 py-10'>
        <div className='right flex flex-col justify-evenly'>
          <div className='text-center py-10'>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
