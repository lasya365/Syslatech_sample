
import type { APIRoute } from 'astro';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

const dataFile = fileURLToPath(
  new URL('../../../data/inquiries.json', import.meta.url)
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const name = String(body.name ?? '').trim();
    const countryCode = String(body.countryCode ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !phone || !email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name, phone, and email are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await mkdir(dirname(dataFile), { recursive: true });

    let inquiries = [];

    try {
      const fileContents = await readFile(dataFile, 'utf-8');
      inquiries = JSON.parse(fileContents);

      if (!Array.isArray(inquiries)) {
        throw new Error('The inquiries file must contain a JSON array.');
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    inquiries.push({
      id: Date.now(),
      name,
      countryCode,
      phone,
      email,
      message,
      submittedAt: new Date().toISOString(),
    });

    await writeFile(dataFile, JSON.stringify(inquiries, null, 2), 'utf-8');

    return new Response(
      JSON.stringify({ success: true, message: 'Your inquiry was saved successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unable to save contact inquiry:', error);

    return new Response(
      JSON.stringify({ success: false, message: 'Unable to save your inquiry. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
