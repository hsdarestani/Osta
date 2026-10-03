import React, { ReactNode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, Bot, Braces, Check, CheckCircle2, Code2, Cpu,
  FileText, Gauge, Image, Layers3, MessageSquare, ShieldCheck,
  Sparkles, Terminal, Video, Wallet, Webhook, Zap
} from "lucide-react";

declare global {
  interface Window {
    __BAVAAN__?: { authenticated?: boolean; freeCredit?: number };
  }
}

const boot = window.__BAVAAN__ || {};
const freeCredit = Number(boot.freeCredit || 50000);
const fa = new Intl.NumberFormat("fa-IR");

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function IconWrap({ children }: { children: ReactNode }) {
  return <span className="icon-wrap">{children}</span>;
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="primary-button">
      {children}
      <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
    </a>
  );
}

function Odometer({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const started = performance.now();
    const duration = 320;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{fa.format(value)} تومان</>;
}

function BrainGraphic() {
  return (
    <div className="brain-3d" aria-hidden="true">
      <div className="brain-shadow" />
      <svg viewBox="0 0 420 340" className="brain-svg" role="img">
        <defs>
          <linearGradient id="brainA" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#54f0c4" />
            <stop offset="42%" stopColor="#31c9ff" />
            <stop offset="100%" stopColor="#845cff" />
          </linearGradient>
          <linearGradient id="brainB" x1="1" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff6bc7" />
            <stop offset="45%" stopColor="#7b6dff" />
            <stop offset="100%" stopColor="#2fe0c0" />
          </linearGradient>
          <linearGradient id="brainDepth" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#162b46" />
            <stop offset="100%" stopColor="#08101f" />
          </linearGradient>
          <filter id="brainGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse cx="210" cy="290" rx="112" ry="24" fill="#020711" opacity=".55" />
        <path d="M118 244 C76 223 70 172 98 143 C83 104 111 75 151 76 C166 47 205 43 226 64 C259 45 297 66 300 99 C337 106 351 142 335 170 C354 205 330 240 296 245 C278 276 237 281 211 260 C180 281 140 271 118 244Z" fill="url(#brainDepth)" opacity=".98" transform="translate(0 14)" />
        <g filter="url(#brainGlow)" className="brain-lobes">
          <path d="M114 225 C78 205 77 164 101 140 C88 108 111 80 147 82 C159 54 193 51 210 71 L210 251 C179 273 135 257 114 225Z" fill="url(#brainA)" />
          <path d="M210 71 C235 49 276 62 281 94 C318 96 335 131 321 158 C346 190 328 226 294 232 C277 260 240 270 210 251Z" fill="url(#brainB)" />
        </g>
        <g fill="none" stroke="#e8fbff" strokeOpacity=".54" strokeWidth="5" strokeLinecap="round">
          <path d="M133 105 C157 97 171 115 162 132 C151 151 165 163 184 158" />
          <path d="M109 157 C132 149 146 166 136 183 C126 202 145 217 166 210" />
          <path d="M177 83 C191 95 185 111 174 119" />
          <path d="M168 225 C183 211 192 195 180 178" />
          <path d="M245 84 C228 99 235 118 251 125 C269 134 265 151 250 160" />
          <path d="M294 113 C274 114 262 130 270 147 C281 169 264 180 246 179" />
          <path d="M315 174 C292 166 278 187 290 204" />
          <path d="M237 225 C226 211 231 194 245 188" />
        </g>
        <path d="M210 75 L210 250" stroke="#c8fff0" strokeOpacity=".45" strokeWidth="3" strokeDasharray="7 9" />
        <g className="brain-points">
          <circle cx="137" cy="120" r="5" fill="#fff" />
          <circle cx="172" cy="160" r="4" fill="#fff" />
          <circle cx="279" cy="139" r="5" fill="#fff" />
          <circle cx="247" cy="189" r="4" fill="#fff" />
        </g>
      </svg>
      <div className="brain-base"><span>B</span><strong>Bavaan Core</strong></div>
    </div>
  );
}

function HeroNetwork() {
  const nodes = [
    ["OpenAI", "oai", "node-1", "mint"],
    ["Claude", "cl", "node-2", "violet"],
    ["Gemini", "gm", "node-3", "blue"],
    ["DeepSeek", "ds", "node-4", "pink"],
    ["Qwen", "qw", "node-5", "amber"],
    ["Llama", "ll", "node-6", "cyan"]
  ];
  return (
    <div className="hero-visual" aria-label="مغز هوش مصنوعی Bavaan و اتصال به چند مدل">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="orbit orbit-c" />
      <BrainGraphic />
      {nodes.map(([name, short, cls, tone]) => (
        <div key={name} className={cn("model-node", cls, "tone-" + tone)}>
          <span className="model-node-mark">{short}</span>
          <span>{name}</span>
        </div>
      ))}
      <div className="vector-cube cube-a"><i /><b /><em /></div>
      <div className="vector-cube cube-b"><i /><b /><em /></div>
      <div className="vector-orb orb-a" />
      <div className="vector-orb orb-b" />
      <div className="signal-dot signal-1" />
      <div className="signal-dot signal-2" />
      <div className="signal-dot signal-3" />
    </div>
  );
}

function CapabilityRail() {
  const items = [
    [<Braces className="size-4" />, "API یکپارچه"],
    [<Bot className="size-4" />, "اتوماسیون"],
    [<MessageSquare className="size-4" />, "مدل‌های متنی"],
    [<Image className="size-4" />, "تصویر"],
    [<Video className="size-4" />, "ویدئو"],
    [<Wallet className="size-4" />, "کیف پول ریالی"],
    [<Gauge className="size-4" />, "کنترل مصرف"]
  ];
  return (
    <section className="capability-rail" aria-label="قابلیت‌های Bavaan">
      <div className="page-shell capability-inner">
        {items.map(([icon, label], i) => (
          <div key={i} className="capability-item">{icon}<span>{label}</span></div>
        ))}
      </div>
    </section>
  );
}

function UsagePanel() {
  return (
    <div className="usage-panel">
      <div className="panel-topline">
        <div>
          <span className="eyebrow">مصرف امروز</span>
          <strong>همه چیز، یکجا</strong>
        </div>
        <div className="status-chip"><span /> زنده</div>
      </div>
      <div className="usage-table">
        {[
          ["Gemini 2.5 Flash", "۱۲٬۴۸۰", "۲٬۱۶۰", "۳٬۸۴۰ تومان"],
          ["GPT", "۸٬۹۲۰", "۱٬۲۱۰", "۵٬۹۰۰ تومان"],
          ["Claude", "۳٬۷۶۰", "۹۴۰", "۴٬۱۲۰ تومان"]
        ].map((r) => (
          <div className="usage-row" key={r[0]}>
            <strong>{r[0]}</strong>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <b>{r[3]}</b>
          </div>
        ))}
      </div>
      <div className="usage-legend"><span>مدل</span><span>ورودی</span><span>خروجی</span><span>هزینه</span></div>
    </div>
  );
}

function DashboardBento() {
  return (
    <section id="features" className="section-block">
      <div className="page-shell">
        <div className="section-heading center-heading">
          <span className="section-kicker">یک تجربه ساده برای مصرف AI</span>
          <h2>فروش توکن، بدون اینکه تجربه کاربر شبیه یک پنل خام API باشد.</h2>
          <p>مدل، هزینه، مصرف و کیف پول در یک تجربه فارسی و قابل فهم؛ برای توسعه‌دهنده و کاربر عادی.</p>
        </div>

        <div className="bento-grid">
          <article className="bento-card bento-main">
            <div className="card-title-row">
              <div><span className="eyebrow">گزارش مصرف</span><h3>هزینه هر درخواست شفاف است</h3></div>
              <IconWrap><FileText className="size-5" /></IconWrap>
            </div>
            <UsagePanel />
          </article>

          <article className="bento-card wallet-card">
            <IconWrap><Wallet className="size-5" /></IconWrap>
            <span className="eyebrow">موجودی کیف پول</span>
            <p className="big-number"><Odometer target={2480000} /></p>
            <div className="wallet-bar"><span /></div>
            <small>شارژ ریالی و مصرف بر اساس مدل</small>
          </article>

          <article className="bento-card compact-card">
            <IconWrap><Gauge className="size-5" /></IconWrap>
            <div><span className="eyebrow">Budget Guard</span><h3>سقف مصرف برای هر کلید</h3></div>
            <div className="budget-line"><span style={{ width: "64%" }} /></div>
            <div className="budget-label"><span>مصرف شده</span><b>۶۴٪</b></div>
          </article>

          <article className="bento-card compact-card">
            <IconWrap><Webhook className="size-5" /></IconWrap>
            <div><span className="eyebrow">Request Log</span><h3>هر درخواست قابل پیگیری</h3></div>
            <div dir="ltr" className="mini-console">
              <span className="ok">request.completed</span>
              <span>req_bv_8f••••</span>
              <span>billing: recorded</span>
            </div>
          </article>

          <article className="bento-card compact-card">
            <IconWrap><ShieldCheck className="size-5" /></IconWrap>
            <div><span className="eyebrow">امنیت</span><h3>کنترل‌های ضروری از روز اول</h3></div>
            <div className="tag-cloud">
              {["HTTPS", "Spend Limit", "Request ID", "Session امن"].map(x => <span key={x}>{x}</span>)}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function RouterVisual() {
  const nodes = ["OpenAI", "Anthropic", "Google", "DeepSeek", "Open Models"];
  return (
    <div className="router-visual">
      <div className="router-grid" />
      <div className="router-core"><Layers3 className="size-6" /><strong>Bavaan</strong><small>Smart Router</small></div>
      {nodes.map((n, i) => <div key={n} className={"router-node router-node-" + (i + 1)}>{n}</div>)}
      <span className="route-line route-line-1" />
      <span className="route-line route-line-2" />
      <span className="route-line route-line-3" />
      <span className="route-line route-line-4" />
      <span className="route-line route-line-5" />
    </div>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="section-block tinted-section">
      <div className="page-shell split-layout">
        <div className="section-heading">
          <span className="section-kicker">Smart Routing</span>
          <h2>یک API در جلو، چند مسیر در پشت.</h2>
          <p>کاربر لازم نیست برای هر Provider حساب جدا بسازد. Bavaan مسیر مناسب را بر اساس مدل، هزینه و در دسترس بودن انتخاب می‌کند.</p>
          <div className="check-list">
            {["یک API Key برای چند مدل", "آماده برای اتصال Provider مستقیم", "Fallback بدون تغییر کد کاربر", "گزارش مصرف در یک Wallet"].map(x => (
              <div key={x}><Check className="size-4" />{x}</div>
            ))}
          </div>
        </div>
        <RouterVisual />
      </div>
    </section>
  );
}

function ApiControl() {
  return (
    <section className="section-block">
      <div className="page-shell split-layout control-section">
        <div className="api-key-card">
          <div className="api-key-card-head"><span>کلید پروژه</span><span className="status-chip"><span /> فعال</span></div>
          <div className="api-key-box" dir="ltr">bv_live_••••••••••••••••</div>
          <div className="api-key-meta"><span>سقف ماهانه</span><strong>۵٬۰۰۰٬۰۰۰ تومان</strong></div>
          <div className="api-key-meta"><span>آخرین استفاده</span><strong>چند لحظه پیش</strong></div>
        </div>
        <div className="section-heading">
          <span className="section-kicker">کنترل دست خودت</span>
          <h2>برای هر پروژه کلید جدا، سقف جدا و گزارش جدا داشته باش.</h2>
          <p>برای تیم، محصول یا مشتری‌های مختلف، مصرف را از هم تفکیک کن. بدون اینکه مدیریت هزینه تبدیل به یک دردسر جداگانه شود.</p>
          <div className="inline-badge"><ShieldCheck className="size-4" /> کلیدها به‌صورت امن نگهداری می‌شوند</div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "شروع", price: fa.format(freeCredit) + " تومان هدیه", desc: "برای تست واقعی Bavaan بدون خرید اولیه.", points: ["بدون اشتراک ماهانه", "Workspace شخصی", "مصرف قابل مشاهده"] },
    { name: "PAYG", price: "به اندازه مصرف", desc: "کیف پول را شارژ کن و فقط هزینه استفاده واقعی را بده.", points: ["یک کیف پول", "چند مدل در یک حساب", "API یکپارچه"], featured: true },
    { name: "مصرف بالا", price: "قیمت حجمی", desc: "برای تیم‌ها و محصولاتی که مصرف پیوسته و بالاتر دارند.", points: ["گزارش مالی", "کنترل بودجه", "شرایط حجمی"] }
  ];
  return (
    <section id="pricing" className="section-block pricing-section">
      <div className="page-shell">
        <div className="section-heading center-heading">
          <span className="section-kicker">قیمت‌گذاری ساده</span>
          <h2>هزینه‌ای که قبل از مصرف می‌فهمی.</h2>
          <p>بدون پلن‌های گیج‌کننده. موجودی شارژ می‌شود و هزینه از مصرف واقعی کم می‌شود.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p) => (
            <article key={p.name} className={cn("price-card", p.featured && "featured-price")}>
              <div className="price-card-top">
                <h3>{p.name}</h3>
                {p.featured && <span>پیشنهادی</span>}
              </div>
              <strong className="price-value">{p.price}</strong>
              <p>{p.desc}</p>
              <div className="price-divider" />
              <ul>{p.points.map(x => <li key={x}><Check className="size-4" />{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-section">
      <div className="page-shell">
        <div className="final-card">
          <div className="final-grid" />
          <div className="final-content">
            <div className="cta-icon"><Zap className="size-5" /></div>
            <h2>از کاری که می‌خواهی انجام بدهی شروع کن.</h2>
            <p>حساب بساز، اعتبار هدیه بگیر و هر وقت خواستی API Key خودت را بساز.</p>
            <div className="cta-actions">
              <PrimaryButton href={boot.authenticated ? "/dashboard" : "/register"}>{boot.authenticated ? "رفتن به داشبورد" : "شروع رایگان"}</PrimaryButton>
              <a href="/docs" className="secondary-button">مستندات API</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaasLanding() {
  return (
    <div className="site-root">
      <header className="site-header">
        <div className="page-shell header-inner">
          <a href="/" className="brand" aria-label="صفحه اصلی Bavaan AI">
            <span className="brand-mark">B</span>
            <strong>Bavaan AI</strong>
          </a>
          <nav aria-label="منوی اصلی">
            <a href="#features">امکانات</a>
            <a href="#integrations">اتصال‌ها</a>
            <a href="#pricing">قیمت‌گذاری</a>
            <a href="/docs">مستندات</a>
          </nav>
          <div className="header-actions">
            {!boot.authenticated && <a href="/login" className="login-link">ورود</a>}
            <a href={boot.authenticated ? "/dashboard" : "/register"} className="header-button">{boot.authenticated ? "داشبورد" : "شروع رایگان"}</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="page-shell hero-layout">
            <div className="hero-copy">
              <div className="hero-pills">
                <span><Sparkles className="size-3.5" /> چند مدل، یک حساب</span>
                <span><Wallet className="size-3.5" /> پرداخت ریالی</span>
              </div>
              <h1>همه‌ی مدل‌های هوش مصنوعی، <span>با یک حساب و یک API.</span></h1>
              <p>به مدل‌های مختلف AI دسترسی بگیر، مصرف را دقیق ببین و بدون ساختن چند حساب جدا، همه‌چیز را از یک جا مدیریت کن.</p>
              <div className="hero-actions">
                <PrimaryButton href={boot.authenticated ? "/dashboard" : "/register"}>
                  {boot.authenticated ? "باز کردن داشبورد" : "شروع با " + fa.format(freeCredit) + " تومان هدیه"}
                </PrimaryButton>
                <a href="/docs" className="secondary-button"><Terminal className="size-4" /> دیدن مستندات</a>
              </div>
              <div className="hero-trust">
                <span><CheckCircle2 className="size-4" /> بدون اشتراک اجباری</span>
                <span><CheckCircle2 className="size-4" /> پرداخت به اندازه مصرف</span>
                <span><CheckCircle2 className="size-4" /> مناسب API و Workspace</span>
              </div>
            </div>
            <HeroNetwork />
          </div>
        </section>

        <CapabilityRail />
        <DashboardBento />
        <Integrations />
        <ApiControl />
        <Pricing />
        <FinalCta />
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div className="footer-brand"><span className="brand-mark small">B</span><span>Bavaan AI · ai.bavaan.ir</span></div>
          <div><a href="/docs">مستندات</a><a href="/pricing">قیمت‌گذاری</a><a href="/models">مدل‌ها</a></div>
        </div>
      </footer>
    </div>
  );
}

const rootNode = document.getElementById("saas-landing-root");
if (rootNode) createRoot(rootNode).render(<SaasLanding />);

export default SaasLanding;
