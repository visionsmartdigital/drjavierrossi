import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().default(""),
  service: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LOG_FILE = path.join(process.cwd(), "el negro vigila.txt");

async function appendContactLog(entry: {
  name: string;
  email: string;
  phone: string;
  service: string;
  messageId: string | undefined;
}) {
  const timestamp = new Date().toISOString();
  const line =
    `[${timestamp}] name="${entry.name}" email="${entry.email}" ` +
    `phone="${entry.phone || "-"}" service="${entry.service || "-"}" ` +
    `messageId=${entry.messageId ?? "-"}\n`;

  // Vercel logs (always available, even when FS is read-only).
  console.log(`[contact-log] ${line.trim()}`);

  // Filesystem log (works in dev; silently no-op in read-only environments).
  try {
    await fs.appendFile(LOG_FILE, line, "utf8");
  } catch (err) {
    console.warn(
      `[contact-log] no se pudo escribir "${LOG_FILE}":`,
      err instanceof Error ? err.message : err,
    );
  }
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP no configurado: faltan SMTP_HOST, SMTP_USER o SMTP_PASS",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
}

async function handlePost({ request }: { request: Request }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, phone, service, message } = parsed.data;

  const recipients = (process.env.MAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return Response.json(
      { error: "MAIL_TO no configurado" },
      { status: 500 },
    );
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const subject = `Nueva consulta web — ${name}`;
  const html = `
    <h2>Nueva consulta desde el sitio web</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>WhatsApp / Teléfono:</strong> ${escapeHtml(phone || "—")}</p>
    <p><strong>Servicio de interés:</strong> ${escapeHtml(service || "—")}</p>
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message || "—")}</p>
  `;
  const text = [
    `Nueva consulta desde el sitio web`,
    `Nombre: ${name}`,
    `Email: ${email}`,
    `WhatsApp / Teléfono: ${phone || "—"}`,
    `Servicio de interés: ${service || "—"}`,
    `Mensaje:`,
    message || "—",
  ].join("\n");

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from,
      to: recipients,
      replyTo: email,
      subject,
      html,
      text,
    });

    await appendContactLog({
      name,
      email,
      phone,
      service,
      messageId: info.messageId,
    });

    return Response.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("[/api/contact] SMTP error:", err);
    return Response.json(
      {
        error: "Email send failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: handlePost,
    },
  },
});
