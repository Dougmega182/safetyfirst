import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }
        return { id: "123", name: "John Doe", role: "ADMIN" }; // Example user
      }
      
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Ensure token gets the role
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Assign role to session
      return session;
    },
  },
};

export default NextAuth(authOptions);
