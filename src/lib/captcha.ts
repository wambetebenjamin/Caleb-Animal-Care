/**
 * Google reCAPTCHA — server-side verification.
 * v3 everywhere (score-based, invisible). When the v3 score is below 0.5 the
 * client is told to render the v2 checkbox widget and resubmit; v2 tokens are
 * verified against the v2 secret (no score).
 *
 * Development mode: if secrets are not configured AND the token equals
 * "dev-bypass", verification passes so forms stay usable locally.
 */

export interface CaptchaResult {
  ok: boolean;
  score: number | null;
  action: string | null;
  lowScoreFallback: boolean;
  devMode: boolean;
}

async function verifyWithGoogle(token: string, secret: string) {
  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };
}

export async function verifyCaptcha(
  token: string | null | undefined,
  opts: { expectedAction?: string; minScore?: number } = {},
): Promise<CaptchaResult> {
  const minScore = opts.minScore ?? 0.5;
  const v3Secret = process.env.RECAPTCHA_SECRET_KEY;
  const v2Secret = process.env.RECAPTCHA_V2_SECRET_KEY ?? v3Secret;

  if (!token) {
    return { ok: false, score: null, action: null, lowScoreFallback: false, devMode: false };
  }

  // Dev mode: no keys configured → accept the client sentinel only.
  if (!v3Secret) {
    if (token === "dev-bypass") {
      return { ok: true, score: 1, action: opts.expectedAction ?? null, lowScoreFallback: false, devMode: true };
    }
    // Allow real tokens through in staging-before-secrets setups? No — fail closed.
    return { ok: false, score: null, action: null, lowScoreFallback: false, devMode: false };
  }

  // v2 fallback token (checkbox) — sent with version marker.
  if (token.startsWith("v2:")) {
    const raw = token.slice(3);
    const data = await verifyWithGoogle(raw, v2Secret ?? "");
    return {
      ok: Boolean(data?.success),
      score: null,
      action: null,
      lowScoreFallback: false,
      devMode: false,
    };
  }

  const data = await verifyWithGoogle(token, v3Secret);
  if (!data?.success) {
    return { ok: false, score: null, action: null, lowScoreFallback: false, devMode: false };
  }
  const score = typeof data.score === "number" ? data.score : 1;
  const actionOk = !opts.expectedAction || data.action === opts.expectedAction;
  if (!actionOk || score < minScore) {
    // Below threshold → require v2 challenge instead of hard-rejecting humans.
    return { ok: false, score, action: data.action ?? null, lowScoreFallback: true, devMode: false };
  }
  return { ok: true, score, action: data.action ?? null, lowScoreFallback: false, devMode: false };
}

/** Uniform 400 response for failed captcha. */
export function captchaFailResponse(result: CaptchaResult) {
  return Response.json(
    {
      ok: false,
      error: result.lowScoreFallback
        ? "Additional verification required. Please complete the checkbox and submit again."
        : "We could not verify this submission. Please try again.",
      code: result.lowScoreFallback ? "RECAPTCHA_V2_REQUIRED" : "RECAPTCHA_FAILED",
    },
    { status: 400 },
  );
}
