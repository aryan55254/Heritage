import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/chat", "/settings"];
    const authRoutes = ["/login", "/register", "/"];

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);

    let isValidSession = false;
    if (session) {
        try {
            await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
            isValidSession = true;
        } catch (err) {
            console.log("Session invalid");
        }
    }

    // 1. Protect Chat/Settings
    if (isProtectedRoute && !isValidSession) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // 2. Redirect away from Login if already logged in
    if (isAuthRoute && isValidSession && pathname !== "/") {
        return NextResponse.redirect(new URL("/chat", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};