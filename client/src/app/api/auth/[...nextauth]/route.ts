import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const payload = {
          googleUser: true,
          googleId: account?.providerAccountId,
          username: user.name,
          email: user.email,
          image: user.image,
          role: "user"
        };
        
        await axios.post("http://localhost:4000/google/signup", payload, { 
          withCredentials: true 
        });
        
  
        if (account) {
          user.id = account.providerAccountId;
         
        }
        
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      return session;
    }
  }
});

export { handler as GET, handler as POST };