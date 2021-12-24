import { supabase } from "./supabaseClient";

export default async function signInWithDiscord(loc: any) {
  console.log("signInWithDiscord", loc);
  const { user, session, error } = await supabase.auth.signIn(
    {
      provider: "discord",
    },
    {
      redirectTo:
        process.env.NEXT_PUBLIC_ENV === "prod"
          ? `${process.env.NEXT_PUBLIC_URL}/${loc}`
          : `http://localhost:3000/${loc}`,
    }
  );
  return { user, session, error };
}
