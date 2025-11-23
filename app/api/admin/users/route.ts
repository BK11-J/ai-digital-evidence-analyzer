import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })

  try {
    const { data, error } = await supabase.from("users").select("*")
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error("[v0] Admin users fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const { userId, isPremium } = await request.json()

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })

  try {
    const { error } = await supabase
      .from("users")
      .update({ is_premium: isPremium, subscription_tier: isPremium ? "premium" : "free" })
      .eq("id", userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Admin update error:", err)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
