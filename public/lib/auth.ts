import { NextAuthOptions, getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
export const getServerAuthSession = async (context: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return await getServerSession(context.req, context.res, authOptions);
};


