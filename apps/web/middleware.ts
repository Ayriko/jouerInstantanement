import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes nécessitant une authentification (sans préfixe de locale)
const protectedRoutes = ['/my-account', '/order'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Le pathname est de la forme /fr/my-account — on extrait locale et chemin
    const segments = pathname.split('/');
    const locale = segments[1]; // "fr", "en", "es"
    const pathWithoutLocale = '/' + segments.slice(2).join('/');

    const isProtected = protectedRoutes.some((route) =>
        pathWithoutLocale.startsWith(route),
    );

    if (isProtected) {
        const session = request.cookies.get('better-auth.session_token');

        if (!session) {
            return NextResponse.redirect(
                new URL(`/${locale}/sign-in`, request.url),
            );
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'],
};