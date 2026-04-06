import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

/**
 * Webhook receiver para MercadoPago.
 *
 * MercadoPago envía notificaciones a esta URL con los params:
 *   ?type=payment&data.id=<payment_id>
 *
 * Este handler reenvía la notificación al backend .NET.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "";
  const dataId = searchParams.get("data.id") ?? "";

  try {
    const backendUrl = `${API_BASE}/MercadoPago/webhook?type=${encodeURIComponent(type)}&data.id=${encodeURIComponent(dataId)}`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[MP Webhook] Backend respondió ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[MP Webhook] Error al reenviar al backend:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * MercadoPago a veces verifica el webhook con un GET.
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
