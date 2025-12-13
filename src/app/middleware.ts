// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/chat"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isPublicRoute = ["/login", "/register", "/"].includes(pathname);

    let userId = null;
    if (session) {
        try {
            const { payload } = await jwtVerify(session, encodedKey);
            userId = payload.userId;
        } catch (err) {
            console.log("Invalid session");
        }
    }

    if (isProtectedRoute && !userId) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (isPublicRoute && userId && pathname !== "/") {
        return NextResponse.redirect(new URL("/chat", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};