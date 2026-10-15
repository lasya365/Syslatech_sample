
import type { APIRoute } from "astro";

export const prerender = false;

// Retrieve the saved draft from the current session.
export const GET: APIRoute = async ({ session }) => {
  try {
    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Session is unavailable.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const draft = await session.get("contactFormDraft");

    return new Response(
      JSON.stringify({
        success: true,
        draft: draft ?? null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unable to retrieve contact draft:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Unable to retrieve your draft.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Save the visitor's current form values in the session.
export const POST: APIRoute = async ({ request, session }) => {
  try {
    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Session is unavailable.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await request.json();

    const draft = {
      name: String(body.name ?? "").slice(0, 60),
      countryCode: String(body.countryCode ?? "").slice(0, 10),
      phone: String(body.phone ?? "").slice(0, 15),
      email: String(body.email ?? "").slice(0, 254),
      message: String(body.message ?? "").slice(0, 2000),
    };

    await session.set("contactFormDraft", draft);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Draft saved successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unable to save contact draft:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Unable to save your draft.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Clear the saved draft after successful contact submission.
export const DELETE: APIRoute = async ({ session }) => {
  try {
    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Session is unavailable.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await session.delete("contactFormDraft");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Draft cleared successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unable to clear contact draft:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Unable to clear your draft.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
