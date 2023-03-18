import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  children: JSX.Element[] | JSX.Element;
  excludedRoutes?: string[];
}

function AuthGuard({ children, excludedRoutes }: Props) {
  const { status } = useSession();
  const router = useRouter();
  console.log(status);

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      !excludedRoutes?.includes(router.pathname)
    ) {
      router.push('/auth/signin');
    } else if (
      status === 'authenticated' &&
      excludedRoutes?.includes(router.pathname)
    ) {
      router.push('/');
    }
  }, [status, excludedRoutes, router]);

  return (
    <>
      {excludedRoutes?.includes(router.pathname) ? (
        children
      ) : (
        <>{status === 'authenticated' && children}</>
      )}
    </>
  );
}

export default AuthGuard;
