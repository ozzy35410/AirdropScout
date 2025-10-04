import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

function ensureValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getServiceSupabase(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const url = ensureValue(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL"
  );
  const serviceRoleKey = ensureValue(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");

  serviceClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        "X-Client-Info": "airdropscout-admin"
      }
    }
  });

  return serviceClient;
}

export function getPublicSupabase(): SupabaseClient {
  if (publicClient) return publicClient;

  const url = ensureValue(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL"
  );
  const anonKey = ensureValue(
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );

  publicClient = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        "X-Client-Info": "airdropscout-public"
      }
    }
  });

  return publicClient;
}
