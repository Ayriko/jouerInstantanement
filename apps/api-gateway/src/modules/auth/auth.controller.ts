import { All, Controller, Req, Res } from '@nestjs/common';

import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    private readonly authServiceUrl =
        process.env.AUTH_SERVICE_URL ?? 'http://localhost:3002';

    @All('*splat')
    async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
        const targetUrl = `${this.authServiceUrl}${req.originalUrl}`;

        const headers: Record<string, string> = {
            origin:
                req.headers.origin ??
                `http://localhost:${process.env.PORT ?? 3000}`,
        };
        if (req.headers['content-type']) {
            headers['content-type'] = req.headers['content-type'];
        }
        if (req.headers.cookie) {
            headers.cookie = req.headers.cookie;
        }
        if (req.headers.authorization) {
            headers.authorization = req.headers.authorization;
        }

        const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
        const body = hasBody && req.body ? JSON.stringify(req.body) : undefined;

        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            redirect: 'manual',
        });

        res.status(proxyRes.status);
        proxyRes.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        res.send(await proxyRes.text());
    }
}
