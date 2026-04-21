import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── RESPONSIVE HOOK ────────────────────────────────────────────────────────────
const useIsMobile = (bp = 768) => {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth <= bp : false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return m;
};

// ─── COLOR SYSTEM ──────────────────────────────────────────────────────────────
const C = {
  pink: "#EFB0C9",
  pinkMid: "#F4C2D7",
  pinkLight: "#F8DAE9",
  blue: "#A1C9F1",
  blueLight: "#B9D6F3",
  cream: "#F1E8D9",
  deep: "#8B3A6B",    // feature bands / footer
  deepText: "#5C1F46",
  accent: "#D4639A",    // CTAs
  accentDark: "#B04882",
  white: "#ffffff",
  textDark: "rgba(0,0,0,0.85)",
  textMid: "rgba(0,0,0,0.55)",
  textLight: "rgba(255,255,255,0.90)",
  textLightSoft: "rgba(255,255,255,0.65)",
  cardShadow: "0 2px 16px rgba(143,58,107,0.10), 0 1px 4px rgba(143,58,107,0.08)",
  cardShadowHover: "0 8px 32px rgba(143,58,107,0.18), 0 2px 8px rgba(143,58,107,0.12)",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// ── Danh mục có thể thêm mới từ Admin ──
const DEFAULT_CATEGORIES = [
  { id: "mini", slug: "banh-mini", title: "Bánh Sinh Nhật Mini", icon: "🎂", count: 6 },
  { id: "fruits", slug: "banh-hoa-qua", title: "Bánh Hoa Quả", icon: "🍓", count: 6 },
  { id: "saltedyolk", slug: "bong-lan-trung-muoi", title: "Bông Lan Trứng Muối", icon: "🥚", count: 6 },
  { id: "gift", slug: "set-qua", title: "Set Bánh Làm Quà", icon: "🎁", count: 6 },
  { id: "signature", slug: "dac-biet", title: "Signature Cakes", icon: "✨", count: 6 },
  { id: "kids", slug: "cho-be", title: "Bánh Sinh Nhật Cho Bé", icon: "🧒", count: 6 },
  { id: "event", slug: "su-kien", title: "Bánh Kem Sự Kiện", icon: "🎉", count: 6 },
  { id: "holiday", slug: "ngay-le", title: "Bánh Kem Ngày Lễ", icon: "🌸", count: 6 },
];
// Alias (dùng ở toàn bộ code static như ORDERS, REVIEWS…)
const CATEGORIES = DEFAULT_CATEGORIES;

// ── Ảnh được kiểm tra & khớp đúng với tên sản phẩm (verified from Unsplash) ──
const CAKE_IMAGES = [
  // 0: Bánh Kem Dâu Tây Mini – bánh kem phủ dâu tây tươi ✓
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  // 1: Bánh Sinh Nhật Hoa Hồng – bánh hồng trang trí hoa ✓
  "https://images.unsplash.com/photo-1597520595747-23260411dc4e?w=600&q=80",
  // 2: Bánh Mousse Xoài – mousse vàng cam xoài ✓
  "https://images.unsplash.com/photo-1688458297155-228a3b1e5b49?w=600&q=80",
  // 3: Bánh Bông Lan Trứng Muối – bông lan vàng ươm ✓
  "https://images.unsplash.com/photo-1675227977042-a572dac762be?w=600&q=80",
  // 4: Set Quà Tặng – hộp macaron quà tặng sang trọng ✓
  "https://images.unsplash.com/photo-1572928899385-6dc3b05531ce?w=600&q=80",
  // 5: Signature Velvet Hồng – bánh hồng pastel đặc trưng ✓
  "https://images.unsplash.com/photo-1677840147140-252adb9ca347?w=600&q=80",
  // 6: Bánh Sinh Nhật Unicorn – bánh nhiều màu sắc cho bé ✓
  "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80",
  // 7: Bánh Tầng Sự Kiện – bánh kem nhiều tầng sang trọng ✓
  "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80",
  // 8: Bánh Tết Hoa Mai – bánh trang trí hoa tươi ngày lễ ✓
  "https://images.unsplash.com/photo-1615789798939-a7c624e1e48b?w=600&q=80",
  // 9: Bánh Matcha Hoa Quả – bánh matcha xanh trà Nhật ✓
  "https://images.unsplash.com/photo-1759324351433-c5a1063f8ac6?w=600&q=80",
  // 10: Set Bánh Mini Combo 4 – cupcake mini nhiều màu ✓
  "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&q=80",
  // 11: Bánh Kem Choco – bánh socola drip đậm đà ✓
  "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80",
];

const PRODUCTS = [
  { id: "p1", name: "Bánh Kem Dâu Tây Mini", price: "280.000", tags: ["Hot", "Bestseller"], category: "mini", rating: 4.9, sold: 234, img: CAKE_IMAGES[0], inStock: true },
  { id: "p2", name: "Bánh Sinh Nhật Hoa Hồng", price: "350.000", tags: ["Bestseller"], category: "mini", rating: 4.8, sold: 189, img: CAKE_IMAGES[1], inStock: true },
  { id: "p3", name: "Bánh Mousse Xoài", price: "320.000", tags: ["New"], category: "fruits", rating: 4.7, sold: 156, img: CAKE_IMAGES[2], inStock: true },
  { id: "p4", name: "Bánh Bông Lan Trứng Muối", price: "290.000", tags: ["Hot"], category: "saltedyolk", rating: 4.9, sold: 312, img: CAKE_IMAGES[3], inStock: true },
  { id: "p5", name: "Set Quà Tặng", price: "650.000", tags: ["Đặc biệt"], category: "gift", rating: 5.0, sold: 88, img: CAKE_IMAGES[4], inStock: true },
  { id: "p6", name: "Signature Velvet Hồng", price: "480.000", tags: ["Bestseller", "Hot"], category: "signature", rating: 4.9, sold: 201, img: CAKE_IMAGES[5], inStock: true },
  { id: "p7", name: "Bánh Sinh Nhật Unicorn", price: "360.000", tags: ["Cho bé", "Hot"], category: "kids", rating: 4.8, sold: 143, img: CAKE_IMAGES[6], inStock: true },
  { id: "p8", name: "Bánh Tầng Sự Kiện", price: "1.200.000", tags: ["Sự kiện"], category: "event", rating: 4.7, sold: 54, img: CAKE_IMAGES[7], inStock: false },
  { id: "p9", name: "Bánh Tết Hoa Mai", price: "420.000", tags: ["Ngày lễ"], category: "holiday", rating: 4.8, sold: 168, img: CAKE_IMAGES[8], inStock: true },
  { id: "p10", name: "Bánh Matcha Hoa Quả", price: "340.000", tags: ["New", "Bestseller"], category: "fruits", rating: 4.6, sold: 127, img: CAKE_IMAGES[9], inStock: true },
  { id: "p11", name: "Set Bánh Mini Combo 4", price: "390.000", tags: ["Hot"], category: "mini", rating: 4.7, sold: 178, img: CAKE_IMAGES[10], inStock: true },
  { id: "p12", name: "Bánh Kem Choco", price: "450.000", tags: ["Bestseller"], category: "signature", rating: 4.9, sold: 221, img: CAKE_IMAGES[11], inStock: true },
];

const REVIEWS = [
  { id: 1, name: "Nguyễn Lan Anh", avatar: "https://i.pravatar.cc/48?img=47", rating: 5, comment: "Bánh ngon tuyệt vời, kem rất mịn và thơm. Shop giao hàng đúng giờ, sẽ quay lại lần sau!", product: "Bánh Kem Dâu Tây Mini", date: "15/04/2026" },
  { id: 2, name: "Trần Minh Khoa", avatar: "https://i.pravatar.cc/48?img=32", rating: 5, comment: "Đặt bánh sinh nhật cho vợ, cô ấy rất thích. Trang trí đẹp lắm, đúng như ảnh!", product: "Signature Velvet Hồng", date: "12/04/2026" },
  { id: 3, name: "Phạm Thu Hương", avatar: "https://i.pravatar.cc/48?img=44", rating: 4, comment: "Bánh bông lan trứng muối ngon, đúng vị. Giao hàng hơi chậm nhưng chất lượng ổn!", product: "Bông Lan Trứng Muối", date: "10/04/2026" },
  { id: 4, name: "Lê Văn Hùng", avatar: "https://i.pravatar.cc/48?img=15", rating: 5, comment: "Set quà tặng premium đóng gói rất đẹp, tặng sếp ai cũng khen. Sẽ order thêm!", product: "Set Quà Tặng Premium", date: "08/04/2026" },
];

const ORDERS = [
  { id: "#ORD2026001", customer: "Nguyễn Lan Anh", items: "Bánh Kem Dâu Tây Mini (16cm)", total: "280.000", status: "pending", date: "21/04/2026", phone: "0912 345 678", address: "123 Lý Thường Kiệt, HN" },
  { id: "#ORD2026002", customer: "Trần Minh Khoa", items: "Signature Velvet Hồng (18cm)", total: "480.000", status: "confirmed", date: "21/04/2026", phone: "0987 654 321", address: "45 Trần Duy Hưng, HN" },
  { id: "#ORD2026003", customer: "Phạm Thu Hương", items: "Bông Lan Trứng Muối x2", total: "580.000", status: "delivering", date: "20/04/2026", phone: "0934 111 222", address: "78 Nguyễn Huệ, HN" },
  { id: "#ORD2026004", customer: "Lê Văn Hùng", items: "Set Quà Tặng Premium", total: "650.000", status: "done", date: "20/04/2026", phone: "0965 888 777", address: "22 Hoàng Diệu, HN" },
  { id: "#ORD2026005", customer: "Vũ Thị Mai", items: "Bánh Unicorn Cho Bé (18cm)", total: "360.000", status: "pending", date: "21/04/2026", phone: "0911 222 333", address: "55 Đội Cấn, HN" },
  { id: "#ORD2026006", customer: "Hoàng Nam Sơn", items: "Bánh Matcha Hoa Quả (18cm)", total: "340.000", status: "cancelled", date: "19/04/2026", phone: "0944 555 666", address: "10 Cầu Giấy, HN" },
];

const REVENUE_DATA = [
  { month: "T1", revenue: 28, orders: 45 }, { month: "T2", revenue: 32, orders: 52 },
  { month: "T3", revenue: 45, orders: 78 }, { month: "T4", revenue: 38, orders: 61 },
  { month: "T5", revenue: 55, orders: 89 }, { month: "T6", revenue: 62, orders: 103 },
  { month: "T7", revenue: 58, orders: 94 }, { month: "T8", revenue: 71, orders: 118 },
  { month: "T9", revenue: 83, orders: 142 }, { month: "T10", revenue: 79, orders: 131 },
  { month: "T11", revenue: 95, orders: 156 }, { month: "T12", revenue: 112, orders: 189 },
];

const PIE_DATA = [
  { name: "Bánh Mini", value: 28, color: C.pink },
  { name: "Signature", value: 22, color: C.accent },
  { name: "Hoa Quả", value: 18, color: C.blue },
  { name: "Trứng Muối", value: 15, color: C.pinkMid },
  { name: "Khác", value: 17, color: C.blueLight },
];

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const Tag = ({ label }) => {
  const colors = {
    "Hot": { bg: "#FFE0E8", color: "#D4394A" },
    "Bestseller": { bg: "#E8F4FF", color: "#1A6FC4" },
    "New": { bg: "#E8FFE8", color: "#1A8A2A" },
    "Cho bé": { bg: "#FFF0E8", color: "#D47A1A" },
    "Đặc biệt": { bg: C.pinkLight, color: C.deep },
    "Sự kiện": { bg: "#F0E8FF", color: "#6B3AD4" },
    "Ngày lễ": { bg: C.pinkLight, color: C.accent },
  };
  const s = colors[label] || { bg: C.pinkLight, color: C.deep };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px", letterSpacing: "0.03em" }}>
      {label}
    </span>
  );
};

const StarRating = ({ rating, size = 14 }) => {
  return (
    <span style={{ fontSize: size, color: "#F5A623" }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ fontSize: size - 2, color: C.textMid, marginLeft: 4, fontWeight: 600 }}>{rating}</span>
    </span>
  );
};

const PillBtn = ({ children, onClick, variant = "primary", small = false, style = {} }) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const base = {
    borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700,
    transition: "all 0.2s ease", display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: "inherit", letterSpacing: "0.01em",
    transform: active ? "scale(0.96)" : hover ? "scale(1.02)" : "scale(1)",
    padding: small ? "6px 18px" : "10px 28px",
    fontSize: small ? 13 : 15,
  };
  const styles = {
    primary: { background: hover ? C.accentDark : C.accent, color: C.white, boxShadow: hover ? "0 4px 16px rgba(180,72,130,0.35)" : "0 2px 8px rgba(180,72,130,0.2)" },
    secondary: { background: "transparent", color: C.accent, border: `2px solid ${C.accent}`, boxShadow: "none" },
    white: { background: C.white, color: C.deep, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" },
    ghost: { background: "rgba(255,255,255,0.15)", color: C.white, border: `1px solid rgba(255,255,255,0.4)` },
    danger: { background: hover ? "#c0392b" : "#e74c3c", color: C.white },
    success: { background: hover ? "#1a7a2a" : "#27ae60", color: C.white },
  };
  return (
    <button style={{ ...base, ...styles[variant], ...style }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
      onClick={onClick}>
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, onClick, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: C.white, borderRadius: 16,
      boxShadow: (hover && hov) ? C.cardShadowHover : C.cardShadow,
      transition: "all 0.25s ease", cursor: onClick ? "pointer" : "default",
      transform: (hover && hov && onClick) ? "translateY(-3px)" : "none", ...style
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}>
      {children}
    </div>
  );
};

const SectionTitle = ({ title, subtitle, center = false, light = false }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: isMobile ? 20 : 32 }}>
      <h2 style={{ fontSize: isMobile ? 22 : 32, fontWeight: 800, color: light ? C.white : C.deep, margin: "0 0 8px", lineHeight: 1.2, fontFamily: "'Pacifico', cursive" }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: isMobile ? 13 : 15, color: light ? C.textLightSoft : C.textMid, margin: 0 }}>{subtitle}</p>}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: { label: "Chờ xác nhận", bg: "#FFF3CD", color: "#856404" },
    confirmed: { label: "Đã xác nhận", bg: "#D1ECF1", color: "#0C5460" },
    delivering: { label: "Đang giao", bg: "#D4EDDA", color: "#155724" },
    done: { label: "Hoàn thành", bg: "#E8F4E8", color: "#1E7B1E" },
    cancelled: { label: "Đã hủy", bg: "#F8D7DA", color: "#721C24" },
  };
  const s = map[status] || map.pending;
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{s.label}</span>;
};

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, cartCount, user, setUser, setShowLogin, setShowCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);
  const navItems = [
    { id: "home", label: "Trang Chủ" },
    { id: "menu", label: "Thực Đơn" },
    { id: "about", label: "Về Chúng Tôi" },
    { id: "guide", label: "Hướng Dẫn" },
    { id: "contact", label: "Liên Hệ" },
    ...(user && user.role !== "admin" ? [{ id: "orders", label: "📦 Đơn hàng" }] : []),
  ];
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || isMobile ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled || isMobile ? "blur(12px)" : "none",
        boxShadow: scrolled || isMobile ? "0 2px 20px rgba(143,58,107,0.10)" : "none",
        transition: "all 0.3s ease",
        padding: isMobile ? "10px 16px" : (scrolled ? "12px 40px" : "20px 40px"),
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setPage("home")}>
          <div style={{ width: isMobile ? 34 : 40, height: isMobile ? 34 : 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pink}, ${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 16 : 20 }}>🎂</div>
          <div>
            <div style={{ fontFamily: "'Pacifico', cursive", fontWeight: 800, fontSize: isMobile ? 16 : 20, color: C.deep, lineHeight: 1 }}>Tiệm Bánh</div>
            <div style={{ fontSize: isMobile ? 9 : 11, color: C.accent, fontWeight: 600, letterSpacing: "0.15em" }}>SWEET MOMENTS</div>
          </div>
        </div>
        {/* Desktop Nav Items */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                border: "none", cursor: "pointer", padding: "8px 14px",
                borderRadius: 50, color: page === item.id ? C.accent : (scrolled ? C.textDark : "rgba(80,30,60,0.85)"),
                fontWeight: page === item.id ? 700 : 500, fontSize: 14,
                background: page === item.id ? C.pinkLight : "transparent",
                transition: "all 0.2s", fontFamily: "inherit",
              }}>{item.label}</button>
            ))}
          </div>
        )}
        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
          {!isMobile && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setPage(user.role === "admin" ? "admin-dashboard" : "orders")}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>
                  {user.name.charAt(0)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.deepText }}>{user.name}</span>
              </div>
              <button onClick={() => setUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMid, fontSize: 12, padding: "4px 8px" }}>Đăng xuất</button>
            </div>
          ) : !isMobile ? (
            <PillBtn small onClick={() => setShowLogin(true)} variant="secondary">Đăng nhập</PillBtn>
          ) : null}
          {/* Cart */}
          <button onClick={() => setShowCart(true)} style={{
            position: "relative", background: C.pinkLight, border: "none", cursor: "pointer",
            width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 16 : 18, transition: "all 0.2s",
          }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4, background: C.accent, color: "white",
                borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount}</span>
            )}
          </button>
          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMobileOpen(o => !o)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              display: "flex", flexDirection: "column", gap: 4, justifyContent: "center",
            }}>
              <span style={{ width: 22, height: 2.5, background: C.deep, borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(6.5px)" : "none" }} />
              <span style={{ width: 22, height: 2.5, background: C.deep, borderRadius: 2, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ width: 22, height: 2.5, background: C.deep, borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
            </button>
          )}
        </div>
      </nav>
      {/* Mobile Dropdown */}
      {isMobile && mobileOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column", padding: "16px 20px", overflowY: "auto",
        }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }} style={{
              border: "none", cursor: "pointer", padding: "14px 16px",
              borderRadius: 12, color: page === item.id ? C.accent : C.textDark,
              fontWeight: page === item.id ? 700 : 500, fontSize: 16,
              background: page === item.id ? C.pinkLight : "transparent",
              transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
              borderBottom: `1px solid ${C.pinkLight}`,
            }}>{item.label}</button>
          ))}
          <div style={{ marginTop: 16, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {user ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>{user.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: C.deepText }}>{user.name}</span>
                </div>
                <button onClick={() => { setUser(null); setMobileOpen(false); }} style={{ background: C.pinkLight, border: "none", cursor: "pointer", color: C.accent, padding: "10px 16px", borderRadius: 50, fontWeight: 600, fontFamily: "inherit", fontSize: 14 }}>Đăng xuất</button>
              </>
            ) : (
              <PillBtn onClick={() => { setShowLogin(true); setMobileOpen(false); }} style={{ width: "100%", justifyContent: "center" }}>Đăng nhập</PillBtn>
            )}
          </div>
        </div>
      )}
    </>
  );
};


// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
const HeroSection = ({ setPage }) => {
  const [slide, setSlide] = useState(0);
  const isMobile = useIsMobile();
  const slides = [
    { bg: C.pinkLight, img: CAKE_IMAGES[5], tag: "Mới ra mắt 2026", title: "Signature\nVelvet Hồng", sub: "Hương vị đặc trưng, phủ kem velvet mịn màng — món quà hoàn hảo cho mọi khoảnh khắc", cta: "Khám phá ngay", ctaId: "p6" },
    { bg: "#EAF2FC", img: CAKE_IMAGES[0], tag: "Bestseller #1", title: "Bánh Dâu\nTây Mini", sub: "Ngọt ngào từ những múi dâu tươi chọn lọc, kết hợp lớp kem vanilla mịn như mây", cta: "Đặt bánh", ctaId: "p1" },
    { bg: C.cream, img: CAKE_IMAGES[3], tag: "Hot 🔥 Yêu thích", title: "Bông Lan\nTrứng Muối", sub: "Công thức bí truyền, lớp bông lan mềm xốp quyện cùng trứng muối đặc biệt", cta: "Xem chi tiết", ctaId: "p4" },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[slide];
  return (
    <div style={{ minHeight: isMobile ? "auto" : "100vh", background: s.bg, transition: "background 0.6s ease", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: isMobile ? 60 : 0 }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: isMobile ? 200 : 400, height: isMobile ? 200 : 400, borderRadius: "50%", background: C.pink, opacity: 0.25, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: isMobile ? 150 : 300, height: isMobile ? 150 : 300, borderRadius: "50%", background: C.blue, opacity: 0.2, filter: "blur(50px)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px 20px" : "0 40px", width: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 30 : 60 }}>
        <div style={{ flex: isMobile ? "none" : "0 0 50%", zIndex: 1, width: isMobile ? "100%" : "auto", textAlign: isMobile ? "center" : "left" }}>
          <div style={{ display: "inline-block", background: C.pinkMid, color: C.deep, borderRadius: 50, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16 }}>
            {s.tag}
          </div>
          <h1 style={{ fontFamily: "'Pacifico', cursive", fontSize: isMobile ? 36 : 64, fontWeight: 900, color: C.deep, lineHeight: 1.1, margin: "0 0 16px", whiteSpace: "pre-line" }}>
            {s.title}
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 17, color: C.textMid, lineHeight: 1.7, marginBottom: isMobile ? 24 : 36, maxWidth: isMobile ? "100%" : 440, margin: isMobile ? "0 auto 24px" : undefined }}>{s.sub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: isMobile ? "center" : "flex-start", flexWrap: "wrap" }}>
            <PillBtn onClick={() => setPage("menu")}>{s.cta}</PillBtn>
            <PillBtn variant="secondary" onClick={() => setPage("guide")}>Cách đặt bánh</PillBtn>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 24, marginTop: isMobile ? 24 : 40, justifyContent: isMobile ? "center" : "flex-start" }}>
            {[["🎂", "1000+", "Bánh đã làm"], ["⭐", "4.9/5", "Đánh giá"], ["🚀", "Nhanh", "Giao trong 2h"], ["💝", "Tin yêu", "5 năm kinh nghiệm"]].map(([icon, num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? 16 : 20 }}>{icon}</div>
                <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: C.deep }}>{num}</div>
                <div style={{ fontSize: isMobile ? 10 : 11, color: C.textMid }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ width: isMobile ? 220 : 420, height: isMobile ? 220 : 420, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${C.pinkMid}, ${C.pinkLight})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <img src={s.img} alt="cake" style={{ width: isMobile ? 200 : 380, height: isMobile ? 200 : 380, objectFit: "cover", borderRadius: "50%", boxShadow: "0 20px 60px rgba(143,58,107,0.3)" }} />
          </div>
          <div style={{ position: "absolute", bottom: isMobile ? 0 : 30, right: isMobile ? 10 : 0, background: C.white, borderRadius: 16, padding: isMobile ? "8px 12px" : "12px 18px", boxShadow: C.cardShadow }}>
            <div style={{ fontSize: isMobile ? 10 : 11, color: C.textMid, fontWeight: 600 }}>Giá từ</div>
            <div style={{ fontSize: isMobile ? 16 : 22, fontWeight: 900, color: C.accent }}>280.000đ</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: isMobile ? 16 : 30, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            width: i === slide ? 24 : 8, height: 8, borderRadius: 50, border: "none", cursor: "pointer",
            background: i === slide ? C.accent : C.pink, transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
};

const CategorySection = ({ setPage, setActiveCat }) => {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "40px 16px" : "80px 40px", background: C.white }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title="Khám Phá Danh Mục" subtitle="Đa dạng lựa chọn cho mọi dịp đặc biệt" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16 }}>
          {CATEGORIES.map(cat => (
            <Card key={cat.id} onClick={() => { setActiveCat(cat.id); setPage("menu"); }} style={{ padding: isMobile ? 16 : 24, textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: isMobile ? 32 : 44, marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, color: C.deep, marginBottom: 4, fontSize: isMobile ? 13 : 15 }}>{cat.title}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{cat.count} sản phẩm</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductGrid = ({ title, subtitle, products, addToCart, setPage, setViewProduct }) => {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "40px 16px" : "80px 40px", background: C.cream }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: isMobile ? "center" : "flex-end", justifyContent: "space-between", marginBottom: isMobile ? 20 : 32, flexWrap: "wrap", gap: 12 }}>
          <SectionTitle title={title} subtitle={subtitle} />
          <PillBtn small variant="secondary" onClick={() => setPage("menu")}>Xem tất cả →</PillBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 12 : 24 }}>
          {products.map(p => (
            <Card key={p.id} onClick={() => { setViewProduct(p); setPage("product"); }} style={{ overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tags.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.deepText }}>{p.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <StarRating rating={p.rating} />
                  <span style={{ fontSize: 12, color: C.textMid }}>Đã bán: {p.sold}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>{p.price}đ</span>
                  <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={{
                    background: C.pinkLight, border: "none", cursor: "pointer", borderRadius: 50,
                    width: 36, height: 36, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>+</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HotSection = ({ products, addToCart, setPage, setViewProduct }) => {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "40px 16px" : "80px 40px", background: C.deep }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-end", marginBottom: isMobile ? 20 : 32, flexWrap: "wrap", gap: 12 }}>
          <SectionTitle title="🔥 Hot & Bestseller" subtitle="Những sản phẩm được yêu thích nhất tháng này" light />
          <PillBtn small variant="ghost" onClick={() => setPage("menu")}>Xem thêm →</PillBtn>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 12 : 20, overflowX: "auto", paddingBottom: 8 }}>
          {products.map(p => (
            <Card key={p.id} style={{ minWidth: 220, flex: "0 0 220px", overflow: "hidden", cursor: "pointer" }} onClick={() => { setViewProduct(p); setPage("product"); }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>{p.tags.map(t => <Tag key={t} label={t} />)}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.deepText, marginBottom: 4 }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: C.accent, fontSize: 16 }}>{p.price}đ</span>
                  <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={{ background: C.accent, border: "none", cursor: "pointer", borderRadius: "50%", width: 30, height: 30, color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowToOrderSection = () => {
  const isMobile = useIsMobile();
  const steps = [
    { num: "01", icon: "📱", title: "Chọn Sản Phẩm", desc: "Duyệt qua thực đơn phong phú và chọn chiếc bánh phù hợp với dịp đặc biệt của bạn" },
    { num: "02", icon: "✏️", title: "Tuỳ Chỉnh Bánh", desc: "Chọn kích thước, hương vị, màu sắc và nội dung ghi trên bánh theo ý muốn" },
    { num: "03", icon: "💳", title: "Thanh Toán", desc: "Thanh toán an toàn qua chuyển khoản, ví điện tử hoặc tiền mặt khi nhận hàng" },
    { num: "04", icon: "🚀", title: "Nhận Bánh", desc: "Giao hàng tận nơi trong vòng 2-4 giờ hoặc nhận tại cửa hàng theo thời gian đã hẹn" },
  ];
  return (
    <section style={{ padding: isMobile ? "40px 16px" : "80px 40px", background: C.white }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title="Cách Đặt Bánh Đơn Giản" subtitle="4 bước đơn giản để có chiếc bánh hoàn hảo" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 16 : 24, marginTop: isMobile ? 20 : 40 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center", position: "relative" }}>
              {!isMobile && i < 3 && <div style={{ position: "absolute", top: 30, right: -12, width: "50%", height: 2, background: `linear-gradient(90deg, ${C.pink}, transparent)`, zIndex: 0 }} />}
              <div style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, borderRadius: "50%", background: C.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 22 : 28, margin: "0 auto 12px", position: "relative", zIndex: 1 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", marginBottom: 6 }}>BƯỚC {s.num}</div>
              <h3 style={{ fontSize: isMobile ? 14 : 17, fontWeight: 800, color: C.deep, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: isMobile ? 12 : 14, color: C.textMid, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewSection = () => {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "40px 16px" : "80px 40px", background: `linear-gradient(135deg, ${C.pinkLight} 0%, ${C.blueLight} 100%)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title="Khách Hàng Nói Gì" subtitle="Niềm tin của khách hàng là động lực lớn nhất của chúng tôi" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: isMobile ? 12 : 20 }}>
          {REVIEWS.map(r => (
            <Card key={r.id} style={{ padding: isMobile ? 16 : 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <img src={r.avatar} alt={r.name} style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.pink}` }} />
                  <div>
                    <div style={{ fontWeight: 700, color: C.deepText, fontSize: isMobile ? 13 : 14 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.textMid }}>{r.product} · {r.date}</div>
                  </div>
                </div>
                <StarRating rating={r.rating} size={14} />
              </div>
              <p style={{ margin: 0, color: C.textMid, fontSize: isMobile ? 13 : 14, lineHeight: 1.7, fontStyle: "italic" }}>"{r.comment}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ setPage }) => {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: C.deep, color: C.textLight, padding: isMobile ? "40px 20px 24px" : "60px 40px 30px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1.5fr", gap: isMobile ? 24 : 40, marginBottom: isMobile ? 24 : 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎂</div>
              <div>
                <div style={{ fontFamily: "'Pacifico', cursive", fontWeight: 800, fontSize: 20 }}>Tiệm Bánh</div>
                <div style={{ fontSize: 11, color: C.textLightSoft, letterSpacing: "0.15em" }}>SWEET MOMENTS</div>
              </div>
            </div>
            <p style={{ color: C.textLightSoft, fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>Mang đến những chiếc bánh ngọt ngào, tạo nên kỷ niệm đáng nhớ trong mỗi dịp đặc biệt của bạn.</p>
            <div style={{ display: "flex", gap: 12 }}>
              {["📘", "📷", "🎵"].map((icon, i) => <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{icon}</div>)}
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>MENU</h4>
            {["Trang Chủ", "Thực Đơn", "Về Chúng Tôi", "Liên Hệ"].map(l => (
              <div key={l} style={{ color: C.textLightSoft, fontSize: 14, marginBottom: 10, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>HỖ TRỢ</h4>
            {["Hướng dẫn đặt bánh", "Chính sách đổi trả", "Điều khoản sử dụng", "FAQ"].map(l => (
              <div key={l} style={{ color: C.textLightSoft, fontSize: 14, marginBottom: 10, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>LIÊN HỆ</h4>
            {[["📍", "123 Đường Bánh Ngọt, Hà Nội"], ["📞", "0912 345 678"], ["✉️", "hello@tiembanh.vn"], ["⏰", "8:00 - 21:00 hàng ngày"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 8, color: C.textLightSoft, fontSize: 14, marginBottom: 10 }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20, display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: C.textLightSoft, fontSize: 12 }}>© 2026 Tiệm Bánh Sweet Moments.</span>
          <span style={{ color: C.textLightSoft, fontSize: 12 }}>Made with 💕 for sweet moments</span>
        </div>
      </div>
    </footer>
  );
};

// ─── MENU PAGE ─────────────────────────────────────────────────────────────────
const MenuPage = ({ activeCat, setActiveCat, addToCart, setPage, setViewProduct }) => {
  const isMobile = useIsMobile();
  const [priceRange, setPriceRange] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = !activeCat || p.category === activeCat;
    const price = parseInt(p.price.replace(/\./g, ""));
    const matchPrice = priceRange === "all" || (priceRange === "under300" && price < 300000) || (priceRange === "300to500" && price >= 300000 && price <= 500000) || (priceRange === "over500" && price > 500000);
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchPrice && matchSearch;
  }).sort((a, b) => sortBy === "price-asc" ? parseInt(a.price.replace(/\./g, "")) - parseInt(b.price.replace(/\./g, "")) : sortBy === "price-desc" ? parseInt(b.price.replace(/\./g, "")) - parseInt(a.price.replace(/\./g, "")) : b.sold - a.sold);

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      {/* Banner */}
      <div style={{ background: C.deep, padding: isMobile ? "24px 16px" : "40px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Pacifico', cursive", color: "white", fontSize: isMobile ? 28 : 42, fontWeight: 900, margin: "0 0 8px" }}>Thực Đơn</h1>
        <p style={{ color: C.textLightSoft, fontSize: isMobile ? 13 : 15, margin: 0 }}>Khám phá hơn 48 loại bánh đặc sắc</p>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "16px" : "40px 40px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 32 }}>
        {/* Sidebar - mobile toggle */}
        {isMobile && (
          <button onClick={() => setShowMobileFilter(v => !v)} style={{ padding: "10px 16px", borderRadius: 12, border: `1px solid ${C.pinkMid}`, background: C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14, color: C.accent, display: "flex", alignItems: "center", gap: 6 }}>
            🔍 Bộ lọc {showMobileFilter ? "▲" : "▼"}
          </button>
        )}
        {(!isMobile || showMobileFilter) && (
          <div style={{ width: isMobile ? "100%" : 240, flexShrink: 0 }}>
            <Card style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: C.deep }}>Danh Mục</h3>
              <button onClick={() => setActiveCat(null)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", background: !activeCat ? C.pinkLight : "transparent", color: !activeCat ? C.accent : C.textMid, fontWeight: !activeCat ? 700 : 400, fontSize: 14, marginBottom: 4 }}>Tất cả</button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", background: activeCat === cat.id ? C.pinkLight : "transparent", color: activeCat === cat.id ? C.accent : C.textMid, fontWeight: activeCat === cat.id ? 700 : 400, fontSize: 14, marginBottom: 4 }}>
                  {cat.icon} {cat.title}
                </button>
              ))}
            </Card>
            <Card style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: C.deep }}>Khoảng Giá</h3>
              {[["all", "Tất cả"], ["under300", "Dưới 300k"], ["300to500", "300k – 500k"], ["over500", "Trên 500k"]].map(([val, label]) => (
                <button key={val} onClick={() => setPriceRange(val)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", background: priceRange === val ? C.pinkLight : "transparent", color: priceRange === val ? C.accent : C.textMid, fontWeight: priceRange === val ? 700 : 400, fontSize: 14, marginBottom: 4 }}>
                  {label}
                </button>
              ))}
            </Card>
          </div>
        )}
        {/* Products */}
        <div style={{ flex: 1 }}>
          {/* Search & Sort */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Tìm kiếm bánh..." style={{ flex: "1 1 200px", padding: "10px 16px", borderRadius: 50, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.white }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 14px", borderRadius: 50, border: `1px solid ${C.pinkMid}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: C.white, color: C.textDark }}>
              <option value="popular">Phổ biến nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
            <span style={{ fontSize: 12, color: C.textMid, whiteSpace: "nowrap" }}>{filtered.length} SP</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 10 : 20 }}>
            {filtered.map(p => (
              <Card key={p.id} style={{ overflow: "hidden" }} onClick={() => { setViewProduct(p); setPage("product"); }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>{p.tags.map(t => <Tag key={t} label={t} />)}</div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: C.deepText }}>{p.name}</h3>
                  <StarRating rating={p.rating} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: C.accent }}>{p.price}đ</span>
                    <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={{ background: C.accent, border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: C.textMid }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <p>Không tìm thấy sản phẩm phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCT DETAIL ────────────────────────────────────────────────────────────
const ProductPage = ({ product, addToCart, setPage, setCart }) => {
  const isMobile = useIsMobile();
  const [qty, setQty] = useState(1);
  const [selSize, setSelSize] = useState("16cm");
  const [selFlavor, setSelFlavor] = useState("Vanilla");
  const [activeImg, setActiveImg] = useState(0);
  const sizes = [{ size: "14cm", price: product?.price, servings: "1-2 người" }, { size: "16cm", price: product?.price, servings: "3-4 người" }, { size: "18cm", price: product?.price, servings: "5-6 người" }];
  const flavors = ["Vanilla", "Matcha", "Socola", "Dâu Tây", "Chanh Dây"];
  if (!product) return null;
  // Build gallery: product image + 2 related images from same category or nearby
  const productIdx = CAKE_IMAGES.indexOf(product.img);
  const gallery = [
    product.img,
    CAKE_IMAGES[(productIdx + 1) % CAKE_IMAGES.length],
    CAKE_IMAGES[(productIdx + 2) % CAKE_IMAGES.length],
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      {/* Header band */}
      <div style={{ background: C.deep, padding: isMobile ? "12px 16px" : "16px 40px" }}>
        <button onClick={() => setPage("menu")} style={{ background: "none", border: "none", color: C.textLightSoft, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>← Quay lại thực đơn</button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 24 : 48 }}>
        {/* Images */}
        <div style={{ flex: isMobile ? "none" : "0 0 480px", width: isMobile ? "100%" : undefined }}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: C.cardShadow }}>
            <img src={gallery[activeImg]} alt={product.name} style={{ width: "100%", height: isMobile ? 260 : 400, objectFit: "cover", transition: "opacity 0.3s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {gallery.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{ borderRadius: 12, overflow: "hidden", flex: 1, border: `2px solid ${i === activeImg ? C.accent : "transparent"}`, cursor: "pointer", transition: "all 0.2s", opacity: i === activeImg ? 1 : 0.7 }}>
                <img src={img} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{product.tags.map(t => <Tag key={t} label={t} />)}</div>
          <h1 style={{ fontFamily: "'Pacifico', cursive", fontSize: 36, fontWeight: 900, color: C.deep, margin: "0 0 12px" }}>{product.name}</h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <StarRating rating={product.rating} size={18} />
            <span style={{ color: C.textMid, fontSize: 14 }}>({product.sold} đánh giá)</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.accent, marginBottom: 24 }}>{product.price}đ</div>

          {/* Size */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: C.deepText, marginBottom: 10, fontSize: 15 }}>Chọn kích thước</div>
            <div style={{ display: "flex", gap: 10 }}>
              {sizes.map(s => (
                <button key={s.size} onClick={() => setSelSize(s.size)} style={{ padding: "10px 20px", borderRadius: 50, border: `2px solid ${selSize === s.size ? C.accent : C.pinkMid}`, background: selSize === s.size ? C.pinkLight : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, color: selSize === s.size ? C.accent : C.textMid, fontSize: 13, transition: "all 0.2s" }}>
                  {s.size}<br /><span style={{ fontSize: 11, fontWeight: 400 }}>{s.servings}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flavor */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: C.deepText, marginBottom: 10, fontSize: 15 }}>Hương vị</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {flavors.map(f => (
                <button key={f} onClick={() => setSelFlavor(f)} style={{ padding: "7px 18px", borderRadius: 50, border: `2px solid ${selFlavor === f ? C.accent : C.pinkMid}`, background: selFlavor === f ? C.pinkLight : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, color: selFlavor === f ? C.accent : C.textMid, fontSize: 13, transition: "all 0.2s" }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ fontWeight: 700, color: C.deepText, fontSize: 15 }}>Số lượng</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${C.pinkMid}`, borderRadius: 50, overflow: "hidden" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: "none", background: C.white, cursor: "pointer", fontSize: 18, fontWeight: 700, color: C.accent }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: 16, color: C.deepText }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, border: "none", background: C.white, cursor: "pointer", fontSize: 18, fontWeight: 700, color: C.accent }}>+</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <PillBtn onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}>🛒 Thêm vào giỏ hàng</PillBtn>
            <PillBtn variant="success" onClick={() => { setCart([{ ...product, qty }]); setPage("checkout"); }} style={{ background: `linear-gradient(135deg, #D4639A, #8B3A6B)`, boxShadow: "0 4px 16px rgba(139,58,107,0.35)" }}>⚡ Mua ngay</PillBtn>
          </div>

          {/* Trust */}
          <div style={{ display: "flex", gap: 20, marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.pinkMid}` }}>
            {[["🎁", "Tặng kèm hộp đẹp"], ["🚀", "Giao trong 2-4h"], ["💝", "Cam kết chất lượng"]].map(([icon, text]) => (
              <div key={text} style={{ fontSize: 12, color: C.textMid, display: "flex", alignItems: "center", gap: 4 }}><span>{icon}</span>{text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CART SIDEBAR ──────────────────────────────────────────────────────────────
const CartSidebar = ({ cart, setCart, onClose, setPage, user }) => {
  const isMobile = useIsMobile();
  const total = cart.reduce((s, i) => s + parseInt(i.price.replace(/\./g, "")) * i.qty, 0);
  const fmt = n => n.toLocaleString("vi-VN");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex" }}>
      <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ width: isMobile ? "100%" : 420, background: C.white, display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${C.pinkMid}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.deep }}>🛒 Giỏ hàng ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.textMid }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.textMid }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>Giỏ hàng trống</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 16, padding: 12, background: C.cream, borderRadius: 12 }}>
              <img src={item.img} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.deepText, marginBottom: 4 }}>{item.name}</div>
                <div style={{ color: C.accent, fontWeight: 800, fontSize: 15 }}>{item.price}đ</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${C.pinkMid}`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.accent }}>−</button>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${C.pinkMid}`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.accent }}>+</button>
                  <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: 14 }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "16px 24px 24px", borderTop: `1px solid ${C.pinkMid}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontWeight: 600, color: C.textMid }}>Tạm tính</span>
              <span style={{ fontWeight: 900, color: C.accent, fontSize: 18 }}>{fmt(total)}đ</span>
            </div>
            <PillBtn style={{ width: "100%", justifyContent: "center" }} onClick={() => { onClose(); setPage("checkout"); }}>Thanh toán →</PillBtn>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CHECKOUT PAGE ─────────────────────────────────────────────────────────────
const CheckoutPage = ({ cart, setCart, setPage, user }) => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || "", phone: "", address: "", note: "", payment: "transfer" });
  const total = cart.reduce((s, i) => s + parseInt(i.price.replace(/\./g, "")) * i.qty, 0);
  const fmt = n => n.toLocaleString("vi-VN");
  if (step === 3) return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ padding: 60, textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, fontSize: 28, marginBottom: 12 }}>Đặt hàng thành công!</h2>
        <p style={{ color: C.textMid, marginBottom: 24 }}>Cảm ơn bạn đã tin tưởng Tiệm Bánh Sweet Moments. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vài phút.</p>
        <div style={{ background: C.pinkLight, borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: C.deep }}>Mã đơn hàng: #ORD2026{String(Math.floor(Math.random() * 900 + 100))}</div>
          <div style={{ color: C.textMid, fontSize: 14, marginTop: 4 }}>Dự kiến giao: 2-4 giờ</div>
        </div>
        <PillBtn onClick={() => { setCart([]); setPage("home"); }}>Về trang chủ</PillBtn>
      </Card>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ background: C.deep, padding: isMobile ? "16px" : "20px 40px" }}>
        <h2 style={{ color: "white", margin: 0, fontFamily: "'Pacifico', cursive", fontSize: isMobile ? 22 : 28 }}>Thanh Toán</h2>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 32 }}>
        {/* Form */}
        <div style={{ flex: 1 }}>
          <Card style={{ padding: 32 }}>
            <h3 style={{ color: C.deep, marginBottom: 24, fontSize: 20, fontWeight: 800 }}>Thông tin giao hàng</h3>
            {[["name", "Họ và tên", "text"], ["phone", "Số điện thoại", "tel"], ["address", "Địa chỉ nhận hàng", "text"]].map(([key, label, type]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 8 }}>Phương thức thanh toán</label>
              {[["transfer", "💳 Chuyển khoản ngân hàng"], ["momo", "💜 Ví MoMo"], ["cash", "💵 Tiền mặt khi nhận"]].map(([val, label]) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, border: `2px solid ${form.payment === val ? C.accent : C.pinkMid}`, background: form.payment === val ? C.pinkLight : C.white, marginBottom: 8, cursor: "pointer" }}>
                  <input type="radio" checked={form.payment === val} onChange={() => setForm(f => ({ ...f, payment: val }))} style={{ accentColor: C.accent }} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: form.payment === val ? C.accent : C.textDark }}>{label}</span>
                </label>
              ))}
            </div>
            <PillBtn onClick={() => setStep(3)} style={{ width: "100%", justifyContent: "center" }}>Xác nhận đặt hàng 🎂</PillBtn>
          </Card>
        </div>
        {/* Summary */}
        <div style={{ width: isMobile ? "100%" : 340 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: C.deep, marginBottom: 16, fontSize: 18, fontWeight: 800 }}>Tóm tắt đơn hàng</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.pinkLight}` }}>
                <img src={item.img} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.deepText }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.textMid }}>x{item.qty}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>{fmt(parseInt(item.price.replace(/\./g, "")) * item.qty)}đ</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ color: C.textMid }}>Phí giao hàng</span>
              <span style={{ color: "#27ae60", fontWeight: 700 }}>Miễn phí</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `2px solid ${C.pink}` }}>
              <span style={{ fontWeight: 800, color: C.deep, fontSize: 16 }}>Tổng cộng</span>
              <span style={{ fontWeight: 900, color: C.accent, fontSize: 20 }}>{fmt(total)}đ</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER HISTORY ─────────────────────────────────────────────────────────────
const OrderTrackingTimeline = ({ status }) => {
  const steps = [
    { key: "pending", label: "Đã đặt hàng", icon: "📋" },
    { key: "confirmed", label: "Đã xác nhận", icon: "✅" },
    { key: "delivering", label: "Đang giao", icon: "🚀" },
    { key: "done", label: "Hoàn thành", icon: "🎉" },
  ];
  const statusOrder = ["pending", "confirmed", "delivering", "done"];
  const currentIdx = statusOrder.indexOf(status);
  const isCancelled = status === "cancelled";
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        {/* Connecting line */}
        <div style={{ position: "absolute", top: 20, left: 40, right: 40, height: 3, background: C.pinkLight, zIndex: 0 }} />
        <div style={{ position: "absolute", top: 20, left: 40, height: 3, background: isCancelled ? "#e74c3c" : C.accent, zIndex: 1, width: isCancelled ? "0%" : `${Math.min(100, (currentIdx / (steps.length - 1)) * 100)}%`, transition: "width 0.5s ease" }} />
        {steps.map((s, i) => {
          const isActive = !isCancelled && i <= currentIdx;
          const isCurrent = !isCancelled && i === currentIdx;
          return (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: isActive ? (isCurrent ? C.accent : C.pink) : C.pinkLight,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                boxShadow: isCurrent ? `0 0 0 4px ${C.pinkLight}, 0 4px 12px rgba(212,99,154,0.3)` : "none",
                transition: "all 0.3s",
              }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 400, color: isActive ? C.deep : C.textMid, marginTop: 8, textAlign: "center" }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div style={{ textAlign: "center", marginTop: 16, padding: "8px 16px", background: "#F8D7DA", borderRadius: 8, color: "#721C24", fontSize: 13, fontWeight: 600 }}>
          ❌ Đơn hàng đã bị hủy
        </div>
      )}
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
      <Card style={{ width: 560, padding: 32, maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.textMid }}>✕</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "0 0 4px", fontSize: 24 }}>Chi tiết đơn hàng</h2>
            <span style={{ fontSize: 14, color: C.accent, fontWeight: 700 }}>{order.id}</span>
          </div>
          <StatusBadge status={order.status} />
        </div>
        {/* Tracking Timeline */}
        <OrderTrackingTimeline status={order.status} />
        {/* Order info */}
        <div style={{ background: C.cream, borderRadius: 12, padding: 20, marginTop: 16 }}>
          <h4 style={{ margin: "0 0 12px", color: C.deep, fontSize: 15 }}>Thông tin đơn hàng</h4>
          {[["📦", "Sản phẩm", order.items], ["📅", "Ngày đặt", order.date], ["📞", "Số điện thoại", order.phone], ["📍", "Địa chỉ", order.address]].map(([icon, label, val]) => (
            <div key={label} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14 }}>
              <span>{icon}</span>
              <span style={{ color: C.textMid, minWidth: 100 }}>{label}:</span>
              <span style={{ color: C.deepText, fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: `2px solid ${C.pink}` }}>
          <span style={{ fontWeight: 700, color: C.deep, fontSize: 16 }}>Tổng cộng</span>
          <span style={{ fontWeight: 900, color: C.accent, fontSize: 22 }}>{order.total}đ</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <PillBtn onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Đóng</PillBtn>
        </div>
      </Card>
    </div>
  );
};

const OrderHistoryPage = ({ user, setPage }) => {
  const [myOrders] = useState(ORDERS.slice(0, 4));
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOrder, setViewOrder] = useState(null);
  const filtered = filterStatus === "all" ? myOrders : myOrders.filter(o => o.status === filterStatus);
  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingTop: 80 }}>
      <div style={{ background: C.deep, padding: "20px 40px" }}>
        <h2 style={{ color: "white", margin: 0, fontFamily: "'Pacifico', cursive" }}>Theo dõi đơn hàng</h2>
        <p style={{ color: C.textLightSoft, fontSize: 14, margin: "6px 0 0" }}>Xem trạng thái và chi tiết các đơn hàng của bạn</p>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
          {[["📦", "Tổng đơn", myOrders.length], ["⏳", "Đang xử lý", myOrders.filter(o => o.status === "pending" || o.status === "confirmed").length], ["🚀", "Đang giao", myOrders.filter(o => o.status === "delivering").length], ["✅", "Hoàn thành", myOrders.filter(o => o.status === "done").length]].map(([icon, label, count]) => (
            <Card key={label} style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.deep }}>{count}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{label}</div>
            </Card>
          ))}
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[["all", "Tất cả"], ["pending", "Chờ xác nhận"], ["confirmed", "Đã xác nhận"], ["delivering", "Đang giao"], ["done", "Hoàn thành"], ["cancelled", "Đã hủy"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)} style={{ padding: "7px 18px", borderRadius: 50, border: `2px solid ${filterStatus === val ? C.accent : C.pinkMid}`, background: filterStatus === val ? C.pinkLight : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, color: filterStatus === val ? C.accent : C.textMid, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        {/* Order list */}
        {filtered.map(order => (
          <Card key={order.id} style={{ padding: 24, marginBottom: 16, cursor: "pointer" }} onClick={() => setViewOrder(order)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: C.accent, fontSize: 16 }}>{order.id}</span>
                  <StatusBadge status={order.status} />
                  <span style={{ fontSize: 12, color: C.textMid }}>📅 {order.date}</span>
                </div>
                <div style={{ fontSize: 14, color: C.textDark, marginBottom: 2 }}>📦 {order.items}</div>
                <div style={{ fontSize: 13, color: C.textMid }}>📍 {order.address}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 900, color: C.accent, fontSize: 20 }}>{order.total}đ</div>
                <div style={{ fontSize: 12, color: C.accent, marginTop: 6, fontWeight: 600 }}>Xem chi tiết →</div>
              </div>
            </div>
            {/* Mini tracking bar */}
            {order.status !== "cancelled" && (
              <div style={{ marginTop: 16, display: "flex", gap: 4 }}>
                {["pending", "confirmed", "delivering", "done"].map((s, i) => {
                  const idx = ["pending", "confirmed", "delivering", "done"].indexOf(order.status);
                  return <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= idx ? C.accent : C.pinkLight, transition: "all 0.3s" }} />;
                })}
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textMid }}>
            <div style={{ fontSize: 48 }}>📦</div>
            <p>Không có đơn hàng nào</p>
          </div>
        )}
      </div>
      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
    </div>
  );
};

// ─── LOGIN MODAL ───────────────────────────────────────────────────────────────
const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handleLogin = () => {
    if (email === "admin@tiembanh.vn" && pass === "admin123") {
      onLogin({ name: "Admin", role: "admin", email });
    } else if (email.includes("@") && pass.length >= 6) {
      onLogin({ name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1), role: "customer", email });
    } else {
      setErr("Email hoặc mật khẩu không đúng!");
    }
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
      <Card style={{ width: 420, padding: 40 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.textMid }}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48 }}>🎂</div>
          <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "8px 0 4px" }}>Đăng nhập</h2>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0 }}>Đăng nhập để đặt bánh và tích điểm thành viên</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>EMAIL</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>MẬT KHẨU</label>
          <input value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {err && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{err}</div>}
        <PillBtn onClick={handleLogin} style={{ width: "100%", justifyContent: "center" }}>Đăng nhập</PillBtn>
        <div style={{ marginTop: 16, padding: "12px 16px", background: C.pinkLight, borderRadius: 10, fontSize: 12, color: C.textMid }}>
          <strong style={{ color: C.accent }}>Demo Admin:</strong> admin@tiembanh.vn / admin123<br />
          <strong style={{ color: C.accent }}>Demo KH:</strong> kh@gmail.com / 123456
        </div>
      </Card>
    </div>
  );
};

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminSidebar = ({ adminPage, setAdminPage }) => {
  const items = [
    { id: "admin-dashboard", icon: "📊", label: "Tổng quan" },
    { id: "admin-orders", icon: "📦", label: "Đơn hàng" },
    { id: "admin-products", icon: "🎂", label: "Sản phẩm" },
    { id: "admin-customers", icon: "👥", label: "Khách hàng" },
    { id: "admin-stats", icon: "📈", label: "Thống kê" },
  ];
  return (
    <div style={{ width: 220, background: C.deep, minHeight: "100vh", paddingTop: 80, position: "fixed", left: 0, top: 0 }}>
      <div style={{ padding: "20px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: C.textLightSoft, letterSpacing: "0.1em", fontWeight: 600 }}>QUẢN TRỊ VIÊN</div>
        <div style={{ color: "white", fontWeight: 700, marginTop: 4 }}>Tiệm Bánh Admin</div>
      </div>
      {items.map(item => (
        <button key={item.id} onClick={() => setAdminPage(item.id)} style={{
          display: "flex", width: "100%", alignItems: "center", gap: 12, padding: "12px 20px",
          border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", fontSize: 14,
          background: adminPage === item.id ? "rgba(239,176,201,0.25)" : "transparent",
          color: adminPage === item.id ? C.pink : C.textLightSoft,
          fontWeight: adminPage === item.id ? 700 : 400,
          borderRight: adminPage === item.id ? `3px solid ${C.pink}` : "3px solid transparent",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card style={{ padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: C.textMid, fontWeight: 600, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: color || C.deep }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "#27ae60", marginTop: 4, fontWeight: 600 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 32 }}>{icon}</div>
    </div>
  </Card>
);

const AdminDashboard = () => (
  <div>
    <h1 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "0 0 8px", fontSize: 30 }}>Tổng Quan</h1>
    <p style={{ color: C.textMid, marginBottom: 32 }}>Hôm nay, 21/04/2026</p>
    {/* Stat Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
      <StatCard icon="💰" label="Doanh thu tháng" value="95.2tr" sub="▲ 12% so tháng trước" color={C.accent} />
      <StatCard icon="📦" label="Đơn hàng hôm nay" value="23" sub="▲ 5 đơn mới" />
      <StatCard icon="🎂" label="Sản phẩm đang bán" value="48" sub="3 sản phẩm sắp hết" />
      <StatCard icon="👥" label="Khách hàng mới" value="18" sub="▲ 8% tuần qua" />
    </div>
    {/* Charts */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
      <Card style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 20px", color: C.deep, fontSize: 16, fontWeight: 700 }}>Doanh thu & Đơn hàng theo tháng</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.pinkLight} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v, n) => [n === "revenue" ? `${v}tr đồng` : `${v} đơn`, n === "revenue" ? "Doanh thu" : "Đơn hàng"]} />
            <Bar dataKey="revenue" fill={C.pink} radius={[6, 6, 0, 0]} />
            <Bar dataKey="orders" fill={C.blue} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 20px", color: C.deep, fontSize: 16, fontWeight: 700 }}>Cơ cấu sản phẩm</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
              {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {PIE_DATA.map(e => (
            <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.color }} />
              <span style={{ color: C.textMid }}>{e.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
    {/* Pending orders */}
    <Card style={{ padding: 24 }}>
      <h3 style={{ margin: "0 0 16px", color: C.deep, fontSize: 16, fontWeight: 700 }}>Đơn cần xử lý hôm nay</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{["Mã ĐH", "Khách hàng", "Sản phẩm", "Tổng tiền", "Trạng thái"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: C.textMid, borderBottom: `1px solid ${C.pinkLight}` }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {ORDERS.filter(o => o.status === "pending" || o.status === "confirmed").map(o => (
            <tr key={o.id}>
              <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: C.accent }}>{o.id}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, color: C.textDark }}>{o.customer}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, color: C.textMid }}>{o.items}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: C.deepText }}>{o.total}đ</td>
              <td style={{ padding: "10px 12px" }}><StatusBadge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const nextStatus = { pending: "confirmed", confirmed: "delivering", delivering: "done" };
  const updateStatus = (id, newStatus) => setOrders(os => os.map(o => o.id === id ? { ...o, status: newStatus } : o));
  return (
    <div>
      <h1 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "0 0 24px", fontSize: 30 }}>Quản Lý Đơn Hàng</h1>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[["all", "Tất cả"], ["pending", "Chờ xác nhận"], ["confirmed", "Đã xác nhận"], ["delivering", "Đang giao"], ["done", "Hoàn thành"], ["cancelled", "Đã hủy"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: "8px 20px", borderRadius: 50, border: `2px solid ${filter === val ? C.accent : C.pinkMid}`, background: filter === val ? C.pinkLight : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, color: filter === val ? C.accent : C.textMid }}>
            {label} ({val === "all" ? orders.length : orders.filter(o => o.status === val).length})
          </button>
        ))}
      </div>
      {filtered.map(order => (
        <Card key={order.id} style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 800, color: C.accent, fontSize: 15 }}>{order.id}</span>
                <StatusBadge status={order.status} />
                <span style={{ fontSize: 12, color: C.textMid }}>📅 {order.date}</span>
              </div>
              <div style={{ fontSize: 14, color: C.textDark, marginBottom: 2 }}>👤 {order.customer} · 📞 {order.phone}</div>
              <div style={{ fontSize: 13, color: C.textMid, marginBottom: 2 }}>📦 {order.items}</div>
              <div style={{ fontSize: 13, color: C.textMid }}>📍 {order.address}</div>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ fontWeight: 900, color: C.accent, fontSize: 18 }}>{order.total}đ</div>
              {nextStatus[order.status] && (
                <PillBtn small variant="success" onClick={() => updateStatus(order.id, nextStatus[order.status])}>
                  {{ confirmed: "✅ Xác nhận", delivering: "🚀 Bàn giao ship", done: "✔ Hoàn thành" }[nextStatus[order.status]] || "Cập nhật"}
                </PillBtn>
              )}
              {order.status === "pending" && (
                <PillBtn small variant="danger" onClick={() => updateStatus(order.id, "cancelled")}>Hủy đơn</PillBtn>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const AVAILABLE_TAGS = ["Hot", "Bestseller", "New", "Cho bé", "Đặc biệt", "Sự kiện", "Ngày lễ", "Không gluten", "Giới hạn", "Không đường"];

// ─────────────────────────────────────────────────────────────────────────────
// ProductFormModal – Thêm/Sửa sản phẩm
// Props mới: categories (mảng), onAddCategory (callback thêm danh mục mới)
// ─────────────────────────────────────────────────────────────────────────────
const ProductFormModal = ({ product, onSave, onClose, title, categories, onAddCategory }) => {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || (categories?.[0]?.id ?? "mini"),
    tags: product?.tags || [],
    sold: product?.sold || 0,
    rating: product?.rating || 4.5,
    img: product?.img || CAKE_IMAGES[0],
    inStock: product?.inStock !== undefined ? product.inStock : true,
  });
  const [newTag, setNewTag] = useState("");
  // ── Thêm danh mục mới ──
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🎂");
  const [addCatMsg, setAddCatMsg] = useState("");
  // ── Upload ảnh ──
  const [uploadPreview, setUploadPreview] = useState(null); // base64 / object-URL
  const [uploadName, setUploadName] = useState("");
  const fileInputRef = useRef(null);

  const cats = categories || CATEGORIES;

  const addTag = (tag) => { if (tag && !form.tags.includes(tag)) setForm(f => ({ ...f, tags: [...f.tags, tag] })); };
  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Vui lòng chọn file hình ảnh (jpg, png, webp…)"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Ảnh không được vượt quá 5MB!"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setUploadPreview(dataUrl);
      setUploadName(file.name);
      setForm(f => ({ ...f, img: dataUrl })); // Dùng base64 làm src ảnh
    };
    reader.readAsDataURL(file);
  };

  // Thêm danh mục mới
  const handleAddCategory = () => {
    if (!newCatTitle.trim()) { setAddCatMsg("Vui lòng nhập tên danh mục!"); return; }
    const id = newCatTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const newCat = { id, slug: id, title: newCatTitle.trim(), icon: newCatIcon.trim() || "🎂", count: 0 };
    if (typeof onAddCategory === "function") onAddCategory(newCat);
    setForm(f => ({ ...f, category: id }));
    setNewCatTitle(""); setNewCatIcon("🎂");
    setAddCatMsg("✅ Đã thêm danh mục: " + newCat.title);
    setTimeout(() => { setAddCatMsg(""); setShowAddCat(false); }, 1500);
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert("Vui lòng nhập tên sản phẩm!"); return; }
    if (!form.price.trim()) { alert("Vui lòng nhập giá sản phẩm!"); return; }
    onSave({ ...product, ...form, id: product?.id || "p" + Date.now() });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
      <Card style={{ width: 600, padding: 32, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.textMid }}>✕</button>
        <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.accent, margin: "0 0 24px" }}>{title}</h2>

        {/* ── Tên & Giá ── */}
        {[["name", "Tên sản phẩm *", "text"], ["price", "Giá (VD: 280.000) *", "text"]].map(([key, label, type]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6 }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
          </div>
        ))}

        {/* ── Danh mục + Thêm danh mục mới ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText }}>Danh mục</label>
            <button
              onClick={() => setShowAddCat(v => !v)}
              style={{ fontSize: 12, fontWeight: 700, color: C.accent, background: "none", border: `1px solid ${C.accent}`, borderRadius: 20, padding: "3px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              {showAddCat ? "▲ Đóng" : "+ Thêm danh mục mới"}
            </button>
          </div>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={{ ...inputStyle, background: "white" }}>
            {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
          </select>

          {/* Mini form thêm danh mục */}
          {showAddCat && (
            <div style={{ marginTop: 12, padding: 16, background: C.cream, borderRadius: 12, border: `1px dashed ${C.pinkMid}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 10 }}>✨ Tạo danh mục mới</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 4 }}>Tên danh mục *</label>
                  <input value={newCatTitle} onChange={e => setNewCatTitle(e.target.value)} placeholder="VD: Bánh Mousse"
                    style={{ ...inputStyle, fontSize: 13 }} />
                </div>
                <div style={{ width: 80 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 4 }}>Icon</label>
                  <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="🎂"
                    style={{ ...inputStyle, fontSize: 18, textAlign: "center", fontSize: 13 }} />
                </div>
              </div>
              {addCatMsg && (
                <div style={{ fontSize: 12, color: addCatMsg.startsWith("✅") ? "#27ae60" : "#e74c3c", marginBottom: 8, fontWeight: 600 }}>
                  {addCatMsg}
                </div>
              )}
              <button onClick={handleAddCategory}
                style={{ padding: "7px 20px", borderRadius: 50, border: "none", background: C.accent, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                Tạo danh mục
              </button>
            </div>
          )}
        </div>

        {/* ── Trạng thái hàng ── */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 8 }}>Trạng thái hàng</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setForm(f => ({ ...f, inStock: true }))}
              style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: `2px solid ${form.inStock ? "#27ae60" : C.pinkMid}`, background: form.inStock ? "#E8F8E8" : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: form.inStock ? "#27ae60" : C.textMid, transition: "all 0.2s" }}>
              ✅ Còn hàng
            </button>
            <button onClick={() => setForm(f => ({ ...f, inStock: false }))}
              style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: `2px solid ${!form.inStock ? "#e74c3c" : C.pinkMid}`, background: !form.inStock ? "#FDE8E8" : C.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: !form.inStock ? "#e74c3c" : C.textMid, transition: "all 0.2s" }}>
              ❌ Hết hàng
            </button>
          </div>
        </div>

        {/* ── Tags ── */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 8 }}>Tags / Nhãn</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {form.tags.length === 0 && <span style={{ fontSize: 13, color: C.textMid, fontStyle: "italic" }}>Chưa có tag nào</span>}
            {form.tags.map(tag => (
              <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: C.pinkLight, color: C.deep, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                {tag}
                <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: 14, padding: 0, lineHeight: 1, fontWeight: 700 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {AVAILABLE_TAGS.filter(t => !form.tags.includes(t)).map(tag => (
              <button key={tag} onClick={() => addTag(tag)}
                style={{ padding: "4px 12px", borderRadius: 20, border: `1px dashed ${C.pinkMid}`, background: "white", cursor: "pointer", fontSize: 12, fontFamily: "inherit", color: C.textMid, transition: "all 0.2s" }}>
                + {tag}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Thêm tag tùy chỉnh..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => { if (e.key === "Enter" && newTag.trim()) { addTag(newTag.trim()); setNewTag(""); } }} />
            <button onClick={() => { if (newTag.trim()) { addTag(newTag.trim()); setNewTag(""); } }}
              style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: C.accent, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
              + Thêm
            </button>
          </div>
        </div>

        {/* ── Thống kê chỉ xem (khi sửa) ── */}
        {product && (
          <div style={{ marginBottom: 14, background: C.cream, borderRadius: 12, padding: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 8 }}>📊 Thống kê (chỉ xem)</label>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>{form.sold}</div>
                <div style={{ fontSize: 11, color: C.textMid }}>Đã bán</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#F5A623" }}>⭐ {form.rating}</div>
                <div style={{ fontSize: 11, color: C.textMid }}>Đánh giá</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Hình ảnh: URL hoặc Upload file ── */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 8 }}>Hình ảnh sản phẩm</label>

          {/* Tab chọn kiểu */}
          <div style={{ display: "flex", gap: 0, marginBottom: 12, border: `1px solid ${C.pinkMid}`, borderRadius: 10, overflow: "hidden" }}>
            {[["url", "🔗 Nhập URL"], ["upload", "📁 Tải ảnh lên"]].map(([k, l]) => (
              <button key={k}
                onClick={() => {
                  // Nếu chuyển sang URL và đang có upload thì không xóa hình
                }}
                style={{ flex: 1, padding: "9px", border: "none", cursor: "default", fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: C.pinkLight, color: C.deep }}>
                {l}
              </button>
            ))}
          </div>

          {/* Nhập URL */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: C.textMid, display: "block", marginBottom: 4 }}>URL ảnh (paste link)</label>
            <input value={form.img.startsWith("data:") ? "" : form.img}
              onChange={e => { setUploadPreview(null); setUploadName(""); setForm(f => ({ ...f, img: e.target.value })); }}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle} />
          </div>

          {/* Upload file */}
          <div>
            <label style={{ fontSize: 11, color: C.textMid, display: "block", marginBottom: 6 }}>Hoặc tải ảnh từ máy tính (jpg, png, webp ≤ 5MB)</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ padding: "9px 20px", borderRadius: 10, border: `2px dashed ${C.accent}`, background: C.pinkLight, color: C.accent, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}>
              📤 Chọn file ảnh
            </button>
            {uploadName && <span style={{ marginLeft: 10, fontSize: 12, color: C.textMid }}>📎 {uploadName}</span>}
          </div>

          {/* Preview */}
          {(form.img || uploadPreview) && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={uploadPreview || form.img}
                alt="preview"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: `2px solid ${C.pinkMid}` }}
                onError={e => { e.target.style.opacity = 0.3; }}
              />
              <div>
                <div style={{ fontSize: 12, color: C.textMid }}>Ảnh xem trước</div>
                {uploadPreview && (
                  <button onClick={() => { setUploadPreview(null); setUploadName(""); setForm(f => ({ ...f, img: CAKE_IMAGES[0] })); }}
                    style={{ fontSize: 12, color: "#e74c3c", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4 }}>
                    🗑 Xóa ảnh đã upload
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Nút lưu ── */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <PillBtn onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>💾 Lưu</PillBtn>
          <PillBtn variant="secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Hủy</PillBtn>
        </div>
      </Card>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES); // ← categories có thể thêm mới
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = products.filter(p => {
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    const matchTag = filterTag === "all" || p.tags.includes(filterTag);
    return matchSearch && matchCat && matchTag;
  });

  const handleAdd = (newP) => { setProducts(ps => [...ps, newP]); setShowAdd(false); showToast("✅ Đã thêm sản phẩm!"); };
  const handleEdit = (updatedP) => { setProducts(ps => ps.map(p => p.id === updatedP.id ? updatedP : p)); setEditProduct(null); showToast("✅ Đã cập nhật!"); };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?"))
      setProducts(ps => ps.filter(x => x.id !== id));
  };
  const handleAddCategory = (newCat) => setCategories(cs => [...cs, newCat]);

  const allTags = [...new Set(products.flatMap(p => p.tags))];

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, background: C.deep, color: "white", padding: "12px 24px", borderRadius: 12, zIndex: 5000, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: 14 }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: 0, fontSize: 30 }}>Quản Lý Sản Phẩm</h1>
        <PillBtn onClick={() => setShowAdd(true)}>+ Thêm sản phẩm</PillBtn>
      </div>

      {/* ── Bộ lọc ── */}
      <Card style={{ padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Tìm sản phẩm..."
            style={{ flex: "1 1 200px", padding: "9px 16px", borderRadius: 50, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: C.white }} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            style={{ padding: "9px 16px", borderRadius: 50, border: `1px solid ${C.pinkMid}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: C.white }}>
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
          </select>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
            style={{ padding: "9px 16px", borderRadius: 50, border: `1px solid ${C.pinkMid}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: C.white }}>
            <option value="all">Tất cả nhãn</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{ fontSize: 13, color: C.textMid, whiteSpace: "nowrap" }}>
            {filtered.length} / {products.length} sản phẩm
          </span>
        </div>
      </Card>

      {/* ── Bảng sản phẩm ── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: C.pinkLight }}>
            <tr>{["Sản phẩm", "Danh mục", "Giá", "Trạng thái", "Tags", "Thao tác"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.deepText }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${C.pinkLight}`, background: i % 2 === 0 ? "white" : C.cream }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <img src={p.img} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                      onError={e => { e.target.src = CAKE_IMAGES[0]; }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.deepText }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.textMid }}>
                  {categories.find(c => c.id === p.category)?.title || p.category}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: C.accent }}>{p.price}đ</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.inStock !== false ? "#E8F8E8" : "#FDE8E8", color: p.inStock !== false ? "#27ae60" : "#e74c3c" }}>
                    {p.inStock !== false ? "Còn hàng" : "Hết hàng"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.tags.map(t => <Tag key={t} label={t} />)}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditProduct(p)}
                      style={{ padding: "6px 14px", borderRadius: 50, border: `1px solid ${C.accent}`, background: "white", cursor: "pointer", color: C.accent, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                      ✏️ Sửa
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      style={{ padding: "6px 14px", borderRadius: 50, border: "1px solid #e74c3c", background: "white", cursor: "pointer", color: "#e74c3c", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                      🗑 Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: C.textMid, fontSize: 14 }}>Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <ProductFormModal
          title="Thêm Sản Phẩm Mới"
          categories={categories}
          onAddCategory={handleAddCategory}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editProduct && (
        <ProductFormModal
          title="Chỉnh Sửa Sản Phẩm"
          product={editProduct}
          categories={categories}
          onAddCategory={handleAddCategory}
          onSave={handleEdit}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
};

const AdminStats = () => (
  <div>
    <h1 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "0 0 24px", fontSize: 30 }}>Thống Kê Doanh Thu</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
      <StatCard icon="💰" label="Doanh thu năm 2026" value="732tr" sub="▲ 18% so 2025" color={C.accent} />
      <StatCard icon="📦" label="Tổng đơn hàng" value="1.254" sub="Tỷ lệ hoàn thành 93%" />
      <StatCard icon="🌟" label="Đánh giá trung bình" value="4.85/5" sub="từ 834 đánh giá" />
    </div>
    <Card style={{ padding: 24, marginBottom: 20 }}>
      <h3 style={{ margin: "0 0 20px", color: C.deep, fontWeight: 700 }}>Xu hướng doanh thu năm 2026</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={REVENUE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.pinkLight} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v, n) => [n === "revenue" ? `${v}tr đồng` : `${v} đơn`, n === "revenue" ? "Doanh thu" : "Đơn hàng"]} />
          <Line type="monotone" dataKey="revenue" stroke={C.accent} strokeWidth={3} dot={{ fill: C.accent, r: 5 }} />
          <Line type="monotone" dataKey="orders" stroke={C.blue} strokeWidth={2} dot={{ fill: C.blue, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", color: C.deep, fontWeight: 700 }}>Top sản phẩm bán chạy</h3>
        {PRODUCTS.sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? C.pink : C.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: i < 3 ? C.deep : C.textMid }}>{i + 1}</span>
            <img src={p.img} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.deepText }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textMid }}>Đã bán: {p.sold}</div>
            </div>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 13 }}>{p.price}đ</div>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", color: C.deep, fontWeight: 700 }}>Trạng thái đơn hàng</h3>
        {[["pending", "Chờ xác nhận", 2, "#F5A623"], ["confirmed", "Đã xác nhận", 1, "#3498db"], ["delivering", "Đang giao", 1, "#27ae60"], ["done", "Hoàn thành", 2, "#8B3A6B"], ["cancelled", "Đã hủy", 1, "#e74c3c"]].map(([k, l, n, color]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
            <span style={{ flex: 1, fontSize: 14, color: C.textDark }}>{l}</span>
            <div style={{ width: 120, height: 8, background: C.pinkLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(n / 6) * 100}%`, height: "100%", background: color, borderRadius: 4 }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.deepText, width: 20, textAlign: "right" }}>{n}</span>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

const AdminCustomers = () => {
  const customers = [
    { id: 1, name: "Nguyễn Lan Anh", email: "lananh@gmail.com", phone: "0912 345 678", orders: 12, spent: "3.200.000", points: 320, joined: "01/01/2026", tier: "Gold" },
    { id: 2, name: "Trần Minh Khoa", email: "khoa@gmail.com", phone: "0987 654 321", orders: 8, spent: "2.100.000", points: 210, joined: "15/02/2026", tier: "Silver" },
    { id: 3, name: "Phạm Thu Hương", email: "huong@gmail.com", phone: "0934 111 222", orders: 5, spent: "1.400.000", points: 140, joined: "10/03/2026", tier: "Bronze" },
    { id: 4, name: "Lê Văn Hùng", email: "hung@gmail.com", phone: "0965 888 777", orders: 15, spent: "4.800.000", points: 480, joined: "20/01/2026", tier: "Gold" },
    { id: 5, name: "Vũ Thị Mai", email: "mai@gmail.com", phone: "0911 222 333", orders: 3, spent: "900.000", points: 90, joined: "01/04/2026", tier: "Bronze" },
  ];
  const tierColor = { Gold: "#F5A623", Silver: "#95A5A6", Bronze: "#CD7F32" };
  return (
    <div>
      <h1 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, margin: "0 0 24px", fontSize: 30 }}>Quản Lý Khách Hàng</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Tổng khách hàng" value="284" sub="▲ 18 người mới tháng này" />
        <StatCard icon="🥇" label="Khách VIP (Gold)" value="47" sub="16.5% tổng khách" />
        <StatCard icon="💰" label="Chi tiêu TB/KH" value="680.000đ" sub="▲ 12% so tháng trước" />
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: C.pinkLight }}>
            <tr>{["Khách hàng", "Liên hệ", "Đơn hàng", "Tổng chi tiêu", "Điểm tích lũy", "Hạng", "Ngày tham gia"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.deepText }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id} style={{ borderTop: `1px solid ${C.pinkLight}`, background: i % 2 === 0 ? "white" : C.cream }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>{c.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.deepText }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMid }}>{c.email}<br />{c.phone}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: C.deepText, textAlign: "center" }}>{c.orders}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: C.accent }}>{c.spent}đ</td>
                <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "center" }}>
                  <span style={{ background: C.pinkLight, color: C.deep, borderRadius: 20, padding: "3px 10px", fontWeight: 700 }}>{c.points} pt</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: `${tierColor[c.tier]}22`, color: tierColor[c.tier], borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>⭐ {c.tier}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMid }}>{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── ABOUT PAGE ────────────────────────────────────────────────────────────────
const AboutPage = () => {
  const isMobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ background: C.deep, padding: isMobile ? "40px 20px" : "60px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Pacifico', cursive", color: "white", fontSize: isMobile ? 32 : 48, margin: "0 0 12px" }}>Về Chúng Tôi</h1>
        <p style={{ color: C.textLightSoft, fontSize: isMobile ? 14 : 16 }}>5 năm tạo nên những khoảnh khắc ngọt ngào</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "32px 16px" : "60px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48, alignItems: "center", marginBottom: isMobile ? 32 : 64 }}>
          <div>
            <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, fontSize: 36, marginBottom: 16 }}>Câu chuyện của chúng tôi</h2>
            <p style={{ color: C.textMid, lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>Ra đời năm 2021, Tiệm Bánh Sweet Moments được thành lập bởi tình yêu thuần túy với nghệ thuật làm bánh. Chúng tôi tin rằng mỗi chiếc bánh không chỉ là một món ăn — đó là một kỷ niệm, một cảm xúc, một tình yêu được gói gọn trong từng lớp kem mịn màng.</p>
            <p style={{ color: C.textMid, lineHeight: 1.8, fontSize: 15 }}>Với hơn 1.000 chiếc bánh đã được tạo ra, chúng tôi tự hào khi được đồng hành trong những khoảnh khắc đặc biệt nhất của khách hàng — từ sinh nhật đầu tiên của em bé đến lễ kỷ niệm của những đôi uyên ương.</p>
          </div>
          <div style={{ position: "relative" }}>
            <img src={CAKE_IMAGES[5]} alt="Story" style={{ width: "100%", borderRadius: 24, boxShadow: C.cardShadow }} />
            <div style={{ position: "absolute", bottom: -16, left: -16, background: C.white, borderRadius: 16, padding: 20, boxShadow: C.cardShadow, textAlign: "center" }}>
              <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 32, fontWeight: 900, color: C.accent }}>1000+</div>
              <div style={{ fontSize: 12, color: C.textMid }}>Chiếc bánh đã làm</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 16 : 24 }}>
          {[["🥚", "Nguyên liệu tươi", "Chúng tôi chỉ sử dụng nguyên liệu tươi ngon nhất, nhập khẩu từ các nhà cung cấp uy tín"], ["👩‍🍳", "Đầu bếp chuyên nghiệp", "Đội ngũ 5 bánh nhân có hơn 10 năm kinh nghiệm trang trí và chế biến bánh cao cấp"], ["💝", "Tâm huyết & Tình yêu", "Mỗi chiếc bánh được làm với 100% tâm huyết, đảm bảo sự hoàn hảo trong từng chi tiết"]].map(([icon, title, desc]) => (
            <Card key={title} style={{ padding: isMobile ? 20 : 28, textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 32 : 40, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ color: C.deep, marginBottom: 8, fontSize: isMobile ? 15 : 17 }}>{title}</h3>
              <p style={{ color: C.textMid, fontSize: isMobile ? 13 : 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const isMobile = useIsMobile();
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) { alert("Vui lòng điền đầy đủ thông tin bắt buộc!"); return; }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setContactForm({ name: "", email: "", phone: "", message: "" }); }, 3000);
  };
  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, background: C.cream }}>
      <div style={{ background: C.deep, padding: isMobile ? "24px 16px" : "40px 40px" }}>
        <h1 style={{ fontFamily: "'Pacifico', cursive", color: "white", fontSize: isMobile ? 28 : 40, margin: 0 }}>Liên Hệ</h1>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "32px 16px" : "60px 40px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: isMobile ? 24 : 48 }}>
        <div>
          <h2 style={{ fontFamily: "'Pacifico', cursive", color: C.deep, fontSize: isMobile ? 22 : 28, marginBottom: 20 }}>Thông tin liên hệ</h2>
          {[["📍", "Địa chỉ", "123 Đường Bánh Ngọt, Quận Cầu Giấy, Hà Nội"], ["📞", "Điện thoại", "0912 345 678 (8:00 – 21:00)"], ["✉️", "Email", "hello@tiembanh.vn"], ["⏰", "Giờ mở cửa", "Thứ 2 – Chủ Nhật: 8:00 – 21:00"]].map(([icon, label, val]) => (
            <div key={label} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
              <div><div style={{ fontWeight: 700, color: C.deepText, marginBottom: 2 }}>{label}</div><div style={{ color: C.textMid, fontSize: 14 }}>{val}</div></div>
            </div>
          ))}
        </div>
        <Card style={{ padding: 32 }}>
          <h3 style={{ color: C.deep, marginBottom: 20, fontSize: 20, fontWeight: 800 }}>Gửi tin nhắn cho chúng tôi</h3>
          {submitted && (
            <div style={{ background: "#D4EDDA", color: "#155724", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 14, textAlign: "center" }}>
              ✅ Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.
            </div>
          )}
          {[["name", "Họ và tên *"], ["email", "Email *"], ["phone", "Số điện thoại"]].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6 }}>{label}</label>
              <input value={contactForm[key]} onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.deepText, display: "block", marginBottom: 6 }}>Nội dung *</label>
            <textarea rows={4} value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.pinkMid}`, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <PillBtn onClick={handleContactSubmit} style={{ width: "100%", justifyContent: "center" }}>Gửi tin nhắn ✉️</PillBtn>
        </Card>
      </div>
    </div>
  );
};

// ─── FLOATING CART BUTTON ──────────────────────────────────────────────────────
const FloatingCartBtn = ({ count, onClick }) => {
  const [hover, setHover] = useState(false);
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed", bottom: 32, right: 32, zIndex: 900,
        width: 62, height: 62, borderRadius: "50%", border: "none", cursor: "pointer",
        background: `linear-gradient(135deg, ${C.accent}, ${C.deep})`,
        boxShadow: hover ? "0 8px 32px rgba(143,58,107,0.45), 0 2px 8px rgba(143,58,107,0.25)" : "0 4px 20px rgba(143,58,107,0.35), 0 2px 8px rgba(143,58,107,0.2)",
        transform: hover ? "scale(1.08)" : "scale(1)",
        transition: "all 0.25s ease",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>
      🛒
      <span style={{ position: "absolute", top: -4, right: -4, background: C.pink, color: C.deep, borderRadius: "50%", width: 22, height: 22, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>{count}</span>
    </button>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [adminPage, setAdminPage] = useState("admin-dashboard");

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }];
    });
  };

  const handleLogin = (u) => {
    setUser(u);
    setShowLogin(false);
    if (u.role === "admin") setPage("admin-dashboard");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin = user?.role === "admin" && (page.startsWith("admin"));

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // Admin layout
  if (isAdmin) {
    const adminContent = { "admin-dashboard": <AdminDashboard />, "admin-orders": <AdminOrders />, "admin-products": <AdminProducts />, "admin-customers": <AdminCustomers />, "admin-stats": <AdminStats /> };
    return (
      <div style={{ fontFamily: "'Comfortaa', sans-serif", background: C.cream, minHeight: "100vh" }}>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <AdminSidebar adminPage={adminPage} setAdminPage={setAdminPage} />
        {/* Admin top bar */}
        <div style={{ position: "fixed", top: 0, left: 220, right: 0, height: 64, background: C.white, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", boxShadow: "0 1px 8px rgba(143,58,107,0.08)" }}>
          <div style={{ fontWeight: 700, color: C.deep, fontSize: 16 }}>🎂 Tiệm Bánh Admin Panel</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: C.textMid }}>Xin chào, {user?.name}</span>
            <PillBtn small variant="secondary" onClick={() => { setUser(null); setPage("home"); }}>Thoát Admin</PillBtn>
          </div>
        </div>
        <div style={{ marginLeft: 220, padding: "96px 40px 40px" }}>
          {adminContent[adminPage] || <AdminDashboard />}
        </div>
      </div>
    );
  }

  // Client layout
  return (
    <div style={{ fontFamily: "'Comfortaa', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar page={page} setPage={setPage} cartCount={cartCount} user={user} setUser={setUser} setShowLogin={setShowLogin} setShowCart={setShowCart} />

      {page === "home" && <>
        <HeroSection setPage={setPage} />
        <CategorySection setPage={setPage} setActiveCat={setActiveCat} />
        <ProductGrid title="Sản Phẩm Mới Nhất" subtitle="Những chiếc bánh tươi ngon vừa ra lò" products={PRODUCTS.slice(0, 6)} addToCart={addToCart} setPage={setPage} setViewProduct={setViewProduct} />
        <HotSection products={PRODUCTS.filter(p => p.tags.includes("Hot") || p.tags.includes("Bestseller")).slice(0, 6)} addToCart={addToCart} setPage={setPage} setViewProduct={setViewProduct} />
        <HowToOrderSection />
        <ReviewSection />
        <Footer setPage={setPage} />
      </>}
      {page === "menu" && <MenuPage activeCat={activeCat} setActiveCat={setActiveCat} addToCart={addToCart} setPage={setPage} setViewProduct={setViewProduct} />}
      {page === "product" && <ProductPage product={viewProduct} addToCart={addToCart} setPage={setPage} setCart={setCart} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "guide" && <div style={{ minHeight: "100vh", paddingTop: 80, background: C.cream }}><div style={{ background: C.deep, padding: "40px 40px", textAlign: "center" }}><h1 style={{ fontFamily: "'Pacifico', cursive", color: "white", fontSize: 40, margin: "0 0 8px" }}>Hướng Dẫn Đặt Bánh</h1><p style={{ color: C.textLightSoft, fontSize: 15, margin: 0 }}>4 bước đơn giản để có chiếc bánh hoàn hảo</p></div><HowToOrderSection /></div>}
      {page === "checkout" && <CheckoutPage cart={cart} setCart={setCart} setPage={setPage} user={user} />}
      {page === "orders" && <OrderHistoryPage user={user} setPage={setPage} />}

      {showCart && <CartSidebar cart={cart} setCart={setCart} onClose={() => setShowCart(false)} setPage={setPage} user={user} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      <FloatingCartBtn count={cartCount} onClick={() => setShowCart(true)} />
    </div>
  );
}
