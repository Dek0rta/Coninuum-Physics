import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … files in the `public` folder
    // - … Next.js internals
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
