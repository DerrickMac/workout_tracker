import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import { prisma } from "./app/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // This callback is invoked after a successful sign-in.
      // `user` at this point is the object returned from the provider's `profile` function or the adapter.
      
      // Since using PrismaAdapter handles user creation automatically if `adapter` is configured,
      // you might not need manual user creation. The adapter should take care of it.
      //
      // However, if you want to control user creation manually, consider removing PrismaAdapter
      // and writing logic in the callbacks. Let's show an example:

      // Check if user already exists in DB by their email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email ?? "" },
      });
      
      if (!existingUser && user.email) {
        // Create new user
        await prisma.user.create({
          data: {
            name: user.name ?? "",
            email: user.email,
          }
        });
      }

      // Return true to allow the sign-in
      return true;
    },
    async jwt({ token, user }) {
      // `user` is available only on the initial sign-in. On subsequent requests, `user` is undefined.
      // If you just created or found the user in signIn callback, you can store user ID in token.
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user ID to the session for client-side access
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
