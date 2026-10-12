import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(
  async (context, next) => {
    const start = Date.now();

    const response = await next();

    const duration = Date.now() - start;

    console.log('--- Website Request ---');
    console.log('Method:', context.request.method);
    console.log('URL:', context.url.pathname);
    console.log('Status:', response.status);
    console.log('Duration:', duration, 'ms');

    return response;
  }
);