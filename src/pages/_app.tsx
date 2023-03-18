import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <Toaster />
        <AuthGuard excludedRoutes={['/auth/signin', '/auth/register']}>
          <Component {...pageProps} />
        </AuthGuard>
      </ApolloProvider>
    </SessionProvider>
  );
}
