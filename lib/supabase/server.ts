import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

// Default Supabase configuration (fallback if env vars not set)
const DEFAULT_SUPABASE_URL = "https://0ec90b57d6e95fcbda19832f.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw";

function getEnvValue(envKey: string, fallback: string): string {
  return process.env[envKey] || fallback;
}

export function getServiceSupabase(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const url = getEnvValue("SUPABASE_URL", DEFAULT_SUPABASE_URL) || 
              getEnvValue("NEXT_PUBLIC_SUPABASE_URL", DEFAULT_SUPABASE_URL);
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }

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

  const url = getEnvValue("SUPABASE_URL", DEFAULT_SUPABASE_URL) || 
              getEnvValue("NEXT_PUBLIC_SUPABASE_URL", DEFAULT_SUPABASE_URL);
  
  const anonKey = getEnvValue("SUPABASE_ANON_KEY", DEFAULT_SUPABASE_ANON_KEY) ||
                  getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", DEFAULT_SUPABASE_ANON_KEY);

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
