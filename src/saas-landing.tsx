import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowRight, Bot, Braces, Check, CheckCircle2, Code2, Cpu,
  Database, FileText, Gauge, Globe2, Image, Layers3, LockKeyhole,
  MessageSquare, ShieldCheck, Sparkles, Terminal, Video, Wallet, Webhook, Zap
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
  return <span className="grid size-10 place-items-center rounded-2xl border border-border bg-secondary text-foreground">{children}</span>;
}

function PulseButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="pulse-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground transition duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring sm:w-auto">
      {children}
      <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
    </a>
  );
}

function BorderBeamTerminal() {
  return (
    <div className="beam-frame shadow-soft">
      <div className="terminal-grid p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-muted-foreground/35" />
            <span className="size-2.5 rounded-full bg-muted-foreground/35" />
            <span className="size-2.5 rounded-full bg-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Bavaan API</span>
        </div>
        <div dir="ltr" className="min-w-0 space-y-3 overflow-hidden font-mono text-[11px] leading-6 sm:text-sm sm:leading-7 [&_p]:break-all">
          <p className="text-muted-foreground">$ curl https://ai.bavaan.ir/api/v1/chat/completions</p>
          <p><span className="text-muted-foreground">Authorization:</span> Bearer bv_••••••••</p>
          <p><span className="text-muted-foreground">model:</span> "gemini"</p>
          <p><span className="text-muted-foreground">message:</span> "یک توضیح کوتاه بنویس"</p>
          <div className="my-4 h-px bg-border" />
          <p className="flex items-center gap-2 text-primary"><CheckCircle2 aria-hidden="true" className="size-4" /> request.completed</p>
          <p><span className="text-muted-foreground">route:</span> "best-available"</p>
          <p><span className="text-muted-foreground">billing:</span> "pay-as-you-go"</p>
        </div>
      </div>
    </div>
  );
}

function SpotlightCard({ className, children }: { className?: string; children: ReactNode }) {
  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", (e.clientX - r.left) + "px");
    e.currentTarget.style.setProperty("--spot-y", (e.clientY - r.top) + "px");
  }
  return (
    <div tabIndex={0} onPointerMove={move} className={cn("spotlight-card rounded-3xl p-5 transition duration-200 focus-visible:ring-2 focus-visible:ring-ring sm:p-6", className)}>
      <div className="relative z-10">{children}</div>
    </div>
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
    const duration = 260;
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

function CustomerMarquee() {
  const items = ["توسعه‌دهنده‌ها", "آژانس‌های اتوماسیون", "فروشگاه‌های آنلاین", "استارتاپ‌های AI", "تیم‌های محتوا", "سازندگان ربات"];
  return (
    <section aria-label="گروه‌های کاربری" className="border-y border-border bg-card/40 py-5">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track gap-4 ps-4">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex min-w-48 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm text-muted-foreground">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <div className="mb-10 max-w-3xl">
        <span className="mb-3 inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">همه‌چیز زیر یک حساب</span>
        <h2 className="text-3xl font-black leading-tight sm:text-5xl">فروش توکن، بدون اینکه تجربه کاربر شبیه یک پنل خام API باشد.</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">کاربر فنی کنترل کامل دارد؛ کاربر غیر فنی فقط کاری را که می‌خواهد انجام دهد انتخاب می‌کند. کیف پول و صورتحساب هر دو تجربه یکی است.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <SpotlightCard className="md:col-span-4">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm text-muted-foreground">صورتحساب لحظه‌ای</p><h3 className="mt-1 text-xl font-bold">هزینه هر درخواست، قابل توضیح</h3></div>
            <IconWrap><FileText aria-hidden="true" className="size-5" /></IconWrap>
          </div>
          <div className="mt-7 overflow-hidden rounded-2xl border border-border">
            {[
              ["مدل", "Gemini"],
              ["مصرف ورودی", "۱۲٬۴۸۰ توکن"],
              ["مصرف خروجی", "۲٬۱۶۰ توکن"],
              ["هزینه نهایی", "۳٬۸۴۰ تومان"]
            ].map(([a,b]) => <div key={a} className="flex flex-col gap-1 border-b border-border px-4 py-3 text-sm last:border-b-0 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"><span className="text-muted-foreground">{a}</span><strong>{b}</strong></div>)}
          </div>
        </SpotlightCard>

        <SpotlightCard className="md:col-span-2">
          <IconWrap><Wallet aria-hidden="true" className="size-5" /></IconWrap>
          <p className="mt-8 text-sm text-muted-foreground">نمونه نمای مالی</p>
          <p className="mt-2 text-2xl font-black"><Odometer target={2480000} /></p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">درآمد، COGS و حاشیه سود در Admin کنار هم دیده می‌شوند.</p>
        </SpotlightCard>

        <SpotlightCard className="md:col-span-2">
          <IconWrap><Gauge aria-hidden="true" className="size-5" /></IconWrap>
          <h3 className="mt-6 font-bold">کنترل بودجه</h3>
          <p className="mt-2 text-sm text-muted-foreground">برای هر API Key سقف مصرف تعیین کن.</p>
          <div className="progress-rail mt-6 h-2 overflow-hidden rounded-full"><div className="progress-fill h-full w-[64%] rounded-full" /></div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>مصرف شده</span><span>۶۴٪</span></div>
        </SpotlightCard>

        <SpotlightCard className="md:col-span-2">
          <IconWrap><Webhook aria-hidden="true" className="size-5" /></IconWrap>
          <h3 className="mt-6 font-bold">لاگ قابل پیگیری</h3>
          <div dir="ltr" className="mt-4 space-y-2 rounded-2xl border border-border bg-background p-4 font-mono text-[11px]">
            <p className="text-primary">request.completed</p>
            <p className="text-muted-foreground">req_bv_8f••••</p>
            <p className="text-muted-foreground">latency: tracked</p>
            <p className="text-muted-foreground">billing: recorded</p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="md:col-span-2">
          <IconWrap><ShieldCheck aria-hidden="true" className="size-5" /></IconWrap>
          <h3 className="mt-6 font-bold">کنترل‌های ضروری از روز اول</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {["HTTPS", "کلید هش‌شده", "Spend Limit", "Request ID", "Session امن"].map(x => <span key={x} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">{x}</span>)}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section id="integrations" className="section-glow border-y border-border py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">Provider Router</span>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">یک API در جلو، چند مسیر در پشت.</h2>
          <p className="mt-5 text-lg leading-9 text-muted-foreground">مسیر مناسب بر اساس مدل، هزینه و در دسترس بودن انتخاب می‌شود. کاربر لازم نیست برای هر Provider حساب جدا داشته باشد.</p>
          <div className="mt-7 space-y-3 text-sm">
            {["Fallback بدون تغییر کد کاربر", "قابل توسعه به Provider مستقیم", "متمرکز شدن گزارش هزینه در یک Wallet"].map(x => <p key={x} className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-primary" />{x}</p>)}
          </div>
        </div>
        <div className="integration-stage" role="img" aria-label="اتصال چند Provider هوش مصنوعی به هاب Bavaan">
          <div className="beam beam-a" /><div className="beam beam-b" /><div className="beam beam-c" /><div className="beam beam-d" /><div className="beam beam-e" />
          <div className="integration-node node-a"><span>OpenAI</span></div>
          <div className="integration-node node-b"><span>Anthropic</span></div>
          <div className="integration-node node-c"><span>Google AI</span></div>
          <div className="integration-node node-d"><span>Workers AI</span></div>
          <div className="integration-node node-e"><span>Cloudflare</span></div>
          <div className="integration-hub"><div className="text-center"><Layers3 aria-hidden="true" className="mx-auto mb-2 size-7 text-primary" /><strong>Bavaan</strong></div></div>
        </div>
      </div>
    </section>
  );
}

function ExperienceStack() {
  const cards = [
    {icon:<Code2 className="size-5" />, title:"«می‌خوام API رو به اپ یا سایتم وصل کنم»", body:"داشبورد روی API Key، مدل‌ها، مصرف، latency و مستندات متمرکز می‌شود."},
    {icon:<Bot className="size-5" />, title:"«برای مشتری‌هام ربات و اتوماسیون می‌سازم»", body:"Workspace روی پروژه‌ها، کلیدهای جدا و کنترل هزینه هر مشتری تمرکز می‌کند."},
    {icon:<Sparkles className="size-5" />, title:"«فقط می‌خوام AI کارم رو انجام بده»", body:"اسم مدل از جلوی کاربر کنار می‌رود و تجربه با Use Case شروع می‌شود."}
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">Workspace تطبیقی</span>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">سگمنت را از کاربر نمی‌پرسیم؛ <span className="highlight-text">نیازش را می‌پرسیم.</span></h2>
          <p className="mt-5 text-lg leading-9 text-muted-foreground">بعداً هم هر وقت خواست می‌تواند Workspace را تغییر دهد؛ مثل جابه‌جایی محیط کاری در ابزارهای حرفه‌ای.</p>
        </div>
        <div className="stack-shell" aria-label="نمونه تجربه‌های کاربری">
          {cards.map((c,i) => (
            <article key={i} className="stack-card rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">{c.icon}</div>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p className="mt-3 leading-8 text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {name:"شروع", price:fa.format(freeCredit) + " تومان هدیه", desc:"برای تست واقعی پلتفرم بدون خرید اولیه.", points:["بدون اشتراک", "Workspace شخصی", "مصرف قابل مشاهده"]},
    {name:"PAYG", price:"۰ تومان هزینه ثابت", desc:"به اندازه مصرف مدل‌ها پرداخت می‌کنی.", points:["یک کیف پول", "قیمت شفاف", "API سازگار"]},
    {name:"مصرف بالا", price:"تخفیف حجمی", desc:"همان PAYG، با قیمت بهتر برای مصرف بیشتر.", points:["بدون قفل پلن", "گزارش مالی", "مناسب تیم و محصول"]}
  ];
  return (
    <section id="pricing" className="border-y border-border bg-card/35 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">قیمت‌گذاری‌ای که <span className="highlight-text">نیاز به توضیح ندارد.</span></h2>
          <p className="mt-4 text-lg text-muted-foreground">اشتراک ماهانه اجباری نداریم. موجودی شارژ می‌شود و هزینه از مصرف واقعی کم می‌شود.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p,i) => (
            <article key={p.name} className={cn("rounded-3xl border border-border bg-background p-6 sm:p-7", i===1 && "ring-1 ring-primary")}>
              <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{p.name}</h3>{i===1 && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">مدل اصلی</span>}</div>
              <p className="mt-8 text-2xl font-black">{p.price}</p>
              <p className="mt-3 min-h-14 leading-7 text-muted-foreground">{p.desc}</p>
              <div className="my-6 h-px bg-border" />
              <ul className="space-y-3">{p.points.map(x => <li key={x} className="flex items-center gap-2 text-sm"><Check aria-hidden="true" className="size-4 text-primary" />{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid-background relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-center sm:rounded-[2rem] sm:p-12 lg:p-14">
        <div className="absolute inset-0 bg-background/55" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Zap aria-hidden="true" className="size-6" /></div>
          <h2 className="text-3xl font-black sm:text-5xl">از کاری که می‌خواهی انجام بدهی شروع کن؛ نه از اسم مدل.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-muted-foreground">حساب بساز، اعتبار هدیه بگیر و بعد اگر توسعه‌دهنده‌ای، مستقیم API Key خودت را بساز.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PulseButton href={boot.authenticated ? "/dashboard" : "/register"}>{boot.authenticated ? "رفتن به داشبورد" : "شروع رایگان"}</PulseButton>
            <a href="/docs" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-border bg-background px-5 py-3 font-bold transition duration-200 hover:bg-secondary">مستندات API</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaasLanding() {
  const uses = useMemo(() => [
    {icon:<Braces className="size-4" />, text:"API برای محصول"},
    {icon:<Webhook className="size-4" />, text:"اتوماسیون و ربات"},
    {icon:<Image className="size-4" />, text:"ساخت تصویر"},
    {icon:<Video className="size-4" />, text:"ویدئو و محتوای خلاق"},
    {icon:<MessageSquare className="size-4" />, text:"کارهای روزمره AI"}
  ], []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-header sticky top-0 z-50 border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
          <a href="/" className="flex items-center gap-2 rounded-xl focus-visible:ring-2 focus-visible:ring-ring" aria-label="صفحه اصلی Bavaan AI">
            <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary font-black text-primary-foreground">B</span><strong className="text-sm sm:text-base">Bavaan AI</strong>
          </a>
          <nav aria-label="منوی اصلی" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a className="transition duration-200 hover:text-foreground" href="#features">امکانات</a>
            <a className="transition duration-200 hover:text-foreground" href="#integrations">اتصال‌ها</a>
            <a className="transition duration-200 hover:text-foreground" href="#pricing">قیمت‌گذاری</a>
            <a className="transition duration-200 hover:text-foreground" href="/docs">مستندات</a>
          </nav>
          <div className="flex items-center gap-2">
            {!boot.authenticated && <a href="/login" className="hidden rounded-xl px-3 py-2 text-sm text-muted-foreground transition duration-200 hover:text-foreground sm:inline-flex">ورود</a>}
            <a href={boot.authenticated ? "/dashboard" : "/register"} className="inline-flex min-h-10 shrink-0 items-center rounded-xl border border-border bg-secondary px-3 text-xs font-bold transition duration-200 hover:bg-muted sm:px-4 sm:text-sm">{boot.authenticated ? "داشبورد" : "ساخت حساب"}</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-shell overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 pb-14 pt-10 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-2 lg:items-center lg:pb-28 lg:pt-24">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                {uses.slice(0,3).map((u,i)=><span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{u.icon}{u.text}</span>)}
              </div>
              <h1 className="text-reveal max-w-3xl text-[2.15rem] font-black leading-[1.35] sm:text-5xl sm:leading-[1.25] lg:text-6xl">
                یک پلتفرم AI که خودش را با <span className="gradient-text">نوع استفاده تو</span> هماهنگ می‌کند.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">همه مدل‌های اصلی، یک کیف پول ریالی و یک API. اگر فنی باشی کنترل کامل داری؛ اگر نباشی، اصلاً لازم نیست اسم مدل‌ها را بدانی.</p>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                <PulseButton href={boot.authenticated ? "/dashboard" : "/register"}>{boot.authenticated ? "باز کردن داشبورد" : "شروع با " + fa.format(freeCredit) + " تومان هدیه"}</PulseButton>
                <a href="/docs" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 font-bold transition duration-200 hover:bg-secondary sm:w-auto"><Terminal aria-hidden="true" className="size-4" />دیدن مستندات</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="size-4 text-primary" />بدون اشتراک ماهانه</span>
                <span className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="size-4 text-primary" />پرداخت به اندازه مصرف</span>
                <span className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="size-4 text-primary" />قابل استفاده با API</span>
              </div>
            </div>
            <BorderBeamTerminal />
          </div>
        </section>

        <CustomerMarquee />
        <Bento />
        <Integrations />
        <ExperienceStack />
        <Pricing />
        <FinalCta />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2"><Cpu aria-hidden="true" className="size-4" />Bavaan AI · ai.bavaan.ir</div>
          <div className="flex flex-wrap gap-5"><a href="/docs">مستندات</a><a href="/pricing">قیمت‌گذاری</a><a href="/models">مدل‌ها</a></div>
        </div>
      </footer>
    </div>
  );
}

const rootNode = document.getElementById("saas-landing-root");
if (rootNode) createRoot(rootNode).render(<SaasLanding />);

export default SaasLanding;
// Usage: import SaasLanding from "./saas-landing"; then render <SaasLanding />.
