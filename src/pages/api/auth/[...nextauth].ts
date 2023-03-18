import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { token, id } = credentials as {
          token: string;
          id: string;
        };
        const user = {
          email: id,
          name: token,
          id: '1',
        };
        if (user) {
          return user;
        }
        else {
          return null
        }

       
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  secret: 'TOKEN_STRING',
  debug: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(url);
      return `${baseUrl}`;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
