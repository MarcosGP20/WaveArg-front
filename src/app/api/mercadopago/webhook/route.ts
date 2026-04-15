import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

/**
 * Valida la firma HMAC-SHA256 enviada por MercadoPago en el header x-signature.
 * Formato del header: "ts=<timestamp>,v1=<hash>"
 * El mensaje firmado es: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 *
 * Retorna true si el secret no está configurado (modo dev) o si la firma es válida.
 */
function isValidSignature(req: NextRequest, dataId: string): boolean {
  if (!MP_WEBHOOK_SECRET) return true; // sin secret configurado, se omite validación

  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";

  const ts = xSignature.match(/ts=([^,]+)/)?.[1];
  const v1 = xSignature.match(/v1=([^,]+)/)?.[1];

  if (!ts || !v1) return false;

  const message = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", MP_WEBHOOK_SECRET)
    .update(message)
    .digest("hex");

  return expected === v1;
}

/**
 * Webhook receiver para MercadoPago.
 *
 * MercadoPago envía notificaciones a esta URL con los params:
 *   ?type=payment&data.id=<payment_id>
 *
 * Este handler valida la firma HMAC-SHA256 y reenvía la notificación al backend .NET.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "";
  const dataId = searchParams.get("data.id") ?? "";

  if (!isValidSignature(req, dataId)) {
    console.warn("[MP Webhook] Firma inválida — request rechazado");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
