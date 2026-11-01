
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  function redirectWithCookies(path: string) {
    const url = request.nextUrl.clone();
    url.pathname = path;

    const redirectResponse = NextResponse.redirect(url);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  if (!user) {
    return redirectWithCookies("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return redirectWithCookies("/login");
  }

  // Admin ko dashboard access hai.
  if (profile.role === "admin") {
    return response;
  }

  // Seller ke liye Admin approval zaroori hai.
  if (profile.role === "seller") {
    const { data: application } = await supabase
      .from("seller_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (application?.status === "approved") {
      return response;
    }

    return redirectWithCookies("/registered");
  }

  // Customer dashboard access nahi kar sakta.
  return redirectWithCookies("/");
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/earnings/:path*",
    "/reviews/:path*",
    "/settings/:path*",
  ],
};
