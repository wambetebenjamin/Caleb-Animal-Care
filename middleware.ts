import { withAuth } from "next-auth/middleware";

/**
 * Edge middleware: block /my-pets (pet wellness portal) without a valid
 * owner session. Unauthenticated visitors are redirected to /login.
 */
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/my-pets", "/my-pets/:path*"],
};
