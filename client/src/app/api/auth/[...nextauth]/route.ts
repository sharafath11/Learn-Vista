import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { apiBaseUrl } from "next-auth/client/_utils";

// Configure Axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout globally

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Validate required fields
        if (!account?.providerAccountId || !user.email) {
          console.error("Missing required fields for sign-in");
          throw new Error("Missing required user information");
        }

        const payload = {
          googleUser: true,
          googleId: account.providerAccountId,
          username: user.name || profile?.name || "",
          email: user.email,
          image: user.image || profile?.image || "",
          role: "user"
        };

        console.log("Attempting to register user with backend:", payload);

        const response = await axios.post(
          ` http://localhost:4000/google/signup`,
          payload,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            timeout: 8000 
          }
        );
        

        console.log("Backend response:", response.data);

        if (response.status >= 400) {
          console.error("Backend API error:", response.data);
          throw new Error(response.data.message || "Backend registration failed");
        }

        // Store backend user ID if available
        if (response.data?.id) {
          user.id = response.data.id;
          user.role = response.data.role || "user";
        } else {
          user.id = account.providerAccountId;
          user.role = "user";
        }

        return true;
      } catch (error: any) {
        console.error("Authentication error:", {
          message: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          config: error.config,
          response: error.response?.data
        });

        // You can customize the error message based on error type
        let errorMessage = "Authentication failed";
        if (error.code === "ECONNABORTED") {
          errorMessage = "Connection to backend timed out";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        throw new Error(errorMessage); // This will redirect to error page
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          name: token.name as string,
          email: token.email as string,
          image: token.image as string
        };
      }
      return session;
    }
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.log(code, metadata);
    }
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };