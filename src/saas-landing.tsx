import React, { ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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
      const stage = new THREE.Group();
      stage.rotation.set(-0.08, -0.10, 0.02);
      root.add(stage);

      // Clean fallback while the anatomical GLB is loading.
      const fallbackGeo = track(new THREE.IcosahedronGeometry(1.28, 3));
      const fallbackMat = track(new THREE.MeshPhysicalMaterial({
        color: 0x203a5d,
        roughness: .42,
        metalness: .08,
        transparent: true,
        opacity: .28,
        wireframe: true,
        emissive: 0x2bd6c0,
        emissiveIntensity: .15
      }));
      const fallback = new THREE.Mesh(fallbackGeo, fallbackMat);
      fallback.scale.set(1.25, .9, 1);
      stage.add(fallback);

      const haloMat = track(new THREE.MeshBasicMaterial({
        color: 0x53e8cb,
        transparent: true,
        opacity: .24
      }));
      const halo = new THREE.Mesh(track(new THREE.TorusGeometry(2.05, .018, 8, 128)), haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = -1.70;
      halo.scale.set(1.25, 1, .72);
      root.add(halo);

      // Real anatomical brain: Z-Anatomy / BodyParts3D, CC BY-SA 4.0.
      const draco = new DRACOLoader();
      draco.setDecoderPath("https://cdn.jsdelivr.net/gh/itayinbarr/brainproject@2929e94f521a8ddceab26bc100a98dc06b0da060/brain-atlas/vendor/draco/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);

      let cancelled = false;
      loader.load(
        "https://cdn.jsdelivr.net/gh/itayinbarr/brainproject@2929e94f521a8ddceab26bc100a98dc06b0da060/brain-atlas/models/brain.glb",
        (gltf) => {
          if (cancelled) return;

          const specimen = gltf.scene;
          const allMeshes: THREE.Mesh[] = [];
          const hiddenCats = new Set(["arteries", "veins_sinuses", "cranial_nerves", "meninges_dura", "tracts"]);
          const palette: Record<string, number> = {
            cortex: 0x48d9c7,
            white_matter: 0x8fc8ff,
            deep_grey: 0x8a6dff,
            diencephalon: 0xb36df4,
            brainstem: 0x55dfb4,
            cerebellum: 0x4ea9ff,
            ventricles: 0xdf6fc8,
            other: 0x62d8d1
          };

          specimen.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;
            const ex = (mesh.userData || {}) as Record<string, any>;
            const cat = String(ex.bx_cat || mesh.parent?.userData?.bx_cat || "other");
            const side = String(ex.bx_side || mesh.parent?.userData?.bx_side || "median");
            mesh.visible = !hiddenCats.has(cat);
            if (!mesh.visible) return;

            const base = new THREE.Color(palette[cat] || palette.other);
            if (side === "right") base.offsetHSL(.075, .05, .02);
            if (side === "left") base.offsetHSL(-.025, .04, 0);

            const mat = track(new THREE.MeshPhysicalMaterial({
              color: base,
              roughness: cat === "cortex" ? .50 : .40,
              metalness: .03,
              clearcoat: .72,
              clearcoatRoughness: .36,
              emissive: base.clone().multiplyScalar(.11),
              emissiveIntensity: .24,
              transparent: true,
              opacity: cat === "ventricles" ? .72 : .96,
              side: THREE.FrontSide
            }));
            mesh.material = mat;
            allMeshes.push(mesh);
          });

          const core = new THREE.Box3();
          let hasCore = false;
          allMeshes.forEach((mesh) => {
            const ex = (mesh.userData || {}) as Record<string, any>;
            const pex = (mesh.parent?.userData || {}) as Record<string, any>;
            if (ex.bx_core === 1 || ex.bx_core === true || pex.bx_core === 1 || pex.bx_core === true) {
              core.expandByObject(mesh);
              hasCore = true;
            }
          });
          if (!hasCore) core.setFromObject(specimen);

          const center = core.getCenter(new THREE.Vector3());
          specimen.position.sub(center);
          const radius = core.getBoundingSphere(new THREE.Sphere()).radius || 1;
          specimen.scale.setScalar(2.05 / radius);
          specimen.rotation.set(-0.03, Math.PI, -0.02);
          specimen.position.y = .02;

          stage.remove(fallback);
          stage.add(specimen);
          stage.userData.specimen = specimen;
        },
        undefined,
        () => {
          // Keep the subtle hologram fallback if the CDN is unavailable.
        }
      );

      const accents = [
        { geo: new THREE.TorusKnotGeometry(.18, .055, 64, 10), pos: [-2.45, 1.28, -.2], color: 0xff70ba, spin: .42 },
        { geo: new THREE.OctahedronGeometry(.24, 0), pos: [2.38, 1.05, -.1], color: 0x43cfff, spin: -.48 },
        { geo: new THREE.IcosahedronGeometry(.20, 0), pos: [-2.24, -1.05, .1], color: 0xffb24c, spin: .36 },
        { geo: new THREE.TorusGeometry(.22, .06, 12, 42), pos: [2.20, -1.08, .05], color: 0x8a70ff, spin: -.34 }
      ];
      accents.forEach((spec, i) => {
        const mesh = new THREE.Mesh(
          track(spec.geo),
          track(new THREE.MeshPhysicalMaterial({
            color: spec.color,
            roughness: .28,
            metalness: .10,
            clearcoat: .85,
            emissive: spec.color,
            emissiveIntensity: .08
          }))
        );
        mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
        mesh.userData.spin = spec.spin;
        mesh.userData.float = i * 1.6;
        root.add(mesh);
      });

      const dotsGeo = track(new THREE.BufferGeometry());
      const dots: number[] = [];
      for (let i = 0; i < 54; i++) {
        const a = i * 2.399963;
        const rr = 2.5 + ((i * 29) % 100) / 100 * 1.25;
        dots.push(Math.cos(a) * rr, Math.sin(a * 1.21) * 1.85, Math.sin(a) * rr * .30);
      }
      dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(dots, 3));
      root.add(new THREE.Points(
        dotsGeo,
        track(new THREE.PointsMaterial({ color: 0x76efdc, size: .026, transparent: true, opacity: .34 }))
      ));

      root.userData.cleanupBrain = () => {
        cancelled = true;
        draco.dispose();
      };
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
      if (typeof root.userData.cleanupBrain === "function") root.userData.cleanupBrain();
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
    ["DeepSeek", "ds", "node-4", "pink"]
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
      <div className="scene-caption"><span>B</span><strong>Bavaan Core</strong><small>Multi-model intelligence</small></div>
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
