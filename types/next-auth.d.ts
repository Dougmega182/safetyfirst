export { default } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Add role property
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Ensure role is included in JWT token
  }
}
