import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Contact form not configured' }, { status: 503 })
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to:   process.env.TO_EMAIL   ?? 'hello@mujganar.studio',
    replyTo: email,
    subject: `mujganar.studio — message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
