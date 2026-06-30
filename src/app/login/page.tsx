"use client";

import { C, display, font, mono } from "@/lib/tokens";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HERO_IMG =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const valid = email.trim().length > 0;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => router.push("/overview"), 350);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
        fontFamily: font,
      }}
    >
      {/* Left — form */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "32px 48px",
          background: C.surface,
          minHeight: "100vh",
        }}
      >
        {/* Top wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark />
          <div>
            <div
              style={{
                fontFamily: display,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: C.text,
                lineHeight: 1,
              }}
            >
              Agent Cargo
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: 3,
              }}
            >
              ops dashboard
            </div>
          </div>
        </div>

        {/* Centered form block */}
        <form
          onSubmit={submit}
          style={{
            width: "100%",
            maxWidth: 360,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: display,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: C.text,
                lineHeight: 1.15,
              }}
            >
              Sign in
            </h1>
            <div
              style={{
                marginTop: 8,
                fontSize: 12.5,
                color: C.textSec,
                lineHeight: 1.55,
              }}
            >
              Continue to your ops dashboard.
            </div>
          </div>

          <button
            type="button"
            onClick={() => submit()}
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "11px 14px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.text,
              fontFamily: font,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: mono,
              fontSize: 10,
              color: C.textTer,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            <span style={{ flex: 1, height: 1, background: C.borderLight }} />
            or
            <span style={{ flex: 1, height: 1, background: C.borderLight }} />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: mono,
                fontSize: 9.5,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Work email
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adam@gire.no"
              style={{
                width: "100%",
                padding: "10px 13px",
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.text,
                fontFamily: font,
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.accent)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          <button
            type="submit"
            disabled={!valid || submitting}
            style={{
              width: "100%",
              padding: "11px 14px",
              background: valid ? C.accent : C.surfaceAlt,
              color: valid ? "#FFFFFF" : C.textTer,
              border: `1px solid ${valid ? C.accent : C.border}`,
              fontFamily: font,
              fontSize: 13,
              fontWeight: 600,
              cursor: valid && !submitting ? "pointer" : "not-allowed",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (valid && !submitting) e.currentTarget.style.background = "#0A8995";
            }}
            onMouseLeave={(e) => {
              if (valid && !submitting) e.currentTarget.style.background = C.accent;
            }}
          >
            {submitting ? (
              <>
                <Spinner /> Signing in…
              </>
            ) : (
              "Continue"
            )}
          </button>

          <div
            style={{
              fontSize: 11,
              color: C.textTer,
              textAlign: "center",
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            By continuing, you agree to the{" "}
            <a style={legalLinkStyle}>Terms of Use</a> and acknowledge the{" "}
            <a style={legalLinkStyle}>Privacy Policy</a> and{" "}
            <a style={legalLinkStyle}>Code of Conduct</a>.
          </div>
        </form>

        {/* Bottom footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 10,
            color: C.textTer,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>Agent Cargo · v1.0</span>
          <span>Built for Gire Mobility</span>
        </div>
      </div>

      {/* Right — image */}
      <div
        style={{
          position: "relative",
          background: C.text,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <img
          src={HERO_IMG}
          alt="Norwegian coastal road"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Subtle bottom gradient so caption stays readable */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 220,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        {/* "Curated by" caption chip */}
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 28,
            background: C.surface,
            border: `1px solid ${C.border}`,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: C.accentSoft,
              color: C.accent,
              border: `1px solid ${C.accentBorder}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: mono,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            GM
          </span>
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 9,
                color: C.textTer,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              Deployed for
            </div>
            <div
              style={{
                fontFamily: display,
                fontSize: 13,
                color: C.text,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginTop: 1,
              }}
            >
              Gire Mobility
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const legalLinkStyle: React.CSSProperties = {
  color: C.text,
  textDecoration: "underline",
  textDecorationColor: C.border,
  textUnderlineOffset: 2,
  cursor: "pointer",
};

function BrandMark() {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        background: C.text,
        color: "#FFFFFF",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: display,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      AC
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.75h3.56c2.08-1.92 3.28-4.74 3.28-8.08Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.56-2.75c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 12,
        height: 12,
        border: "1.5px solid rgba(255,255,255,0.4)",
        borderTopColor: "#FFFFFF",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
