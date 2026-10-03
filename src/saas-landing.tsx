import React, { ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

function WebGLArt({ variant }: { variant: "brain" | "router" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.15, variant === "brain" ? 8.2 : 7.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "webgl-canvas";
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0x7ea3c8, 1.25));
    const key = new THREE.PointLight(0x50f2c4, 7.5, 18);
    key.position.set(-3.2, 3.4, 5.5);
    scene.add(key);
    const fill = new THREE.PointLight(0x4fbfff, 6, 16);
    fill.position.set(3.7, 1.4, 4.4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xb56cff, 7, 16);
    rim.position.set(2.2, -3.5, 2.5);
    scene.add(rim);
    const hot = new THREE.PointLight(0xff5db4, 4.5, 13);
    hot.position.set(-3.2, -1.5, 3.3);
    scene.add(hot);

    const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];
    const track = <T extends THREE.BufferGeometry | THREE.Material>(x: T) => {
      disposables.push(x);
      return x;
    };

    if (variant === "brain") {
      const brain = new THREE.Group();
      brain.rotation.x = -0.12;
      brain.rotation.y = -0.18;
      root.add(brain);

      const leftPalette = [0x46efc2, 0x34d8e7, 0x39adff, 0x5a86ff];
      const rightPalette = [0x7d68ff, 0x9b64ff, 0xd95cc8, 0xff6aa7];
      const nodes = [
        [0.42, 1.04, 0.02, 0.68], [0.78, 0.96, 0.46, 0.70], [0.84, 0.92, -0.44, 0.67],
        [1.12, 0.56, 0.22, 0.76], [0.60, 0.56, 0.76, 0.68], [0.62, 0.52, -0.76, 0.66],
        [1.22, 0.04, 0.04, 0.80], [0.72, 0.04, 0.84, 0.72], [0.74, 0.02, -0.84, 0.70],
        [1.10, -0.56, 0.34, 0.72], [0.66, -0.58, 0.72, 0.66], [0.68, -0.62, -0.68, 0.64],
        [0.62, -1.02, 0.16, 0.61], [0.47, -1.00, -0.44, 0.58]
      ] as const;

      for (const hemi of [-1, 1]) {
        nodes.forEach((n, i) => {
          const palette = hemi < 0 ? leftPalette : rightPalette;
          const color = palette[i % palette.length];
          const mat = track(new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.24,
            metalness: 0.08,
            clearcoat: 1,
            clearcoatRoughness: 0.18,
            emissive: color,
            emissiveIntensity: 0.09
          }));
          const geo = track(new THREE.SphereGeometry(n[3], 30, 24));
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(hemi * n[0], n[1], n[2]);
          mesh.scale.set(1.08 + (i % 3) * 0.05, 0.76 + (i % 4) * 0.035, 0.95 + (i % 2) * 0.08);
          mesh.rotation.set((i % 5) * 0.14, hemi * (i % 4) * 0.10, hemi * 0.06);
          brain.add(mesh);
        });
      }

      const fissureGeo = track(new THREE.TorusGeometry(0.43, 0.055, 12, 72, Math.PI * 1.25));
      const fissureMat = track(new THREE.MeshBasicMaterial({
        color: 0xdffcff,
        transparent: true,
        opacity: 0.52
      }));
      for (let i = 0; i < 5; i++) {
        const ridge = new THREE.Mesh(fissureGeo, fissureMat);
        ridge.rotation.set(Math.PI / 2 + i * 0.08, 0, Math.PI / 2);
        ridge.scale.set(1.55 + i * 0.08, 0.9, 1);
        ridge.position.set(0, 0.72 - i * 0.44, 0.74 - (i % 2) * 1.38);
        brain.add(ridge);
      }

      const neuralCurves = [
        [[-1.3, .92, .3], [-.55, .35, 1.05], [.15, .2, .75], [.95, -.55, .6]],
        [[1.28, .65, -.2], [.6, .15, -1.0], [-.08, -.1, -.72], [-1.0, -.7, -.5]],
        [[-.85, -1.0, .42], [-.15, -.5, 1.02], [.55, .1, .72], [1.14, .7, .35]],
        [[.9, 1.05, .2], [.2, .58, -.85], [-.56, .1, -.76], [-1.2, -.35, -.22]]
      ];
      neuralCurves.forEach((pts, idx) => {
        const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
        const geo = track(new THREE.TubeGeometry(curve, 48, 0.018, 6, false));
        const mat = track(new THREE.MeshBasicMaterial({
          color: idx % 2 ? 0xf2f7ff : 0x8fffe0,
          transparent: true,
          opacity: 0.68
        }));
        brain.add(new THREE.Mesh(geo, mat));
      });

      const floorGeo = track(new THREE.TorusGeometry(2.0, 0.018, 8, 128));
      const floorMat = track(new THREE.MeshBasicMaterial({ color: 0x48e5c1, transparent: true, opacity: 0.28 }));
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = Math.PI / 2;
      floor.position.y = -1.72;
      floor.scale.set(1.28, 1, 0.72);
      root.add(floor);

      const shapeSpecs = [
        { geo: new THREE.TorusKnotGeometry(.28, .085, 72, 10), pos: [-2.55, 1.5, .3], color: 0xff6db5, speed: .62 },
        { geo: new THREE.OctahedronGeometry(.34, 0), pos: [2.55, 1.22, -.15], color: 0x43d9ff, speed: -.55 },
        { geo: new THREE.IcosahedronGeometry(.30, 0), pos: [-2.35, -1.22, .18], color: 0xffb24c, speed: .44 },
        { geo: new THREE.TorusGeometry(.31, .09, 14, 48), pos: [2.45, -1.30, .22], color: 0x8a6dff, speed: -.48 }
      ];
      shapeSpecs.forEach((spec, i) => {
        const geo = track(spec.geo);
        const mat = track(new THREE.MeshPhysicalMaterial({
          color: spec.color,
          roughness: .22,
          metalness: .18,
          clearcoat: .9,
          emissive: spec.color,
          emissiveIntensity: .08
        }));
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
        mesh.userData.spin = spec.speed;
        mesh.userData.float = i * 1.3;
        root.add(mesh);
      });

      const particleGeo = track(new THREE.BufferGeometry());
      const positions: number[] = [];
      for (let i = 0; i < 70; i++) {
        const a = i * 2.399963;
        const radius = 2.6 + ((i * 37) % 100) / 100 * 1.35;
        positions.push(Math.cos(a) * radius, Math.sin(a * 1.37) * 2.15, Math.sin(a) * radius * .42);
      }
      particleGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const particleMat = track(new THREE.PointsMaterial({
        color: 0x73f5da,
        size: .035,
        transparent: true,
        opacity: .46,
        sizeAttenuation: true
      }));
      root.add(new THREE.Points(particleGeo, particleMat));
    } else {
      const hubGeo = track(new THREE.IcosahedronGeometry(0.82, 2));
      const hubMat = track(new THREE.MeshPhysicalMaterial({
        color: 0x33d9b4,
        roughness: .18,
        metalness: .24,
        clearcoat: 1,
        emissive: 0x0e8f7a,
        emissiveIntensity: .2,
        wireframe: false
      }));
      const hub = new THREE.Mesh(hubGeo, hubMat);
      root.add(hub);

      const wireGeo = track(new THREE.IcosahedronGeometry(1.15, 1));
      const wireMat = track(new THREE.MeshBasicMaterial({
        color: 0x62efd0,
        transparent: true,
        opacity: .18,
        wireframe: true
      }));
      root.add(new THREE.Mesh(wireGeo, wireMat));

      const ringMat = track(new THREE.MeshBasicMaterial({ color: 0x6a70ff, transparent: true, opacity: .3 }));
      [1.7, 2.35].forEach((r, i) => {
        const ring = new THREE.Mesh(track(new THREE.TorusGeometry(r, .018, 8, 128)), ringMat);
        ring.rotation.x = Math.PI / 2 + i * .42;
        ring.rotation.z = i * .55;
        root.add(ring);
      });

      const palette = [0x51efc1, 0x33c6ff, 0x8b68ff, 0xff68b0, 0xffb347, 0x45d7d0];
      const outer: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        const mesh = new THREE.Mesh(
          track(new THREE.OctahedronGeometry(.30 + (i % 2) * .06, 0)),
          track(new THREE.MeshPhysicalMaterial({
            color: palette[i],
            roughness: .2,
            metalness: .18,
            clearcoat: 1,
            emissive: palette[i],
            emissiveIntensity: .08
          }))
        );
        mesh.position.set(Math.cos(a) * 2.55, Math.sin(a) * 1.65, (i % 2 ? -.35 : .35));
        mesh.userData.phase = i;
        root.add(mesh);
        outer.push(mesh);

        const points = [new THREE.Vector3(0, 0, 0), mesh.position.clone()];
        const lineGeo = track(new THREE.BufferGeometry().setFromPoints(points));
        const lineMat = track(new THREE.LineBasicMaterial({ color: palette[i], transparent: true, opacity: .42 }));
        root.add(new THREE.Line(lineGeo, lineMat));
      }
    }

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 2;
      pointerY = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 2;
    };
    mount.addEventListener("pointermove", onPointer);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      root.rotation.y += ((pointerX * .16 + Math.sin(t * .22) * .08) - root.rotation.y) * .035;
      root.rotation.x += ((-pointerY * .09 + Math.cos(t * .18) * .035) - root.rotation.x) * .03;
      root.position.y = reduceMotion ? 0 : Math.sin(t * .72) * .055;

      root.children.forEach((child) => {
        const obj = child as THREE.Object3D;
        if (typeof obj.userData.spin === "number") {
          obj.rotation.x += obj.userData.spin * .006;
          obj.rotation.y += obj.userData.spin * .009;
          obj.position.y += Math.sin(t * 1.2 + obj.userData.float) * .0008;
        }
        if (typeof obj.userData.phase === "number") {
          obj.rotation.x += .006 + obj.userData.phase * .0002;
          obj.rotation.y += .009;
        }
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mount.removeEventListener("pointermove", onPointer);
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.domElement.remove();
    };
  }, [variant]);

  return <div ref={mountRef} className={"webgl-scene webgl-" + variant} aria-hidden="true" />;
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
    <div className="hero-visual" aria-label="مغز سه‌بعدی Bavaan و اتصال به چند مدل">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="orbit orbit-c" />
      <WebGLArt variant="brain" />
      {nodes.map(([name, short, cls, tone]) => (
        <div key={name} className={cn("model-node", cls, "tone-" + tone)}>
          <span className="model-node-mark">{short}</span>
          <span>{name}</span>
        </div>
      ))}
      <div className="scene-caption"><span>B</span><strong>Bavaan Core</strong><small>Real-time 3D AI mesh</small></div>
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
      <WebGLArt variant="router" />
      <div className="router-core-label"><Layers3 className="size-5" /><strong>Bavaan</strong><small>Smart Router</small></div>
      {nodes.map((n, i) => <div key={n} className={"router-node router-node-" + (i + 1)}>{n}</div>)}
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
