import { useState, useEffect, useRef, useMemo } from "react";

// ════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════
const PARTNER_BUSINESS = { name: "Sharmaji Food & Game", url: "https://sharmajifoodandgame.com" }; // ← edit URL here
const GLOWFRAME_URL = "https://glow-frame.vercel.app"; // ← GlowFrame portfolio (credit badge)

// ── Sharmaji Ki Chai food ordering (same premises, next to Star Game Zone) ──
const SHARMAJI_UPI = "paytmqr6feem6@ptys"; // ← Sharmaji Ki Chai UPI ID (Scan & Pay)
const SHARMAJI_CATS = ["Hot Beverages","Special Item","Maggi","Farali Item","Paratha","Burger","Snacks","Vadapav","Dabeli","South Indian","Frankie","Extra","Sandwich","Shakes","Pizza","Momos","Fries","Meal","Garlic Bread"];
const SHARMAJI_MENU = (() => {
  const d = {
    "Hot Beverages": [["Chai Regular",12],["Jaggery (Gud) Chai",20],["Saffron (Kesar) Chai",25],["Rose (Gulab) Tea",25],["Kullad Chai",20],["Ginger Chai",20],["Green Tea",40],["Ginger Elaichi Chai",30],["Sharma Ji Special Chai",40],["Hot Milk",30],["Bournvita Milk",40],["Coffee (Half)",20],["Coffee (Full)",40]],
    "Special Item": [["Sikanji (Cold)",40],["Kesar Pista Milk Hot",60],["Dry Fruit Masala Milk (Hot)",60],["Hot Chocolate Dry Fruits Milk",70],["Special Chai with Chilli Garlic Poppers (5 pcs)",50]],
    "Maggi": [["Classic Maggi",70],["Veg Maggi",80],["Cheese Maggi",90],["Schezwan Maggi",90],["Garlic Tadka Maggi",110],["Paneer Maggi",120],["Jain Maggi",90],["Veg Maggi with Chilli Garlic Poppers",120],["Veg Maggi with Jalapeno Cheesy Pops",140]],
    "Farali Item": [["French Fries",90],["Sabudana Vada (6 pcs)",90],["Sabudana Khichdi",80]],
    "Paratha": [["Aloo Paratha (2 pcs)",90],["Mix Veg Paratha (2 pcs)",110],["Paneer Paratha (2 pcs)",150]],
    "Burger": [["Classic Burger",70],["Veg Burger",100],["Cheese Burger",110],["Spicy Paneer Burger",170],["Kurkure Cheese Burger",170]],
    "Snacks": [["Samosa (2 pcs)",40],["Tippy Cheese Chilli Corn (5 pcs)",110],["Tippy Mexican Bean (5 pcs)",110],["Cheesy Jalapeno Poppers (6 pcs)",170],["Noodle Spring Roll (6 pcs)",240],["Jalapeno Cheesy Pops (8 pcs)",140],["Chilli Garlic Poppers (12 pcs)",100],["Crispy Veggie Stix (8 pcs)",140],["Veg Manchurian Balls (8 pcs)",140],["Hara Bhara Kabab (8 pcs)",180],["Mozzarella Cheese Stix (6 pcs)",140]],
    "Vadapav": [["Vadapav",30],["Bombay Vadapav",30],["Crunchy Vadapav",35],["Butter Vadapav",40],["Cheese Vadapav",50]],
    "Dabeli": [["Dabeli",30],["Butter Dabeli",40],["Cheese Dabeli",50]],
    "South Indian": [["Masala Dosa Finger Roll (8 pcs)",140]],
    "Frankie": [["Cheese Frankie",110],["Veg Frankie",90],["Mayo Frankie",100]],
    "Extra": [["Extra Pav (2 pcs)",40],["Extra Cheese",30],["Extra Butter",20]],
    "Sandwich": [["Veg Sandwich",80],["Veg Cheese Sandwich",100],["Bread Butter",50],["Cheese Butter",70],["Cheese Chutney",85],["Grill Veg Sandwich",110],["Grill Veg Cheese Sandwich",130],["Grill Bread Butter",80],["Grill Cheese Butter",110],["Grill Cheese Chutney",130]],
    "Shakes": [["Oreo Shake",100],["Kitkat Shake",90],["Cold Coco",90],["Cold Coffee",70],["Oreo Shake with Ice Cream",120],["Kitkat Shake with Ice Cream",110],["Cold Coffee with Ice Cream",85],["Kesar Pista Shake",80]],
    "Pizza": [["7\" Margarita Pizza",95],["7\" Italian Pizza",140],["7\" Jain Italian Pizza",140],["7\" Tandoori Paneer Pizza",140],["7\" Chili Manchurian Pizza",140],["7\" Mexican Pizza",140],["7\" American Garden Pizza",140],["7\" Basil Pesto Pizza",140],["7\" Schezwan Paneer Pizza",140],["7\" Cheesy 7 Pizza",140],["7\" Veg Paradise Pizza",140],["7\" Cheese Onion Capsicum Pizza",140]],
    "Momos": [["Fry Classic Momos",110],["Fry Schezwan Momos",110],["Fry Paneer Tikka Momos",230],["Fry Cheesy Paneer Momo",250],["Fry Kurkure Momos",140]],
    "Fries": [["Premium Salted Fries (9mm)",140],["Normal Salted Fries (6mm)",90],["Crinkle Peri-Peri Fries",140],["Peri Peri Fries (6mm)",110],["Peri Peri Fries (9mm)",160],["Cheese Fries (6mm)",120],["Cheese Fries (9mm)",170],["Mayonnaise Fries (6mm)",110],["Mayonnaise Fries (9mm)",160]],
    "Meal": [["Pav Bhaji",130],["Cholley",100],["Kulcha (2 pcs)",70],["Butter Kulcha (2 pcs)",90]],
    "Garlic Bread": [["Garlic Bread (5 pcs)",125],["Veg Cheese Garlic Bread (5 pcs)",150],["Stuffed Cheese Garlic Sticks (6 pcs)",140]],
  };
  let id = 0; const out = [];
  SHARMAJI_CATS.forEach(c => (d[c]||[]).forEach(([n,p]) => out.push({ id:"sm"+(++id), category:c, name:n, price:p })));
  return out;
})();

const PAYMENT_METHODS = { UPI:"upi", CARD:"card", ONLINE:"online", PAY_AT_STORE:"payAtStore" };
const PAYMENT_STATUS  = { PAID:"paid", UNPAID:"unpaid" };
const BOOKING_STATUS  = { PENDING:"pending", CONFIRMED:"confirmed", CANCELLED:"cancelled" };

// Branches are now fully admin-editable; these are just the seed values.
const DEFAULT_BRANCHES = [
  { id:"star-main", name:"Star Game Zone", icon:"⭐" },
  { id:"sharmaji",  name:"Sharmaji Food & Game", icon:"🍽️" },
];

const DEFAULT_GAMES = [
  { id:1, title:"Cricket 24", price:80, img:"🏏", category:"PS5", duration:"30 min", players:"1-4", desc:"Ultra-realistic cricket with official teams." },
  { id:2, title:"WWE 2K25", price:80, img:"🥊", category:"PS5", duration:"30 min", players:"1-4", desc:"WWE's most realistic wrestling simulation." },
  { id:3, title:"God of War Ragnarök", price:100, img:"⚔️", category:"PS5", duration:"60 min", players:"1", desc:"Epic Norse mythology action adventure." },
  { id:4, title:"GTA V", price:80, img:"🚗", category:"PS4", duration:"30 min", players:"1-2", desc:"Open-world mayhem in Los Santos." },
  { id:5, title:"NFS Heat", price:80, img:"🏎️", category:"PS4", duration:"30 min", players:"1-2", desc:"Race by day, risk it all by night." },
  { id:6, title:"Spider-Man: Miles Morales", price:100, img:"🕷️", category:"PS5", duration:"60 min", players:"1", desc:"Swing through NYC as Miles Morales." },
  { id:7, title:"Mortal Kombat 1", price:80, img:"🔥", category:"PS5", duration:"30 min", players:"1-2", desc:"Next-gen brutal fighting game." },
  { id:8, title:"FC 25", price:80, img:"⚽", category:"PS5", duration:"30 min", players:"1-4", desc:"Official clubs and leagues football." },
];

const DEFAULT_SLOTS = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"];

const DEFAULT_BOOKINGS = [
  { id:"SGZ001", branchId:"star-main", branchName:"Star Game Zone", customerName:"Arjun Patel", phone:"+91 98765 43210", email:"", game:"God of War Ragnarök", date:"2025-06-01", slot:"3:00 PM", players:1, amount:100, paymentMethod:PAYMENT_METHODS.UPI,  paymentStatus:PAYMENT_STATUS.PAID,   bookingStatus:BOOKING_STATUS.CONFIRMED },
  { id:"SGZ002", branchId:"star-main", branchName:"Star Game Zone", customerName:"Priya Shah",  phone:"+91 87654 32109", email:"", game:"Cricket 24",          date:"2025-06-01", slot:"5:00 PM", players:2, amount:160, paymentMethod:PAYMENT_METHODS.CARD, paymentStatus:PAYMENT_STATUS.PAID,   bookingStatus:BOOKING_STATUS.CONFIRMED },
  { id:"SGZ003", branchId:"sharmaji",  branchName:"Sharmaji Food & Game", customerName:"Rahul Mehta", phone:"+91 76543 21098", email:"", game:"GTA V",          date:"2025-06-02", slot:"7:00 PM", players:2, amount:160, paymentMethod:PAYMENT_METHODS.PAY_AT_STORE, paymentStatus:PAYMENT_STATUS.UNPAID, bookingStatus:BOOKING_STATUS.PENDING },
];

const DEFAULT_SETTINGS = {
  business: {
    brandName: "Star Game Zone", brandIcon: "⭐",
    address: "GF 8 Vihav Trade Centre, Bhayli, Vadodara 391410",
    addressFull: "GF 8 Vihav Trade Centre, Near Waves Club, Bhayli, Vadodara 391410",
    phone: "+91 80-69578082", email: "stargamezone.in@gmail.com",
    hoursShort: "Open Daily: 10 AM – 10 PM", hoursLong: "Mon–Sun: 10 AM – 10 PM",
    adminPassword: "admin123",
  },
  hero: {
    badge: "🕹️ Vadodara's Premier Game Zone · Bhayli",
    titleStart: "Star ", titleAccent: "Game Zone", subtitle: "Play PS4 & PS5 in Vadodara",
    description: "The ultimate destination for real fun, virtual adventures, and unforgettable gaming experiences.",
    ctaPrimary: "🎮 Book Now", ctaSecondary: "Explore Games →",
    stats: [{ value:"8+", label:"Games" },{ value:"500+", label:"Players" },{ value:"4.9★", label:"Rating" },{ value:"3Yrs", label:"Running" }],
    floatCards: [{ icon:"🎮", label:"PS5 Gaming" },{ icon:"🏆", label:"Tournaments" },{ icon:"⭐", label:"Vadodara #1" }],
  },
  features: {
    eyebrow: "Why Choose Us", heading: "The Star Difference",
    items: [
      { icon:"🎯", title:"Cutting-Edge Games", desc:"PS4, PS5 — always updated with newest releases." },
      { icon:"🛡️", title:"Safe & Supervised", desc:"Trained staff, perfect for all ages." },
      { icon:"⚡", title:"Smooth Booking", desc:"Book & pay online in 2 minutes." },
      { icon:"🎉", title:"Events & Parties", desc:"Birthdays, school trips, corporate events." },
    ],
  },
  about: {
    eyebrow: "About Us", headingLine1: "Unleashing Fun,", headingLine2: "One Game at a Time",
    para1: "Star Game Zone is more than a game center — a family-friendly hub packed with PS4, PS5 experiences for all ages.",
    para2: "Whether you're 5 or 55, every visit is memorable, every game epic.",
    stats: [{ value:"500+", label:"Happy Players" },{ value:"8+", label:"Game Titles" },{ value:"3+", label:"Years Running" },{ value:"4.9", label:"Star Rating" }],
  },
  games: { eyebrow: "Game Library", heading: "Our Games" },
  partner: {
    eyebrow: "Partner Branch", heading: "Sharmaji Food & Game",
    description: "Craving great food alongside your gaming? Visit our partner branch — same Star experience, even more to enjoy.",
    cta: "Book at Sharmaji Food & Game →",
  },
  contact: {
    eyebrow: "Get In Touch", heading: "Contact Us",
    description: "Have a question or want to plan a special event? We'd love to hear from you.",
  },
  footer: {
    tagline: "Vadodara's ultimate PS4 & PS5 gaming destination in Bhayli.",
    copyright: "©2025 Star Game Zone. All Rights Reserved.",
    platformLinks: ["PS4 Games","PS5 Games","Multiplayer","Tournaments"],
  },
  payment: {
    upiId: "stargamezone@upi",
    methods: [
      { id:PAYMENT_METHODS.UPI,    icon:"📱", label:"UPI / GPay / PhonePe",  sub:"Pay instantly via UPI" },
      { id:PAYMENT_METHODS.CARD,   icon:"💳", label:"Credit / Debit Card",    sub:"Visa, Mastercard, RuPay" },
      { id:PAYMENT_METHODS.ONLINE, icon:"🏦", label:"Net Banking / Wallets", sub:"Other online payment methods" },
    ],
  },
};

const Y = "#f5c842"; const YD = "#c9981a"; const BG = "#0d0618"; const BG2 = "#130a22";
const BRANCH_COLORS = [Y, "#6cc8ff", "#9b8cff", "#5fd0a0", "#ff9d3a", "#ff6b8a"];

const loadLS = (k, f) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const normalizeBooking = (b) => {
  const branchId = b.branchId || DEFAULT_BRANCHES[0].id;
  const legacyStatus = b.bookingStatus || b.status || BOOKING_STATUS.PENDING;
  return {
    id: b.id, branchId,
    branchName: b.branchName || (DEFAULT_BRANCHES.find(x => x.id===branchId)||{}).name || DEFAULT_BRANCHES[0].name,
    customerName: b.customerName ?? b.name ?? "", phone: b.phone || "", email: b.email || "",
    game: b.game || "", date: b.date || "", slot: b.slot || "", players: b.players || 1, amount: b.amount || 0,
    paymentMethod: b.paymentMethod || PAYMENT_METHODS.UPI,
    paymentStatus: b.paymentStatus || (legacyStatus===BOOKING_STATUS.CONFIRMED ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNPAID),
    bookingStatus: legacyStatus,
  };
};

export default function App() {
  const [view, setView] = useState("desktop");
  const [page, setPage] = useState("home");

  const [branches, setBranches] = useState(() => loadLS("sgz_branches", DEFAULT_BRANCHES));
  const firstBranchId = (branches[0] || DEFAULT_BRANCHES[0]).id;

  // booking flow: 1 Branch, 2 Game, 3 Details, 4 Date&Slot, 5 Payment
  const [bStep, setBStep] = useState(1);
  const [selGame, setSelGame] = useState(null);
  const [bk, setBk] = useState(() => ({ branchId: firstBranchId, name:"", phone:"", email:"", date:"", slot:"", players:1 }));
  const [pay, setPay] = useState(PAYMENT_METHODS.UPI);
  const [done, setDone] = useState(false);
  const [bkId, setBkId] = useState("");

  const [bookings, setBookings] = useState(() => loadLS("sgz_bookings", DEFAULT_BOOKINGS).map(normalizeBooking));
  const [games, setGames] = useState(() => loadLS("sgz_games", DEFAULT_GAMES));
  const [slots, setSlots] = useState(() => loadLS("sgz_slots", DEFAULT_SLOTS));
  const [settings, setSettings] = useState(() => {
    const s = loadLS("sgz_settings", null);
    return s ? { ...DEFAULT_SETTINGS, ...s,
      business:{...DEFAULT_SETTINGS.business,...(s.business||{})}, hero:{...DEFAULT_SETTINGS.hero,...(s.hero||{})},
      features:{...DEFAULT_SETTINGS.features,...(s.features||{})}, about:{...DEFAULT_SETTINGS.about,...(s.about||{})},
      games:{...DEFAULT_SETTINGS.games,...(s.games||{})}, partner:{...DEFAULT_SETTINGS.partner,...(s.partner||{})},
      contact:{...DEFAULT_SETTINGS.contact,...(s.contact||{})}, footer:{...DEFAULT_SETTINGS.footer,...(s.footer||{})},
      payment:{...DEFAULT_SETTINGS.payment,...(s.payment||{})},
    } : DEFAULT_SETTINGS;
  });
  const [customCats, setCustomCats] = useState(() => loadLS("sgz_customCats", []));

  useEffect(() => saveLS("sgz_branches", branches), [branches]);
  useEffect(() => saveLS("sgz_bookings", bookings), [bookings]);
  useEffect(() => saveLS("sgz_games", games), [games]);
  useEffect(() => saveLS("sgz_slots", slots), [slots]);
  useEffect(() => saveLS("sgz_settings", settings), [settings]);
  useEffect(() => saveLS("sgz_customCats", customCats), [customCats]);

  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState(false);
  const [adminTab, setAdminTab] = useState("bookings");
  const [moreOpen, setMoreOpen] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  const [gFilter, setGFilter] = useState("All");
  const [detGame, setDetGame] = useState(null);
  const [contactForm, setContactForm] = useState({ name:"", email:"", msg:"" });
  const [contactSent, setContactSent] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [cBk, setCBk] = useState({ branchId: firstBranchId, game:"", date:"", slot:"", customerName:"", phone:"", email:"", players:1, paymentMethod:PAYMENT_METHODS.PAY_AT_STORE, paymentStatus:PAYMENT_STATUS.UNPAID, bookingStatus:BOOKING_STATUS.PENDING });
  const [cBkMsg, setCBkMsg] = useState("");

  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📋");
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", subcat:"", price:"", desc:"" });
  const [editGameOpen, setEditGameOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [newSlot, setNewSlot] = useState("");
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Sharmaji Ki Chai food ordering
  const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXX"; // ← put your Razorpay Key ID here (needs a live host + backend to verify the payment signature)
  const [menu, setMenu] = useState(() => loadLS("sgz_menu", SHARMAJI_MENU.map(m => ({ ...m, available:true }))));
  const [menuCats, setMenuCats] = useState(() => loadLS("sgz_menuCats", SHARMAJI_CATS));
  const [foodOpen, setFoodOpen] = useState(false);
  const [foodStep, setFoodStep] = useState(1); // 1 items, 2 details, 3 payment
  const [foodDone, setFoodDone] = useState(false);
  const [foodOrderId, setFoodOrderId] = useState("");
  const [cart, setCart] = useState([]);
  const [foodInfo, setFoodInfo] = useState({ name:"", phone:"" });
  const [foodCat, setFoodCat] = useState("All");
  const [payProcessing, setPayProcessing] = useState(false);
  const [foodSearch, setFoodSearch] = useState("");
  const [foodOrders, setFoodOrders] = useState(() => loadLS("sgz_foodOrders", []));
  const [messages, setMessages] = useState(() => loadLS("sgz_messages", []));
  const [msgSearch, setMsgSearch] = useState("");
  useEffect(() => saveLS("sgz_foodOrders", foodOrders), [foodOrders]);
  useEffect(() => saveLS("sgz_messages", messages), [messages]);
  useEffect(() => saveLS("sgz_menu", menu), [menu]);
  useEffect(() => saveLS("sgz_menuCats", menuCats), [menuCats]);

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const qtyInCart = (id) => cart.find(x => x.id===id)?.qty || 0;
  const addToCart = (it) => setCart(p => { const f = p.find(x => x.id===it.id); return f ? p.map(x => x.id===it.id ? {...x, qty:x.qty+1} : x) : [...p, { id:it.id, name:it.name, price:it.price, qty:1 }]; });
  const decFromCart = (id) => setCart(p => p.flatMap(x => x.id===id ? (x.qty>1 ? [{...x, qty:x.qty-1}] : []) : [x]));
  const openFood = () => { setFoodStep(1); setFoodDone(false); setFoodCat("All"); setFoodOpen(true); };
  const placeFoodOrder = () => {
    const id = "FO" + Math.floor(Math.random()*9000+1000);
    setFoodOrderId(id);
    setFoodOrders(p => [{ id, customerName:foodInfo.name, phone:foodInfo.phone, items:cart.map(c => ({...c})), total:cartTotal, paymentMethod:"razorpay", paymentStatus:PAYMENT_STATUS.PAID, status:"placed", createdAt:new Date().toISOString() }, ...p]);
    setFoodDone(true);
  };
  // Razorpay: real checkout when hosted (window.Razorpay + your Key ID); simulated in this preview sandbox.
  const payWithRazorpay = () => {
    if (typeof window !== "undefined" && window.Razorpay && RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes("XXXX")) {
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: cartTotal * 100, // paise
        currency: "INR",
        name: "Sharmaji Ki Chai",
        description: `Order · ${cartCount} item(s)`,
        prefill: { name: foodInfo.name, contact: foodInfo.phone },
        theme: { color: "#f5c842" },
        handler: () => { placeFoodOrder(); }, // ← in production: verify the payment signature on your server BEFORE placing the order
        modal: { ondismiss: () => setPayProcessing(false) },
      });
      if (rzp.on) rzp.on("payment.failed", () => setPayProcessing(false));
      rzp.open();
      return;
    }
    // Preview fallback (no backend / script available here): simulate a confirmed payment
    setPayProcessing(true);
    setTimeout(() => { setPayProcessing(false); placeFoodOrder(); }, 1400);
  };

  const [particles] = useState(() =>
    Array.from({length:22}, (_,i) => ({ id:i, x:Math.random()*100, y:Math.random()*100, s:Math.random()*2+1, dur:5+Math.random()*6, del:Math.random()*4, op:Math.random()*0.35+0.08 }))
  );

  const isMob = view === "mobile";
  const total = selGame ? selGame.price * bk.players : 0;
  const S = settings;

  const customerMethods = S.payment.methods.filter(m => m.id !== PAYMENT_METHODS.PAY_AT_STORE && m.id !== "cash");
  const partnerBranch = branches.find(b => /sharmaji/i.test(b.name)) || null;

  const freshBk = (branchId) => ({ branchId: branchId || firstBranchId, name:"", phone:"", email:"", date:"", slot:"", players:1 });
  const openBooking = (branchId=null, game=null) => { setBk(freshBk(branchId)); setSelGame(game); setBStep(1); setDone(false); setPage("booking"); };
  const openPartnerSite = () => window.open(PARTNER_BUSINESS.url, "_blank", "noopener,noreferrer");

  const updateS = (path, value) => {
    setSettings(prev => { const next = JSON.parse(JSON.stringify(prev)); const keys = path.split("."); let o = next; for (let i=0;i<keys.length-1;i++) o = o[keys[i]]; o[keys[keys.length-1]] = value; return next; });
  };
  const updateBranch = (id, key, val) => setBranches(p => p.map(b => b.id===id ? {...b, [key]:val} : b));

  useEffect(() => {
    if (!isMob) { const fn = () => setScrollY(window.scrollY); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }
  }, [isMob]);

  const goTo = (id) => {
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }), 160); }
    else { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); }
  };

  const submitBooking = () => {
    const id = "SGZ" + Math.floor(Math.random()*9000+1000);
    const branch = branches.find(b => b.id===bk.branchId) || branches[0];
    setBkId(id);
    setBookings(p => [{
      id, branchId: branch.id, branchName: branch.name,
      customerName: bk.name, phone: bk.phone, email: bk.email,
      game: selGame.title, date: bk.date, slot: bk.slot, players: bk.players, amount: total,
      paymentMethod: pay, paymentStatus: PAYMENT_STATUS.PAID, bookingStatus: BOOKING_STATUS.CONFIRMED,
    }, ...p]);
    setDone(true);
  };

  // shared styles
  const inp = { width:"100%", padding:"11px 13px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"5px", color:"#fff", fontSize:"0.9rem", fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.25s" };
  const lbl = { display:"block", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", fontWeight:700, marginBottom:"4px", fontFamily:"'Inter',sans-serif" };
  const fg = { marginBottom:"1rem" };
  const gradTxt = { background:`linear-gradient(135deg,${Y} 0%,#fff 80%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" };
  const secLbl = { display:"block", fontSize:"0.6rem", letterSpacing:"0.35em", textTransform:"uppercase", color:Y, fontWeight:700, marginBottom:"0.5rem", fontFamily:"'Inter',sans-serif" };
  const secH = { fontSize: isMob ? "clamp(1.7rem,7vw,2.4rem)" : "clamp(2rem,4vw,3rem)", fontWeight:900, letterSpacing:"-0.02em", textTransform:"uppercase", lineHeight:1.05, marginBottom:"0.6rem", fontFamily:"'Rajdhani',sans-serif" };
  const btnY = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"10px 24px", background:`linear-gradient(135deg,${Y},${YD})`, color:"#0d0618", border:"none", borderRadius:"5px", fontSize:"0.78rem", fontWeight:900, letterSpacing:"0.13em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif" };
  const btnO = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"10px 22px", background:"transparent", color:"#fff", border:`1px solid rgba(245,200,66,0.35)`, borderRadius:"5px", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif" };
  const mBox = { background:"#130a22", border:`1px solid rgba(245,200,66,0.4)`, borderRadius:"10px", padding: isMob ? "1.4rem" : "2rem", width:"100%", maxWidth:"500px", maxHeight:"90vh", overflowY:"auto", position:"relative", fontFamily:"'Rajdhani',sans-serif" };
  const adminCard = { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"8px", padding:"1.4rem", marginBottom:"1rem" };
  const adminCardTitle = { fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"1rem", fontSize:"0.86rem", fontFamily:"'Rajdhani',sans-serif" };

  const badge = (text, color) => (
    <span style={{ padding:"3px 8px", borderRadius:"3px", fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", background:`${color}1a`, color, border:`1px solid ${color}40`, whiteSpace:"nowrap", display:"inline-block" }}>{text}</span>
  );
  const branchNameOf = (id) => (branches.find(b => b.id===id)||{}).name || id;
  const branchColor = (id) => { const i = branches.findIndex(b => b.id===id); return BRANCH_COLORS[(i<0?0:i) % BRANCH_COLORS.length]; };
  const methodLabel = (m) => m===PAYMENT_METHODS.UPI?"UPI":m===PAYMENT_METHODS.CARD?"Card":m===PAYMENT_METHODS.ONLINE?"Online":m===PAYMENT_METHODS.PAY_AT_STORE?"Pay at Store":(S.payment.methods.find(x=>x.id===m)?.label||m);
  const bStatusColor = (s) => s===BOOKING_STATUS.CONFIRMED?"#00C864":s===BOOKING_STATUS.PENDING?Y:"#ff6b4a";
  const pStatusColor = (s) => s===PAYMENT_STATUS.PAID?"#00C864":"#ff9d3a";

  const settingsRef = useRef(settings); settingsRef.current = settings;
  // Stable identity so typing in admin fields doesn't lose focus; reads latest settings via ref.
  const Field = useMemo(() => function Field({ label, path, type="text", multi=false }) {
    const keys = path.split("."); let val = settingsRef.current; for (const k of keys) val = val?.[k];
    return (
      <div style={fg}><label style={lbl}>{label}</label>
        {multi ? <textarea style={{...inp, minHeight:"68px", resize:"vertical"}} value={val||""} onChange={e => updateS(path, e.target.value)}/>
               : <input style={inp} type={type} value={val||""} onChange={e => updateS(path, e.target.value)}/>}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    ::-webkit-scrollbar { width:4px; background:${BG}; }
    ::-webkit-scrollbar-thumb { background:rgba(245,200,66,0.25); border-radius:4px; }
    @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes glowBtn { 0%,100%{box-shadow:0 0 18px rgba(245,200,66,0.3),0 3px 12px rgba(245,200,66,0.2)} 50%{box-shadow:0 0 38px rgba(245,200,66,0.55),0 5px 22px rgba(245,200,66,0.35)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    .fu { animation: fadeUp 0.75s ease both; }
    .glow { animation: glowBtn 2.8s ease-in-out infinite; }
    .fl1 { animation: floatY 6s ease-in-out infinite; }
    .fl2 { animation: floatY 8s ease-in-out infinite 1.2s; }
    .fl3 { animation: floatY 7s ease-in-out infinite 2.4s; }
    .gc { background:${BG}; transition:background 0.22s, transform 0.3s, box-shadow 0.3s; }
    .gc:hover { background:#170d2e; transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,200,66,0.18); }
    input:focus, textarea:focus, select:focus { outline:none; border-color:rgba(245,200,66,0.5) !important; box-shadow: 0 0 0 3px rgba(245,200,66,0.07); }
    .nb { background:none; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; }
    .btab { display:flex; flex-direction:column; align-items:center; gap:2px; padding:6px 0; cursor:pointer; flex:1; color:rgba(255,255,255,0.45); transition:color 0.2s; font-size:0.58rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; background:none; border:none; }
    .btab:hover { color:${Y}; }
    .slot { padding:8px 3px; border-radius:4px; font-size:0.72rem; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.18s; }
    .slot:hover { border-color:rgba(245,200,66,0.4) !important; color:${Y} !important; }
    .prow { transition:border-color 0.2s; cursor:pointer; }
    .prow:hover { border-color:rgba(245,200,66,0.35) !important; }
    select option { background:${BG2}; color:#fff; }
    .gfbadge { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease; }
    .gfbadge:hover { transform: translateY(-2px); opacity: 1 !important; box-shadow: 0 10px 34px rgba(139,92,246,0.5); border-color: rgba(167,139,250,0.65) !important; }
    @keyframes gfStar { 0%,100%{opacity:0.5; transform:scale(0.85)} 50%{opacity:1; transform:scale(1.15)} }
    .gfstar { animation: gfStar 2.6s ease-in-out infinite; }
  `;

  const gameCategories = [...new Set(games.map(g => g.category))];

  // ════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ════════════════════════════════════════════════════════════════
  if (page === "admin") {
    if (!adminAuth) return (
      <div style={{ fontFamily:"'Rajdhani',sans-serif", background:BG, color:"#fff", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{CSS}</style>
        <div style={{ background:BG2, border:`1px solid rgba(245,200,66,0.35)`, borderRadius:"10px", padding:"2rem", width:"100%", maxWidth:"360px" }}>
          <div style={{ textAlign:"center", marginBottom:"1.6rem" }}>
            <div style={{ fontSize:"1.25rem", fontWeight:900, ...gradTxt, textTransform:"uppercase", letterSpacing:"0.07em" }}>{S.business.brandIcon} {S.business.brandName}</div>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.74rem", fontFamily:"'Inter',sans-serif", marginTop:"4px" }}>Staff / Owner Portal</div>
          </div>
          <div style={fg}>
            <label style={lbl}>Admin Password</label>
            <input type="password" style={{ ...inp, borderColor: adminErr ? `rgba(245,200,66,0.55)` : undefined }} placeholder="Enter password" value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter") { adminPass===S.business.adminPassword ? (setAdminAuth(true),setAdminErr(false)) : setAdminErr(true); }}}/>
            {adminErr && <div style={{ color:Y, fontSize:"0.74rem", marginTop:"4px", fontFamily:"'Inter',sans-serif" }}>Incorrect password.</div>}
          </div>
          <button className="glow" style={{ ...btnY, width:"100%" }} onClick={() => adminPass===S.business.adminPassword ? (setAdminAuth(true),setAdminErr(false)) : setAdminErr(true)}>Login to Dashboard</button>
          <div style={{ textAlign:"center", marginTop:"1rem" }}><span style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.72rem", cursor:"pointer", fontFamily:"'Inter',sans-serif" }} onClick={() => setPage("home")}>← Back to Website</span></div>
        </div>
      </div>
    );

    const paid = bookings.filter(b => b.paymentStatus===PAYMENT_STATUS.PAID);
    const revenueFor = (id) => paid.filter(b => b.branchId===id).reduce((s,b)=>s+b.amount,0);
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.bookingStatus===BOOKING_STATUS.CONFIRMED).length,
      pending: bookings.filter(b => b.bookingStatus===BOOKING_STATUS.PENDING).length,
      revenue: paid.reduce((s,b)=>s+b.amount,0),
    };
    const filteredBookings = bookings.filter(b => branchFilter==="all" || b.branchId===branchFilter);

    const PRIMARY_TABS = [
      ["bookings","📋 Bookings"],["create","➕ Create Booking"],["sharmajiOrders","🍵 Sharmaji Orders"],["menu","📖 Menu"],
    ];
    const unreadMsgs = messages.filter(m => !m.read).length;
    const MORE_TABS = [
      ["messages", `📬 Messages${unreadMsgs ? ` (${unreadMsgs})` : ""}`],
      ["branches","🏢 Branches"],["games","🎮 Games"],["slots","⏰ Slots"],["hero","🏠 Hero"],["features","✨ Features"],
      ["about","ℹ️ About"],["partner","🍽️ Partner"],["contact","📞 Contact"],["footer","🦶 Footer"],
      ["payment","💳 Payment"],["business","⚙️ Business"],
    ];
    // Is the currently-active tab one that lives inside the "More" group (or a custom tab)?
    const activeIsMore = MORE_TABS.some(([t]) => t===adminTab) || customCats.some(c => c.id===adminTab);
    const actBtn = (color,bg,brd) => ({ padding:"3px 8px", background:bg, border:`1px solid ${brd}`, borderRadius:"3px", color, fontSize:"0.6rem", fontWeight:700, whiteSpace:"nowrap" });
    const cBkGame = games.find(g => g.title===cBk.game);
    const cBkAmount = (cBkGame ? cBkGame.price : 0) * cBk.players;

    return (
      <div style={{ fontFamily:"'Rajdhani',sans-serif", background:BG, color:"#fff", minHeight:"100vh" }}>
        <style>{CSS}</style>
        <div style={{ maxWidth:"1300px", margin:"0 auto", padding:"1.5rem 1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontSize:"1.2rem", fontWeight:900, ...gradTxt, textTransform:"uppercase" }}>{S.business.brandIcon} {S.business.brandName}</div>
              <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.62rem", letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Admin Dashboard</div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.76rem", fontFamily:"'Inter',sans-serif" }}>Owner</span>
              <button style={{ ...btnO, padding:"7px 16px", fontSize:"0.7rem" }} onClick={() => { setAdminAuth(false); setAdminPass(""); setPage("home"); }}>Logout</button>
            </div>
          </div>

          {/* Stats: core + per-branch revenue */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"0.7rem", marginBottom:"1.4rem" }}>
            {[["📋","Total",stats.total],["✅","Confirmed",stats.confirmed],["⏳","Pending",stats.pending],["💰","Total Revenue",`₹${stats.revenue}`]].map(([i,l,v]) => (
              <div key={l} style={{ textAlign:"center", padding:"1.1rem", background:"rgba(245,200,66,0.04)", border:`1px solid rgba(245,200,66,0.12)`, borderRadius:"8px" }}>
                <div style={{ fontSize:"1.1rem" }}>{i}</div>
                <div style={{ fontSize:"1.55rem", fontWeight:900, ...gradTxt, lineHeight:1.1 }}>{v}</div>
                <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.55rem", letterSpacing:"0.13em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", marginTop:"2px" }}>{l}</div>
              </div>
            ))}
            {branches.map((br,i) => (
              <div key={br.id} style={{ textAlign:"center", padding:"1.1rem", background:`${BRANCH_COLORS[i%BRANCH_COLORS.length]}11`, border:`1px solid ${BRANCH_COLORS[i%BRANCH_COLORS.length]}33`, borderRadius:"8px" }}>
                <div style={{ fontSize:"1.1rem" }}>{br.icon}</div>
                <div style={{ fontSize:"1.55rem", fontWeight:900, ...gradTxt, lineHeight:1.1 }}>₹{revenueFor(br.id)}</div>
                <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", marginTop:"2px" }}>{br.name} Revenue</div>
              </div>
            ))}
          </div>

          {/* Tabs — primary 4 always visible; everything else tucked under "More" */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.3rem", flexWrap:"wrap", position:"relative" }}>
            <div style={{ display:"flex", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"6px", overflow:"hidden", flexWrap:"wrap" }}>
              {PRIMARY_TABS.map(([t,l]) => (
                <button key={t} className="nb" onClick={() => { setAdminTab(t); setMoreOpen(false); }} style={{ padding:"8px 15px", fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", background: adminTab===t ? "rgba(245,200,66,0.12)" : "transparent", color: adminTab===t ? Y : "rgba(255,255,255,0.3)" }}>{l}</button>
              ))}
            </div>

            {/* More dropdown: holds all the site-settings/content tabs + custom tabs */}
            <div style={{ position:"relative" }}>
              <button className="nb" onClick={() => setMoreOpen(o => !o)} style={{ position:"relative", padding:"8px 15px", fontSize:"0.67rem", fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", borderRadius:"6px", border:`1px solid ${activeIsMore ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.08)"}`, background: activeIsMore ? "rgba(245,200,66,0.12)" : "rgba(255,255,255,0.02)", color: activeIsMore ? Y : "rgba(255,255,255,0.45)", display:"flex", alignItems:"center", gap:"6px" }}>
                ⚙️ More <span style={{ fontSize:"0.6rem", transform: moreOpen ? "rotate(180deg)" : "none", transition:"transform 0.18s" }}>▾</span>
                {unreadMsgs>0 && <span style={{ position:"absolute", top:"-5px", right:"-5px", minWidth:"16px", height:"16px", padding:"0 4px", borderRadius:"999px", background:"#ff4a6a", color:"#fff", fontSize:"0.56rem", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 8px rgba(255,74,106,0.6)" }}>{unreadMsgs}</span>}
              </button>
              {moreOpen && (
                <>
                  <div onClick={() => setMoreOpen(false)} style={{ position:"fixed", inset:0, zIndex:40 }}/>
                  <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:50, background:BG2, border:"1px solid rgba(245,200,66,0.22)", borderRadius:"8px", padding:"6px", minWidth:"210px", boxShadow:"0 16px 40px rgba(0,0,0,0.55)", maxHeight:"60vh", overflowY:"auto" }}>
                    {MORE_TABS.map(([t,l]) => (
                      <button key={t} className="nb" onClick={() => { setAdminTab(t); setMoreOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", borderRadius:"5px", background: adminTab===t ? "rgba(245,200,66,0.14)" : "transparent", color: adminTab===t ? Y : "rgba(255,255,255,0.55)" }}>{l}</button>
                    ))}
                    {customCats.length>0 && <div style={{ height:"1px", background:"rgba(255,255,255,0.07)", margin:"5px 4px" }}/>}
                    {customCats.map(c => (
                      <button key={c.id} className="nb" onClick={() => { setAdminTab(c.id); setMoreOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", borderRadius:"5px", background: adminTab===c.id ? "rgba(245,200,66,0.14)" : "transparent", color: adminTab===c.id ? Y : "rgba(255,255,255,0.55)" }}>{c.icon} {c.name}</button>
                    ))}
                    <div style={{ height:"1px", background:"rgba(255,255,255,0.07)", margin:"5px 4px" }}/>
                    <button className="nb" onClick={() => { setNewCatName(""); setNewCatIcon("📋"); setAddCatOpen(true); setMoreOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", borderRadius:"5px", background:"transparent", color:Y }}>＋ Add Custom Tab</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BOOKINGS */}
          {adminTab==="bookings" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"1rem", flexWrap:"wrap" }}>
                <label style={{ ...lbl, marginBottom:0 }}>Branch</label>
                <select style={{ ...inp, maxWidth:"260px", cursor:"pointer" }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
                  <option value="all">All Branches</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif" }}>{filteredBookings.length} booking{filteredBookings.length===1?"":"s"}</span>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"1000px" }}>
                  <thead><tr>{["ID","Branch","Customer","Game","Date","Slot","Players","Amount","Method","Payment","Status","Action"].map(h =>
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", borderBottom:"1px solid rgba(255,255,255,0.05)", fontWeight:700 }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding:"10px", fontWeight:700, color:Y, fontSize:"0.84rem" }}>{b.id}</td>
                        <td style={{ padding:"10px" }}>{badge(b.branchName, branchColor(b.branchId))}</td>
                        <td style={{ padding:"10px", fontFamily:"'Inter',sans-serif", fontSize:"0.81rem" }}><div style={{ fontWeight:600, color:"rgba(255,255,255,0.8)" }}>{b.customerName}</div><div style={{ fontSize:"0.69rem", color:"rgba(255,255,255,0.28)" }}>{b.phone}</div></td>
                        <td style={{ padding:"10px", color:"rgba(255,255,255,0.6)", fontFamily:"'Inter',sans-serif", fontSize:"0.81rem" }}>{b.game}</td>
                        <td style={{ padding:"10px", color:"rgba(255,255,255,0.55)", fontFamily:"'Inter',sans-serif", fontSize:"0.81rem" }}>{b.date}</td>
                        <td style={{ padding:"10px", color:"rgba(255,255,255,0.55)", fontFamily:"'Inter',sans-serif", fontSize:"0.81rem" }}>{b.slot}</td>
                        <td style={{ padding:"10px", color:"rgba(255,255,255,0.55)", textAlign:"center", fontFamily:"'Inter',sans-serif", fontSize:"0.81rem" }}>{b.players}</td>
                        <td style={{ padding:"10px", fontWeight:700, color:Y, fontSize:"0.86rem" }}>₹{b.amount}</td>
                        <td style={{ padding:"10px" }}>{badge(methodLabel(b.paymentMethod), "#8a7fb0")}</td>
                        <td style={{ padding:"10px" }}>{badge(b.paymentStatus, pStatusColor(b.paymentStatus))}</td>
                        <td style={{ padding:"10px" }}>{badge(b.bookingStatus, bStatusColor(b.bookingStatus))}</td>
                        <td style={{ padding:"10px" }}>
                          <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                            {b.bookingStatus!==BOOKING_STATUS.CONFIRMED && <button className="nb" onClick={() => setBookings(p => p.map(x => x.id===b.id ? {...x,bookingStatus:BOOKING_STATUS.CONFIRMED} : x))} style={actBtn("#00C864","rgba(0,200,100,0.08)","rgba(0,200,100,0.18)")}>CONFIRM</button>}
                            {b.bookingStatus!==BOOKING_STATUS.CANCELLED && <button className="nb" onClick={() => setBookings(p => p.map(x => x.id===b.id ? {...x,bookingStatus:BOOKING_STATUS.CANCELLED} : x))} style={actBtn("#ff6b4a","rgba(255,70,50,0.08)","rgba(255,70,50,0.18)")}>CANCEL</button>}
                            {b.paymentStatus!==PAYMENT_STATUS.PAID && <button className="nb" onClick={() => setBookings(p => p.map(x => x.id===b.id ? {...x,paymentStatus:PAYMENT_STATUS.PAID} : x))} style={actBtn("#00C864","rgba(0,200,100,0.08)","rgba(0,200,100,0.18)")}>MARK PAID</button>}
                            {b.paymentStatus!==PAYMENT_STATUS.UNPAID && <button className="nb" onClick={() => setBookings(p => p.map(x => x.id===b.id ? {...x,paymentStatus:PAYMENT_STATUS.UNPAID} : x))} style={actBtn("#ff9d3a","rgba(255,150,50,0.08)","rgba(255,150,50,0.2)")}>MARK UNPAID</button>}
                            <button className="nb" onClick={() => { if(window.confirm("Delete this booking?")) setBookings(p => p.filter(x => x.id!==b.id)); }} style={actBtn("rgba(255,255,255,0.5)","rgba(255,255,255,0.04)","rgba(255,255,255,0.1)")}>DEL</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length===0 && <tr><td colSpan={12} style={{ padding:"2rem", textAlign:"center", color:"rgba(255,255,255,0.25)", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem" }}>No bookings for this branch.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CREATE BOOKING */}
          {adminTab==="create" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}>
                <div style={adminCardTitle}>Create Booking (Walk-in / Manual)</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Branch</label>
                    <select style={inp} value={cBk.branchId} onChange={e => setCBk({...cBk, branchId:e.target.value})}>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                  </div>
                  <div style={fg}><label style={lbl}>Game</label>
                    <select style={inp} value={cBk.game} onChange={e => setCBk({...cBk, game:e.target.value})}><option value="">— Select game —</option>{games.map(g => <option key={g.id} value={g.title}>{g.title} (₹{g.price})</option>)}</select>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Date</label><input type="date" style={inp} value={cBk.date} onChange={e => setCBk({...cBk, date:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Slot</label><select style={inp} value={cBk.slot} onChange={e => setCBk({...cBk, slot:e.target.value})}><option value="">— Select slot —</option>{slots.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
                <div style={fg}><label style={lbl}>Customer Name *</label><input style={inp} value={cBk.customerName} onChange={e => setCBk({...cBk, customerName:e.target.value})}/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Phone *</label><input style={inp} value={cBk.phone} onChange={e => setCBk({...cBk, phone:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Email (optional)</label><input style={inp} value={cBk.email} onChange={e => setCBk({...cBk, email:e.target.value})}/></div>
                </div>
                <div style={fg}><label style={lbl}>Number of Players</label>
                  <div style={{ display:"flex", gap:"5px" }}>{[1,2,3,4].map(n => <button key={n} className="nb" onClick={() => setCBk({...cBk, players:n})} style={{ flex:1, padding:"9px", border:"1px solid", borderColor: cBk.players===n ? Y : "rgba(255,255,255,0.09)", borderRadius:"4px", background: cBk.players===n ? "rgba(245,200,66,0.1)" : "transparent", color: cBk.players===n ? Y : "rgba(255,255,255,0.38)", fontWeight:700, fontSize:"0.86rem" }}>{n}</button>)}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Payment Method</label>
                    <select style={inp} value={cBk.paymentMethod} onChange={e => setCBk({...cBk, paymentMethod:e.target.value})}>
                      <option value={PAYMENT_METHODS.UPI}>UPI</option><option value={PAYMENT_METHODS.CARD}>Card</option><option value={PAYMENT_METHODS.PAY_AT_STORE}>Pay at Store</option>
                    </select>
                  </div>
                  <div style={fg}><label style={lbl}>Payment Status</label>
                    <select style={inp} value={cBk.paymentStatus} onChange={e => setCBk({...cBk, paymentStatus:e.target.value})}><option value={PAYMENT_STATUS.UNPAID}>Unpaid</option><option value={PAYMENT_STATUS.PAID}>Paid</option></select>
                  </div>
                  <div style={fg}><label style={lbl}>Booking Status</label>
                    <select style={inp} value={cBk.bookingStatus} onChange={e => setCBk({...cBk, bookingStatus:e.target.value})}><option value={BOOKING_STATUS.PENDING}>Pending</option><option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option><option value={BOOKING_STATUS.CANCELLED}>Cancelled</option></select>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.7rem 0.85rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:"5px", marginBottom:"1rem" }}>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", color:"rgba(255,255,255,0.45)" }}>Amount ({cBk.players} × ₹{cBkGame ? cBkGame.price : 0})</span>
                  <span style={{ fontWeight:900, color:Y, fontSize:"1.1rem" }}>₹{cBkAmount}</span>
                </div>
                {cBkMsg && <div style={{ color:"#00C864", fontSize:"0.8rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.7rem" }}>{cBkMsg}</div>}
                <button style={{ ...btnY, width:"100%" }} onClick={() => {
                  if(!cBk.customerName.trim() || !cBk.phone.trim() || !cBk.game || !cBk.date || !cBk.slot){ alert("Please fill branch, game, date, slot, customer name and phone."); return; }
                  const branch = branches.find(b => b.id===cBk.branchId) || branches[0];
                  const id = "SGZ" + Math.floor(Math.random()*9000+1000);
                  setBookings(p => [{ id, branchId:branch.id, branchName:branch.name, customerName:cBk.customerName.trim(), phone:cBk.phone.trim(), email:cBk.email.trim(), game:cBk.game, date:cBk.date, slot:cBk.slot, players:cBk.players, amount:cBkAmount, paymentMethod:cBk.paymentMethod, paymentStatus:cBk.paymentStatus, bookingStatus:cBk.bookingStatus }, ...p]);
                  setCBkMsg(`Booking ${id} created for ${cBk.customerName.trim()}.`);
                  setCBk({ branchId:firstBranchId, game:"", date:"", slot:"", customerName:"", phone:"", email:"", players:1, paymentMethod:PAYMENT_METHODS.PAY_AT_STORE, paymentStatus:PAYMENT_STATUS.UNPAID, bookingStatus:BOOKING_STATUS.PENDING });
                }}>Create Booking</button>
              </div>
            </div>
          )}

          {/* SHARMAJI ORDERS (food orders, confirmed after Razorpay payment) */}
          {adminTab==="sharmajiOrders" && (() => {
            const q = foodSearch.trim().toLowerCase();
            const list = foodOrders.filter(o => !q || o.id.toLowerCase().includes(q) || (o.customerName||"").toLowerCase().includes(q));
            const fsc = (s) => ({ placed:Y, preparing:"#ff9d3a", ready:"#6cc8ff", delivered:"#00C864", cancelled:"#ff6b4a" }[s] || Y);
            const setStatus = (id,st) => setFoodOrders(p => p.map(o => o.id===id ? {...o, status:st} : o));
            // Opens WhatsApp pre-filled with the "preparing" message to the customer.
            // This is the no-backend option: it launches WhatsApp (web/app) so the owner taps Send.
            // For TRULY automatic (no tap) SMS/WhatsApp, see the notes — that needs a server + provider.
            const waNotify = (o) => {
              const digits = String(o.phone || "").replace(/\D/g, "");
              if (!digits) { alert("This order has no phone number, so no message can be sent."); return; }
              const intl = digits.length === 10 ? "91" + digits : digits; // assume India if 10 digits
              const msg = `Namaste ${o.customerName || "ji"}! 👨‍🍳\nYour Sharmaji Ki Chai order ${o.id} is now being PREPARED.\nWe'll let you know the moment it's ready.\nTotal: ₹${o.total}\nThank you! 🍵`;
              window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
            };
            const markPreparing = (o) => { setStatus(o.id, "preparing"); waNotify(o); };
            return (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"0.6rem", marginBottom:"1rem", flexWrap:"wrap" }}>
                  <input style={{ ...inp, maxWidth:"320px" }} placeholder="🔍 Search by order ID or customer..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)}/>
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif" }}>{list.length} order{list.length===1?"":"s"}</span>
                </div>
                {list.length===0 ? (
                  <div style={{ textAlign:"center", padding:"3rem 1rem", color:"rgba(255,255,255,0.2)", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"8px" }}>No Sharmaji Ki Chai orders yet. Paid orders land here automatically.</div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"0.8rem" }}>
                    {list.map(o => (
                      <div key={o.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"8px", padding:"1rem" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem" }}>
                          <div>
                            <div style={{ fontWeight:800, color:Y, fontSize:"0.95rem" }}>{o.id}</div>
                            <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.35)", fontFamily:"'Inter',sans-serif" }}>{o.customerName || "Guest"} · {o.phone}</div>
                            <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.25)", fontFamily:"'Inter',sans-serif" }}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</div>
                          </div>
                          {badge(o.status, fsc(o.status))}
                        </div>
                        <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0.5rem 0", margin:"0.5rem 0" }}>
                          {o.items.map((it,i) => <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.76rem", fontFamily:"'Inter',sans-serif", color:"rgba(255,255,255,0.6)", marginBottom:"2px" }}><span>{it.name} <strong style={{color:"rgba(255,255,255,0.85)"}}>×{it.qty}</strong></span><span>₹{it.price*it.qty}</span></div>)}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.7rem" }}>
                          <span>{badge("Razorpay","#8a7fb0")} {badge(o.paymentStatus, "#00C864")}</span>
                          <span style={{ fontWeight:900, color:Y, fontSize:"1rem" }}>₹{o.total}</span>
                        </div>
                        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                          {/* Sequential flow: placed → preparing → ready → delivered.
                              Only the next valid action shows. Delivered/Cancelled are final: no buttons. */}
                          {(o.status==="placed" || !o.status) && (
                            <button className="nb" onClick={() => markPreparing(o)} style={actBtn("#ff9d3a","rgba(255,150,50,0.08)","rgba(255,150,50,0.2)")}>PREPARING</button>
                          )}
                          {o.status==="preparing" && (
                            <button className="nb" onClick={() => setStatus(o.id,"ready")} style={actBtn("#6cc8ff","rgba(108,200,255,0.08)","rgba(108,200,255,0.2)")}>READY</button>
                          )}
                          {o.status==="ready" && (
                            <button className="nb" onClick={() => setStatus(o.id,"delivered")} style={actBtn("#00C864","rgba(0,200,100,0.08)","rgba(0,200,100,0.18)")}>DELIVERED</button>
                          )}
                          {/* Cancel + Delete only while the order is still in progress */}
                          {o.status!=="delivered" && o.status!=="cancelled" && (
                            <button className="nb" onClick={() => setStatus(o.id,"cancelled")} style={actBtn("#ff6b4a","rgba(255,70,50,0.08)","rgba(255,70,50,0.18)")}>CANCEL</button>
                          )}
                          {o.status!=="delivered" && o.status!=="cancelled" && (
                            <button className="nb" onClick={() => { if(window.confirm("Delete this order?")) setFoodOrders(p => p.filter(x => x.id!==o.id)); }} style={actBtn("rgba(255,255,255,0.5)","rgba(255,255,255,0.04)","rgba(255,255,255,0.1)")}>DEL</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* MESSAGES — contact-form submissions from the website's bottom Contact section */}
          {adminTab==="messages" && (() => {
            const q = msgSearch.trim().toLowerCase();
            const list = messages.filter(m => !q || (m.name||"").toLowerCase().includes(q) || (m.email||"").toLowerCase().includes(q) || (m.msg||"").toLowerCase().includes(q));
            return (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"0.6rem", marginBottom:"1rem", flexWrap:"wrap" }}>
                  <input style={{ ...inp, maxWidth:"320px" }} placeholder="🔍 Search name, email or message..." value={msgSearch} onChange={e => setMsgSearch(e.target.value)}/>
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif" }}>{list.length} message{list.length===1?"":"s"}{unreadMsgs ? ` · ${unreadMsgs} unread` : ""}</span>
                </div>
                {list.length===0 ? (
                  <div style={{ textAlign:"center", padding:"3rem 1rem", color:"rgba(255,255,255,0.2)", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"8px" }}>No messages yet. Anything sent through the website's contact form lands here.</div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"0.8rem" }}>
                    {list.map(m => (
                      <div key={m.id} style={{ background: m.read ? "rgba(255,255,255,0.02)" : "rgba(245,200,66,0.05)", border:`1px solid ${m.read ? "rgba(255,255,255,0.06)" : "rgba(245,200,66,0.22)"}`, borderRadius:"8px", padding:"1rem" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem", gap:"0.5rem" }}>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:800, color: m.read ? "rgba(255,255,255,0.82)" : Y, fontSize:"0.92rem", display:"flex", alignItems:"center", gap:"6px" }}>
                              {!m.read && <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:Y, display:"inline-block", flexShrink:0 }}/>}
                              {m.name}
                            </div>
                            <a href={`mailto:${m.email}`} style={{ fontSize:"0.72rem", color:"#6cc8ff", fontFamily:"'Inter',sans-serif", textDecoration:"none", wordBreak:"break-all" }}>{m.email}</a>
                            <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.25)", fontFamily:"'Inter',sans-serif", marginTop:"2px" }}>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
                          </div>
                          {badge(m.id, "#8a7fb0")}
                        </div>
                        <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"0.6rem 0", margin:"0.4rem 0", fontSize:"0.82rem", fontFamily:"'Inter',sans-serif", color:"rgba(255,255,255,0.65)", lineHeight:1.55, whiteSpace:"pre-wrap" }}>{m.msg}</div>
                        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                          <button className="nb" onClick={() => setMessages(p => p.map(x => x.id===m.id ? {...x, read: !x.read} : x))} style={actBtn(m.read ? "#ff9d3a" : "#00C864", m.read ? "rgba(255,150,50,0.08)" : "rgba(0,200,100,0.08)", m.read ? "rgba(255,150,50,0.2)" : "rgba(0,200,100,0.18)")}>{m.read ? "MARK UNREAD" : "MARK READ"}</button>
                          <a className="nb" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to " + S.business.brandName)}`} style={{ ...actBtn("#6cc8ff","rgba(108,200,255,0.08)","rgba(108,200,255,0.2)"), textDecoration:"none" }}>REPLY</a>
                          <button className="nb" onClick={() => { if(window.confirm("Delete this message?")) setMessages(p => p.filter(x => x.id!==m.id)); }} style={actBtn("rgba(255,255,255,0.5)","rgba(255,255,255,0.04)","rgba(255,255,255,0.1)")}>DEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* MENU MANAGEMENT (full Sharmaji Ki Chai menu) */}
          {adminTab==="menu" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem" }}>Sharmaji Ki Chai menu — {menu.length} items across {menuCats.length} categories. Edits show instantly in the customer order view.</p>
                <button style={{ ...btnO, fontSize:"0.7rem", padding:"8px 16px" }} onClick={() => { const n=window.prompt("New category name"); if(n&&n.trim()&&!menuCats.includes(n.trim())) setMenuCats(p=>[...p, n.trim()]); }}>+ Category</button>
              </div>
              {menuCats.map(cat => {
                const items = menu.filter(m => m.category===cat);
                return (
                  <div key={cat} style={{ marginBottom:"1.4rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem", paddingBottom:"0.4rem", borderBottom:"1px solid rgba(245,200,66,0.12)" }}>
                      <span style={{ fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", color:Y, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{cat} <span style={{color:"rgba(255,255,255,0.25)"}}>({items.length})</span></span>
                      <button className="nb" onClick={() => { const n=window.prompt("Item name for "+cat); if(!n||!n.trim()) return; const pr=window.prompt("Price (₹)"); setMenu(p => [...p, { id:"sm"+Date.now(), category:cat, name:n.trim(), price:parseInt(pr)||0, available:true }]); }} style={{ padding:"4px 10px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>+ Add Item</button>
                    </div>
                    {items.length===0 ? <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"0.76rem", fontFamily:"'Inter',sans-serif" }}>No items.</div> : items.map(it => (
                      <div key={it.id} style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px" }}>
                        <input style={inp} value={it.name} onChange={e => setMenu(p => p.map(x => x.id===it.id ? {...x, name:e.target.value} : x))}/>
                        <div style={{ display:"flex", alignItems:"center", gap:"3px" }}><span style={{ color:"rgba(255,255,255,0.4)" }}>₹</span><input type="number" min="0" style={{ ...inp, maxWidth:"82px" }} value={it.price} onChange={e => setMenu(p => p.map(x => x.id===it.id ? {...x, price:parseInt(e.target.value)||0} : x))}/></div>
                        <button className="nb" onClick={() => setMenu(p => p.map(x => x.id===it.id ? {...x, available: x.available===false} : x))} style={actBtn(it.available===false ? "#ff6b4a" : "#00C864", it.available===false ? "rgba(255,70,50,0.08)" : "rgba(0,200,100,0.08)", it.available===false ? "rgba(255,70,50,0.18)" : "rgba(0,200,100,0.18)")}>{it.available===false ? "OUT OF STOCK" : "AVAILABLE"}</button>
                        <button className="nb" onClick={() => { if(window.confirm(`Delete "${it.name}"?`)) setMenu(p => p.filter(x => x.id!==it.id)); }} style={{ width:"34px", height:"38px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a", fontSize:"0.85rem", flexShrink:0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* BRANCHES (add / edit / remove) */}
          {adminTab==="branches" && (
            <div style={{ maxWidth:"640px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem" }}>Branches customers can book at. {branches.length} active.</p>
                <button style={{ ...btnY, fontSize:"0.7rem", padding:"8px 16px" }} onClick={() => { setEditingBranch({ id:null, name:"", icon:"🏢" }); setBranchModalOpen(true); }}>+ Add Branch</button>
              </div>
              {branches.map((b,i) => (
                <div key={b.id} style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px", padding:"0.7rem", background:`${BRANCH_COLORS[i%BRANCH_COLORS.length]}0d`, border:`1px solid ${BRANCH_COLORS[i%BRANCH_COLORS.length]}33`, borderRadius:"6px" }}>
                  <input style={{...inp, maxWidth:"60px", textAlign:"center", fontSize:"1.2rem"}} value={b.icon} onChange={e => updateBranch(b.id,"icon",e.target.value)}/>
                  <input style={inp} value={b.name} onChange={e => updateBranch(b.id,"name",e.target.value)}/>
                  <button className="nb" disabled={branches.length<=1} onClick={() => { if(branches.length>1 && window.confirm(`Delete branch "${b.name}"?`)) setBranches(p => p.filter(x => x.id!==b.id)); }} style={{ width:"34px", height:"38px", background: branches.length<=1 ? "rgba(255,255,255,0.03)" : "rgba(255,70,50,0.08)", border:`1px solid ${branches.length<=1 ? "rgba(255,255,255,0.06)" : "rgba(255,70,50,0.2)"}`, borderRadius:"4px", color: branches.length<=1 ? "rgba(255,255,255,0.2)" : "#ff6b4a", fontSize:"0.85rem", cursor: branches.length<=1 ? "not-allowed" : "pointer" }}>✕</button>
                </div>
              ))}
              <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem", fontFamily:"'Inter',sans-serif", marginTop:"0.6rem" }}>Edits apply instantly to the booking flow, filters and analytics. A branch named with "Sharmaji" is auto-linked to the Partner section.</p>
            </div>
          )}

          {/* GAMES */}
          {adminTab==="games" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem" }}>Games shown on the website. {games.length} total.</p>
                <button style={{ ...btnY, fontSize:"0.7rem", padding:"8px 18px" }} onClick={() => { setEditingGame({ id:null, title:"", price:80, img:"🎮", category:"PS5", duration:"30 min", players:"1-2", desc:"" }); setEditGameOpen(true); }}>+ Add Game</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1px", background:"rgba(245,200,66,0.06)" }}>
                {games.map(g => (
                  <div key={g.id} style={{ background:BG, padding:"1.25rem" }}>
                    <div style={{ display:"flex", gap:"0.7rem", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                      <span style={{ fontSize:"2rem" }}>{g.img}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:900, fontSize:"0.92rem", textTransform:"uppercase" }}>{g.title}</div>
                        <div style={{ display:"flex", gap:"5px", alignItems:"center", marginTop:"4px" }}>
                          <span style={{ padding:"2px 7px", background:"rgba(245,200,66,0.09)", border:"1px solid rgba(245,200,66,0.22)", borderRadius:"2px", fontSize:"0.57rem", letterSpacing:"0.13em", textTransform:"uppercase", color:Y, fontWeight:700 }}>{g.category}</span>
                          <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", fontFamily:"'Inter',sans-serif" }}>⏱ {g.duration} · 👥 {g.players}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight:900, color:Y, fontSize:"1.1rem" }}>₹{g.price}</div>
                    </div>
                    {g.desc && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.73rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.75rem", lineHeight:1.5 }}>{g.desc}</div>}
                    <div style={{ display:"flex", gap:"5px" }}>
                      <button className="nb" onClick={() => { setEditingGame({...g}); setEditGameOpen(true); }} style={{ flex:1, padding:"6px", background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.22)", borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Edit</button>
                      <button className="nb" onClick={() => { if(window.confirm(`Delete "${g.title}"?`)) setGames(p => p.filter(x => x.id!==g.id)); }} style={{ padding:"6px 12px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLOTS */}
          {adminTab==="slots" && (
            <div style={{ maxWidth:"600px" }}>
              <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem", marginBottom:"1rem" }}>Time slots customers can choose. {slots.length} active.</p>
              <div style={{ display:"flex", gap:"6px", marginBottom:"1.2rem" }}>
                <input style={inp} placeholder="e.g. 10:00 AM" value={newSlot} onChange={e => setNewSlot(e.target.value)} onKeyDown={e => { if(e.key==="Enter" && newSlot.trim()){ setSlots(p => [...p, newSlot.trim()]); setNewSlot(""); }}}/>
                <button style={btnY} onClick={() => { if(newSlot.trim()){ setSlots(p => [...p, newSlot.trim()]); setNewSlot(""); }}}>+ Add</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:"6px" }}>
                {slots.map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:"5px" }}>
                    <span style={{ fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", color:Y, fontWeight:600 }}>{s}</span>
                    <button className="nb" onClick={() => setSlots(p => p.filter((_,j) => j!==i))} style={{ color:"#ff6b4a", fontSize:"0.85rem", padding:0 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HERO */}
          {adminTab==="hero" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}>
                <div style={adminCardTitle}>Hero Section</div>
                <Field label="Top Badge" path="hero.badge"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}><Field label="Title Start" path="hero.titleStart"/><Field label="Title Accent (gold)" path="hero.titleAccent"/></div>
                <Field label="Subtitle" path="hero.subtitle"/><Field label="Description" path="hero.description" multi/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}><Field label="Primary CTA" path="hero.ctaPrimary"/><Field label="Secondary CTA" path="hero.ctaSecondary"/></div>
              </div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>Hero Stats ({S.hero.stats.length})</div>
                  <button className="nb" onClick={() => updateS("hero.stats", [...S.hero.stats, { value:"0", label:"New" }])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                {S.hero.stats.map((st,i) => (
                  <div key={i} style={{ display:"flex", gap:"6px", marginBottom:"6px", alignItems:"center" }}>
                    <input style={{...inp, maxWidth:"110px"}} value={st.value} onChange={e => updateS("hero.stats", S.hero.stats.map((x,j) => j===i ? {...x, value:e.target.value} : x))}/>
                    <input style={inp} value={st.label} onChange={e => updateS("hero.stats", S.hero.stats.map((x,j) => j===i ? {...x, label:e.target.value} : x))}/>
                    <button className="nb" onClick={() => updateS("hero.stats", S.hero.stats.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>Floating Cards ({S.hero.floatCards.length})</div>
                  <button className="nb" onClick={() => updateS("hero.floatCards", [...S.hero.floatCards, { icon:"🎮", label:"New" }])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                {S.hero.floatCards.map((fc,i) => (
                  <div key={i} style={{ display:"flex", gap:"6px", marginBottom:"6px", alignItems:"center" }}>
                    <input style={{...inp, maxWidth:"60px", textAlign:"center"}} value={fc.icon} onChange={e => updateS("hero.floatCards", S.hero.floatCards.map((x,j) => j===i ? {...x, icon:e.target.value} : x))}/>
                    <input style={inp} value={fc.label} onChange={e => updateS("hero.floatCards", S.hero.floatCards.map((x,j) => j===i ? {...x, label:e.target.value} : x))}/>
                    <button className="nb" onClick={() => updateS("hero.floatCards", S.hero.floatCards.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURES */}
          {adminTab==="features" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}><div style={adminCardTitle}>Section Heading</div><Field label="Eyebrow" path="features.eyebrow"/><Field label="Heading" path="features.heading"/></div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>Feature Cards ({S.features.items.length})</div>
                  <button className="nb" onClick={() => updateS("features.items", [...S.features.items, { icon:"⭐", title:"New", desc:"Description." }])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                {S.features.items.map((f,i) => (
                  <div key={i} style={{ padding:"0.85rem", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"6px", marginBottom:"0.6rem" }}>
                    <div style={{ display:"flex", gap:"6px", marginBottom:"6px" }}>
                      <input style={{...inp, maxWidth:"60px", textAlign:"center", fontSize:"1.1rem"}} value={f.icon} onChange={e => updateS("features.items", S.features.items.map((x,j) => j===i ? {...x, icon:e.target.value} : x))}/>
                      <input style={inp} value={f.title} onChange={e => updateS("features.items", S.features.items.map((x,j) => j===i ? {...x, title:e.target.value} : x))}/>
                      <button className="nb" onClick={() => updateS("features.items", S.features.items.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                    </div>
                    <textarea style={{...inp, minHeight:"54px", resize:"vertical"}} value={f.desc} onChange={e => updateS("features.items", S.features.items.map((x,j) => j===i ? {...x, desc:e.target.value} : x))}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT */}
          {adminTab==="about" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}>
                <div style={adminCardTitle}>About Section</div>
                <Field label="Eyebrow" path="about.eyebrow"/><Field label="Heading Line 1" path="about.headingLine1"/><Field label="Heading Line 2 (gold)" path="about.headingLine2"/>
                <Field label="Paragraph 1" path="about.para1" multi/><Field label="Paragraph 2" path="about.para2" multi/>
              </div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>About Stats ({S.about.stats.length})</div>
                  <button className="nb" onClick={() => updateS("about.stats", [...S.about.stats, { value:"0", label:"New" }])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                {S.about.stats.map((st,i) => (
                  <div key={i} style={{ display:"flex", gap:"6px", marginBottom:"6px", alignItems:"center" }}>
                    <input style={{...inp, maxWidth:"110px"}} value={st.value} onChange={e => updateS("about.stats", S.about.stats.map((x,j) => j===i ? {...x, value:e.target.value} : x))}/>
                    <input style={inp} value={st.label} onChange={e => updateS("about.stats", S.about.stats.map((x,j) => j===i ? {...x, label:e.target.value} : x))}/>
                    <button className="nb" onClick={() => updateS("about.stats", S.about.stats.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={adminCard}><div style={adminCardTitle}>Games Section Heading</div><Field label="Eyebrow" path="games.eyebrow"/><Field label="Heading" path="games.heading"/></div>
            </div>
          )}

          {/* PARTNER */}
          {adminTab==="partner" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}>
                <div style={adminCardTitle}>Partner Section ({PARTNER_BUSINESS.name})</div>
                <Field label="Eyebrow" path="partner.eyebrow"/><Field label="Heading" path="partner.heading"/>
                <Field label="Description" path="partner.description" multi/><Field label="Button Label" path="partner.cta"/>
                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.7rem", fontFamily:"'Inter',sans-serif" }}>Partner name &amp; external URL are set in the <strong style={{color:Y}}>PARTNER_BUSINESS</strong> constant at the top of the file. The booking button auto-targets the branch named "Sharmaji".</p>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {adminTab==="contact" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}><div style={adminCardTitle}>Contact Section Text</div><Field label="Eyebrow" path="contact.eyebrow"/><Field label="Heading" path="contact.heading"/><Field label="Description" path="contact.description" multi/></div>
              <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif" }}>Address, phone, email, hours live under <strong style={{color:Y}}>⚙️ Business</strong>.</p>
            </div>
          )}

          {/* FOOTER */}
          {adminTab==="footer" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}><div style={adminCardTitle}>Footer Content</div><Field label="Brand Tagline" path="footer.tagline" multi/><Field label="Copyright" path="footer.copyright"/></div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>Platforms Column ({S.footer.platformLinks.length})</div>
                  <button className="nb" onClick={() => updateS("footer.platformLinks", [...S.footer.platformLinks, "New Link"])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                {S.footer.platformLinks.map((l,i) => (
                  <div key={i} style={{ display:"flex", gap:"6px", marginBottom:"6px" }}>
                    <input style={inp} value={l} onChange={e => updateS("footer.platformLinks", S.footer.platformLinks.map((x,j) => j===i ? e.target.value : x))}/>
                    <button className="nb" onClick={() => updateS("footer.platformLinks", S.footer.platformLinks.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT */}
          {adminTab==="payment" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}><div style={adminCardTitle}>UPI</div><Field label="UPI ID (shown to customers)" path="payment.upiId"/></div>
              <div style={adminCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
                  <div style={{ ...adminCardTitle, marginBottom:0 }}>Online Payment Methods ({S.payment.methods.length})</div>
                  <button className="nb" onClick={() => updateS("payment.methods", [...S.payment.methods, { id:`m_${Date.now()}`, icon:"💰", label:"New Method", sub:"Description" }])} style={{ padding:"5px 12px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.3)`, borderRadius:"4px", color:Y, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>+ Add</button>
                </div>
                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.6rem" }}>These appear in the customer booking flow. <strong style={{color:Y}}>Pay at Store</strong> is admin-only (Create Booking) and never shown to customers.</p>
                {S.payment.methods.map((m,i) => (
                  <div key={m.id} style={{ padding:"0.85rem", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"6px", marginBottom:"0.6rem" }}>
                    <div style={{ display:"flex", gap:"6px", marginBottom:"6px" }}>
                      <input style={{...inp, maxWidth:"60px", textAlign:"center", fontSize:"1.1rem"}} value={m.icon} onChange={e => updateS("payment.methods", S.payment.methods.map((x,j) => j===i ? {...x, icon:e.target.value} : x))}/>
                      <input style={inp} value={m.label} onChange={e => updateS("payment.methods", S.payment.methods.map((x,j) => j===i ? {...x, label:e.target.value} : x))}/>
                      <button className="nb" onClick={() => updateS("payment.methods", S.payment.methods.filter((_,j) => j!==i))} style={{ width:"34px", height:"34px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"4px", color:"#ff6b4a" }}>✕</button>
                    </div>
                    <input style={inp} value={m.sub} onChange={e => updateS("payment.methods", S.payment.methods.map((x,j) => j===i ? {...x, sub:e.target.value} : x))}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUSINESS */}
          {adminTab==="business" && (
            <div style={{ maxWidth:"680px" }}>
              <div style={adminCard}><div style={adminCardTitle}>Brand</div><div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"0.6rem" }}><Field label="Icon" path="business.brandIcon"/><Field label="Brand Name" path="business.brandName"/></div></div>
              <div style={adminCard}>
                <div style={adminCardTitle}>Contact Information</div>
                <Field label="Short Address" path="business.address"/><Field label="Full Address" path="business.addressFull" multi/>
                <Field label="Phone" path="business.phone"/><Field label="Email" path="business.email"/>
                <Field label="Hours (short)" path="business.hoursShort"/><Field label="Hours (long)" path="business.hoursLong"/>
              </div>
              <div style={adminCard}><div style={adminCardTitle}>Admin Password</div><Field label="Current Admin Password" path="business.adminPassword" type="password"/><p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.7rem", fontFamily:"'Inter',sans-serif" }}>Changes apply next login.</p></div>
              <div style={{ ...adminCard, background:"rgba(255,70,50,0.04)", border:"1px solid rgba(255,70,50,0.15)" }}>
                <div style={{ ...adminCardTitle, color:"#ff6b4a" }}>Danger Zone</div>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.8rem" }}>Reset everything to defaults. Cannot be undone.</p>
                <button className="nb" onClick={() => { if(window.confirm("Reset ALL content, games, branches, slots, bookings and custom tabs to defaults?")){ setSettings(DEFAULT_SETTINGS); setGames(DEFAULT_GAMES); setSlots(DEFAULT_SLOTS); setBookings(DEFAULT_BOOKINGS.map(normalizeBooking)); setBranches(DEFAULT_BRANCHES); setCustomCats([]); }}} style={{ padding:"8px 18px", background:"rgba(255,70,50,0.1)", border:"1px solid rgba(255,70,50,0.3)", borderRadius:"5px", color:"#ff6b4a", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Reset Everything</button>
              </div>
            </div>
          )}

          {/* CUSTOM CATEGORY CONTENT */}
          {customCats.map(c => adminTab===c.id && (
            <div key={c.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem" }}>{c.icon} {c.name} — {c.items.length} item{c.items.length===1?"":"s"}</p>
                <div style={{ display:"flex", gap:"0.5rem" }}>
                  <button style={{ ...btnY, fontSize:"0.7rem", padding:"8px 18px" }} onClick={() => { setNewItem({name:"",subcat:"",price:"",desc:""}); setAddItemOpen(true); }}>+ Add Item</button>
                  <button className="nb" onClick={() => { if(window.confirm(`Delete "${c.name}" tab?`)){ setCustomCats(p => p.filter(x => x.id!==c.id)); setAdminTab("bookings"); }}} style={{ padding:"7px 12px", background:"rgba(255,70,50,0.08)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"5px", color:"#ff6b4a", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Delete Tab</button>
                </div>
              </div>
              {c.items.length===0 ? <div style={{ textAlign:"center", padding:"3rem 1rem", color:"rgba(255,255,255,0.2)", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"8px" }}>No items yet.</div> : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"1px", background:"rgba(245,200,66,0.05)" }}>
                  {c.items.map((it,idx) => (
                    <div key={idx} style={{ background:BG, padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:"0.88rem", textTransform:"uppercase" }}>{it.name}</div>
                        {it.subcat && <div style={{ fontSize:"0.6rem", color:Y, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>{it.subcat}</div>}
                        {it.desc && <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.73rem", fontFamily:"'Inter',sans-serif", marginTop:"2px" }}>{it.desc}</div>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexShrink:0 }}>
                        <div style={{ fontWeight:900, color:Y, fontSize:"1.05rem" }}>₹{it.price}</div>
                        <button className="nb" onClick={() => setCustomCats(p => p.map(cat => cat.id===c.id ? {...cat, items: cat.items.filter((_,i) => i!==idx)} : cat))} style={{ padding:"2px 7px", background:"rgba(255,70,50,0.1)", border:"1px solid rgba(255,70,50,0.2)", borderRadius:"3px", color:"#ff6b4a", fontSize:"0.65rem", fontWeight:700 }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Branch Modal */}
          {branchModalOpen && editingBranch && (
            <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }} onClick={() => setBranchModalOpen(false)}>
              <div style={{ ...mBox, maxWidth:"400px" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontWeight:900, fontSize:"1rem", textTransform:"uppercase", marginBottom:"1.2rem" }}>{editingBranch.id ? "Edit Branch" : "Add Branch"}</div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Icon</label><input style={{...inp, textAlign:"center", fontSize:"1.3rem"}} value={editingBranch.icon} onChange={e => setEditingBranch({...editingBranch, icon:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Branch Name *</label><input style={inp} value={editingBranch.name} onChange={e => setEditingBranch({...editingBranch, name:e.target.value})} autoFocus/></div>
                </div>
                <div style={{ display:"flex", gap:"0.6rem" }}>
                  <button style={{ ...btnO, flex:1 }} onClick={() => setBranchModalOpen(false)}>Cancel</button>
                  <button style={{ ...btnY, flex:1 }} onClick={() => { if(!editingBranch.name.trim()){ alert("Name required"); return; } if(editingBranch.id){ setBranches(p => p.map(b => b.id===editingBranch.id ? editingBranch : b)); } else { setBranches(p => [...p, { id:"br_"+Date.now(), name:editingBranch.name.trim(), icon:editingBranch.icon||"🏢" }]); } setBranchModalOpen(false); }}>{editingBranch.id ? "Save" : "Add Branch"}</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Custom Category Modal */}
          {addCatOpen && (
            <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }} onClick={() => setAddCatOpen(false)}>
              <div style={{ ...mBox, maxWidth:"400px" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontWeight:900, fontSize:"1rem", textTransform:"uppercase", marginBottom:"1.2rem" }}>Add Custom Tab</div>
                <div style={fg}><label style={lbl}>Tab Name *</label><input style={inp} value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus/></div>
                <div style={fg}><label style={lbl}>Icon</label>
                  <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"6px" }}>{["🍵","🍔","🥤","🍕","🎂","🍿","🛍️","📋","⭐","🎮","🎉","💼"].map(em => <button key={em} className="nb" onClick={() => setNewCatIcon(em)} style={{ width:"38px", height:"38px", fontSize:"1.2rem", borderRadius:"5px", border:"1px solid", borderColor: newCatIcon===em ? Y : "rgba(255,255,255,0.09)", background: newCatIcon===em ? "rgba(245,200,66,0.1)" : "transparent" }}>{em}</button>)}</div>
                  <input style={inp} value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)}/>
                </div>
                <div style={{ display:"flex", gap:"0.6rem" }}>
                  <button style={{ ...btnO, flex:1 }} onClick={() => setAddCatOpen(false)}>Cancel</button>
                  <button style={{ ...btnY, flex:1 }} onClick={() => { if(!newCatName.trim()){ alert("Enter a name"); return; } const id="cat_"+Date.now(); setCustomCats(p => [...p, { id, name:newCatName.trim(), icon:newCatIcon||"📋", items:[] }]); setAdminTab(id); setAddCatOpen(false); }}>Create</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Custom Item Modal */}
          {addItemOpen && (() => {
            const curCat = customCats.find(c => c.id===adminTab);
            return (
              <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }} onClick={() => setAddItemOpen(false)}>
                <div style={{ ...mBox, maxWidth:"420px" }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontWeight:900, fontSize:"1rem", textTransform:"uppercase", marginBottom:"1.2rem" }}>Add Item to {curCat?.name}</div>
                  <div style={fg}><label style={lbl}>Item Name *</label><input style={inp} value={newItem.name} onChange={e => setNewItem({...newItem, name:e.target.value})} autoFocus/></div>
                  <div style={fg}><label style={lbl}>Subcategory (optional)</label><input style={inp} value={newItem.subcat} onChange={e => setNewItem({...newItem, subcat:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Price (₹) *</label><input type="number" min="0" style={inp} value={newItem.price} onChange={e => setNewItem({...newItem, price:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Description (optional)</label><input style={inp} value={newItem.desc} onChange={e => setNewItem({...newItem, desc:e.target.value})}/></div>
                  <div style={{ display:"flex", gap:"0.6rem" }}>
                    <button style={{ ...btnO, flex:1 }} onClick={() => setAddItemOpen(false)}>Cancel</button>
                    <button style={{ ...btnY, flex:1 }} onClick={() => { if(!newItem.name.trim() || !newItem.price){ alert("Fill name and price"); return; } setCustomCats(p => p.map(c => c.id===adminTab ? {...c, items:[...c.items, { name:newItem.name.trim(), subcat:newItem.subcat.trim(), price:parseInt(newItem.price)||0, desc:newItem.desc.trim() }]} : c)); setAddItemOpen(false); }}>Add Item</button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Edit/Add Game Modal */}
          {editGameOpen && editingGame && (
            <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }} onClick={() => setEditGameOpen(false)}>
              <div style={{ ...mBox, maxWidth:"460px" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontWeight:900, fontSize:"1rem", textTransform:"uppercase", marginBottom:"1.2rem" }}>{editingGame.id ? "Edit Game" : "Add Game"}</div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Icon</label><input style={{...inp, textAlign:"center", fontSize:"1.4rem"}} value={editingGame.img} onChange={e => setEditingGame({...editingGame, img:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Title *</label><input style={inp} value={editingGame.title} onChange={e => setEditingGame({...editingGame, title:e.target.value})}/></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Category</label><input style={inp} value={editingGame.category} onChange={e => setEditingGame({...editingGame, category:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Price/player (₹) *</label><input type="number" min="0" style={inp} value={editingGame.price} onChange={e => setEditingGame({...editingGame, price:parseInt(e.target.value)||0})}/></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Duration</label><input style={inp} value={editingGame.duration} onChange={e => setEditingGame({...editingGame, duration:e.target.value})}/></div>
                  <div style={fg}><label style={lbl}>Players</label><input style={inp} value={editingGame.players} onChange={e => setEditingGame({...editingGame, players:e.target.value})}/></div>
                </div>
                <div style={fg}><label style={lbl}>Description</label><textarea style={{...inp, minHeight:"60px", resize:"vertical"}} value={editingGame.desc} onChange={e => setEditingGame({...editingGame, desc:e.target.value})}/></div>
                <div style={{ display:"flex", gap:"0.6rem" }}>
                  <button style={{ ...btnO, flex:1 }} onClick={() => setEditGameOpen(false)}>Cancel</button>
                  <button style={{ ...btnY, flex:1 }} onClick={() => { if(!editingGame.title.trim()){ alert("Title required"); return; } if(editingGame.id){ setGames(p => p.map(g => g.id===editingGame.id ? editingGame : g)); } else { const id = Math.max(0, ...games.map(g => g.id)) + 1; setGames(p => [...p, { ...editingGame, id }]); } setEditGameOpen(false); }}>{editingGame.id ? "Save Changes" : "Add Game"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // WEBSITE
  // ════════════════════════════════════════════════════════════════
  const DesktopNav = () => (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:600, height:"66px", padding:"0 2rem", display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", gap:"1rem", background: scrollY > 30 ? "rgba(13,6,24,0.97)" : "transparent", backdropFilter: scrollY > 30 ? "blur(20px)" : "none", borderBottom: scrollY > 30 ? "1px solid rgba(245,200,66,0.12)" : "none", transition:"all 0.3s" }}>
      <div onClick={() => goTo("home")} style={{ fontSize:"1.15rem", fontWeight:900, ...gradTxt, textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap", letterSpacing:"0.06em", fontFamily:"'Rajdhani',sans-serif" }}>{S.business.brandIcon} {S.business.brandName}</div>
      <div style={{ display:"flex", gap:"1.7rem", alignItems:"center", justifyContent:"center", flexWrap:"wrap" }}>
        {[["home","Home"],["about","About"],["games","Games"],["partner","Sharmaji"],["contact","Contact"]].map(([id,l]) => (
          <span key={id} onClick={() => goTo(id)} style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", transition:"color 0.22s", whiteSpace:"nowrap" }} onMouseEnter={e => e.currentTarget.style.color=Y} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.55)"}>{l}</span>
        ))}
        <span onClick={() => setPage("admin")} style={{ color:"rgba(245,200,66,0.45)", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", whiteSpace:"nowrap" }}>Admin</span>
      </div>
      <button className="glow" style={{ ...btnY, whiteSpace:"nowrap" }} onClick={() => openBooking()}>Book Now</button>
    </nav>
  );

  const MobileTopBar = () => (
    <header style={{ position:"sticky", top:0, zIndex:600, height:"54px", padding:"0 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(13,6,24,0.98)", borderBottom:`1px solid rgba(245,200,66,0.12)`, backdropFilter:"blur(16px)" }}>
      <div style={{ fontSize:"1rem", fontWeight:900, ...gradTxt, textTransform:"uppercase", fontFamily:"'Rajdhani',sans-serif" }}>{S.business.brandIcon} {S.business.brandName}</div>
      <button style={{ ...btnY, padding:"7px 14px", fontSize:"0.68rem" }} onClick={() => openBooking()}>🎮 Book Now</button>
    </header>
  );

  const MobileBottomTabs = () => (
    <div style={{ position:"sticky", bottom:0, zIndex:600, background:"rgba(13,6,24,0.98)", borderTop:`1px solid rgba(245,200,66,0.12)`, backdropFilter:"blur(16px)", display:"flex", alignItems:"stretch", height:"56px" }}>
      {[["🏠","Home",() => goTo("home")],["🎮","Games",() => goTo("games")],["🍽️","Sharmaji",() => goTo("partner")],["📞","Contact",() => goTo("contact")],["⚙️","Admin",() => setPage("admin")]].map(([ic,l,fn]) => (
        <button key={l} className="btab" onClick={fn}><span style={{ fontSize:"1rem", lineHeight:1 }}>{ic}</span><span>{l}</span></button>
      ))}
    </div>
  );

  const Hero = () => (
    <section id="home" style={{ minHeight: isMob ? "100svh" : "100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:`linear-gradient(160deg,${BG} 0%,#180d35 55%,${BG} 100%)` }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 45% at 50% 38%,rgba(45,27,105,0.55) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(245,200,66,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,200,66,0.03) 1px,transparent 1px)", backgroundSize:"55px 55px", opacity:0.7 }}/>
      {particles.map(p => <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, width:`${p.s}px`, height:`${p.s}px`, borderRadius:"50%", background:`rgba(245,200,66,${p.op})`, pointerEvents:"none", animation:`floatY ${p.dur}s ease-in-out infinite ${p.del}s` }}/>)}
      {!isMob && S.hero.floatCards.map((fc,i) => {
        const positions = [{ left:"5%", top:"32%", cls:"fl1" },{ right:"5%", top:"28%", cls:"fl2" },{ right:"8%", bottom:"30%", cls:"fl3" }];
        const pos = positions[i % positions.length];
        return (
          <div key={i} className={pos.cls} style={{ position:"absolute", ...pos, padding:"0.8rem 1rem", background:"rgba(45,27,105,0.45)", backdropFilter:"blur(12px)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:"10px", zIndex:2 }}>
            <div style={{ fontSize:"1.25rem" }}>{fc.icon}</div>
            <div style={{ fontSize:"0.58rem", color:"rgba(245,200,66,0.7)", letterSpacing:"0.11em", textTransform:"uppercase", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, marginTop:"3px" }}>{fc.label}</div>
          </div>
        );
      })}
      <div className="fu" style={{ textAlign:"center", zIndex:2, padding: isMob ? "2rem 1.25rem" : "2rem", maxWidth: isMob ? "100%" : "800px" }}>
        <div style={{ display:"inline-block", padding:"4px 16px", background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.28)", borderRadius:"100px", fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:Y, marginBottom:"1.4rem", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{S.hero.badge}</div>
        <h1 style={{ fontSize: isMob ? "clamp(2.2rem,10vw,3.5rem)" : "clamp(3rem,7vw,5.8rem)", fontWeight:900, lineHeight:0.92, letterSpacing:"-0.02em", textTransform:"uppercase", marginBottom:"1rem", fontFamily:"'Rajdhani',sans-serif" }}>
          <span style={{ color:"#fff" }}>{S.hero.titleStart}</span><span style={gradTxt}>{S.hero.titleAccent}</span>
          <div style={{ fontSize:"0.3em", fontWeight:700, letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)", marginTop:"0.6rem", fontFamily:"'Inter',sans-serif" }}>{S.hero.subtitle}</div>
        </h1>
        <p style={{ fontSize: isMob ? "0.86rem" : "0.96rem", color:"rgba(255,255,255,0.5)", maxWidth:"500px", margin:"0 auto 1.9rem", lineHeight:1.8, fontFamily:"'Inter',sans-serif" }}>{S.hero.description}</p>
        <div style={{ display:"flex", gap:"0.7rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="glow" style={btnY} onClick={() => openBooking()}>{S.hero.ctaPrimary}</button>
          <button style={btnO} onClick={() => goTo("games")}>{S.hero.ctaSecondary}</button>
        </div>
        <div style={{ display:"flex", gap: isMob ? "1.2rem" : "2.5rem", justifyContent:"center", marginTop: isMob ? "1.75rem" : "2.5rem", flexWrap:"wrap" }}>
          {S.hero.stats.map((st,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize: isMob ? "1.2rem" : "1.45rem", fontWeight:900, ...gradTxt, fontFamily:"'Rajdhani',sans-serif" }}>{st.value}</div>
              <div style={{ fontSize:"0.54rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section style={{ padding: isMob ? "3rem 1rem" : "5rem 2rem", background:BG }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <span style={secLbl}>{S.features.eyebrow}</span><h2 style={secH}>{S.features.heading}</h2>
        <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : `repeat(${Math.min(4, S.features.items.length || 1)},1fr)`, gap:"1.5px", marginTop:"1.75rem", background:"rgba(245,200,66,0.06)", border:"1px solid rgba(245,200,66,0.12)" }}>
          {S.features.items.map((f,i) => (
            <div key={i} className="gc" style={{ padding: isMob ? "1.2rem 0.85rem" : "1.8rem 1.5rem" }}>
              <span style={{ fontSize: isMob ? "1.45rem" : "1.7rem", display:"block", marginBottom:"0.6rem" }}>{f.icon}</span>
              <div style={{ fontSize: isMob ? "0.78rem" : "0.86rem", fontWeight:800, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:"0.45rem", fontFamily:"'Rajdhani',sans-serif" }}>{f.title}</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize: isMob ? "0.72rem" : "0.78rem", lineHeight:1.6, fontFamily:"'Inter',sans-serif" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const About = () => (
    <section id="about" style={{ padding: isMob ? "3rem 1rem" : "5rem 2rem", background:`linear-gradient(180deg,${BG},${BG2},${BG})` }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: isMob ? "2rem" : "4.5rem", alignItems:"center" }}>
          <div>
            <span style={secLbl}>{S.about.eyebrow}</span>
            <h2 style={secH}>{S.about.headingLine1}<br/><span style={gradTxt}>{S.about.headingLine2}</span></h2>
            <p style={{ color:"rgba(255,255,255,0.48)", fontSize:"0.86rem", lineHeight:1.8, fontFamily:"'Inter',sans-serif", marginBottom:"0.9rem" }}>{S.about.para1}</p>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.83rem", lineHeight:1.8, fontFamily:"'Inter',sans-serif", marginBottom:"1.6rem" }}>{S.about.para2}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem" }}>
            {S.about.stats.map((st,i) => (
              <div key={i} style={{ textAlign:"center", padding:"1.4rem 0.75rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:"8px" }}>
                <span style={{ fontSize: isMob ? "1.8rem" : "2.4rem", fontWeight:900, ...gradTxt, display:"block", lineHeight:1, fontFamily:"'Rajdhani',sans-serif" }}>{st.value}</span>
                <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif", marginTop:"3px" }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const GamesSection = () => {
    const filters = ["All", ...gameCategories];
    return (
      <section id="games" style={{ padding: isMob ? "3rem 1rem" : "5rem 2rem", background:`linear-gradient(180deg,${BG},#150c28)` }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"0.8rem", marginBottom:"1.75rem" }}>
            <div><span style={secLbl}>{S.games.eyebrow}</span><h2 style={{ ...secH, marginBottom:0 }}>{S.games.heading}</h2></div>
            <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
              {filters.map(c => <button key={c} className="nb" onClick={() => setGFilter(c)} style={{ padding:"6px 14px", borderRadius:"3px", border:"1px solid", borderColor: gFilter===c ? Y : "rgba(255,255,255,0.1)", background: gFilter===c ? "rgba(245,200,66,0.1)" : "transparent", color: gFilter===c ? Y : "rgba(255,255,255,0.38)", fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>{c}</button>)}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(auto-fill,minmax(240px,1fr))", gap:"1.5px", background:"rgba(245,200,66,0.05)" }}>
            {games.filter(g => gFilter==="All" || g.category===gFilter).map(g => (
              <div key={g.id} className="gc" style={{ padding: isMob ? "1rem 0.8rem" : "1.5rem", display:"flex", flexDirection:"column", gap:"0.6rem", cursor:"pointer" }} onClick={() => setDetGame(g)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <span style={{ fontSize: isMob ? "1.8rem" : "2.2rem" }}>{g.img}</span>
                  <span style={{ padding:"3px 7px", background:"rgba(245,200,66,0.09)", border:"1px solid rgba(245,200,66,0.22)", borderRadius:"2px", fontSize:"0.56rem", letterSpacing:"0.13em", textTransform:"uppercase", color:Y, fontWeight:700 }}>{g.category}</span>
                </div>
                <div style={{ fontSize: isMob ? "0.84rem" : "0.95rem", fontWeight:900, letterSpacing:"0.02em", textTransform:"uppercase", fontFamily:"'Rajdhani',sans-serif" }}>{g.title}</div>
                {!isMob && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.77rem", lineHeight:1.5, fontFamily:"'Inter',sans-serif" }}>{g.desc}</div>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:"0.55rem", color:"rgba(255,255,255,0.25)", fontFamily:"'Inter',sans-serif" }}>Per Player</div><div style={{ fontSize: isMob ? "1.05rem" : "1.25rem", fontWeight:900, ...gradTxt, fontFamily:"'Rajdhani',sans-serif" }}>₹{g.price}</div></div>
                  <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.28)", fontFamily:"'Inter',sans-serif", textAlign:"right" }}><div>⏱ {g.duration}</div><div>👥 {g.players}</div></div>
                </div>
                <button style={{ ...btnY, width:"100%", padding:"9px", fontSize:"0.72rem", marginTop:"2px" }} onClick={e => { e.stopPropagation(); openBooking(null, g); }}>🎮 Book This Game</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const PartnerSection = () => (
    <section id="partner" style={{ padding: isMob ? "3rem 1rem" : "5rem 2rem", background:`linear-gradient(180deg,#150c28,${BG})` }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", textAlign: isMob ? "left" : "center" }}>
        <span style={secLbl}>{S.partner.eyebrow}</span>
        <h2 style={secH}>{S.partner.heading}</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.86rem", lineHeight:1.8, fontFamily:"'Inter',sans-serif", maxWidth:"560px", margin: isMob ? "0 0 1.6rem" : "0 auto 1.8rem" }}>{S.partner.description}</p>
        <div style={{ maxWidth:"460px", margin: isMob ? "0" : "0 auto", padding: isMob ? "1.4rem" : "2rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.16)", borderRadius:"12px" }}>
          <div style={{ fontSize:"2.4rem", marginBottom:"0.5rem" }}>🍽️🎮</div>
          <div style={{ fontSize:"1.25rem", fontWeight:900, ...gradTxt, textTransform:"uppercase", letterSpacing:"0.04em", fontFamily:"'Rajdhani',sans-serif", marginBottom:"0.4rem" }}>{PARTNER_BUSINESS.name}</div>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", lineHeight:1.6, marginBottom:"1.2rem" }}>Right next to Star Game Zone — order chai, snacks, pizza, momos &amp; more, and pay by UPI.</p>
          <button className="glow" style={{ ...btnY, width:"100%" }} onClick={openFood}>🛒 Order Now</button>
        </div>
      </div>
    </section>
  );

  const ContactSection = () => (
    <section id="contact" style={{ padding: isMob ? "3rem 1rem" : "5rem 2rem", background:`linear-gradient(180deg,${BG},${BG2})` }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1.1fr", gap: isMob ? "2rem" : "4.5rem", alignItems:"start" }}>
          <div>
            <span style={secLbl}>{S.contact.eyebrow}</span><h2 style={secH}>{S.contact.heading}</h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.84rem", lineHeight:1.8, fontFamily:"'Inter',sans-serif", marginBottom:"1.6rem" }}>{S.contact.description}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
              {[{i:"📍",l:"Location",v:S.business.addressFull},{i:"📞",l:"Phone",v:S.business.phone},{i:"✉️",l:"Email",v:S.business.email},{i:"🕐",l:"Hours",v:S.business.hoursLong}].map(c => (
                <div key={c.l} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                  <div style={{ width:"35px", height:"35px", borderRadius:"7px", background:"rgba(245,200,66,0.07)", border:"1px solid rgba(245,200,66,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.88rem", flexShrink:0 }}>{c.i}</div>
                  <div><div style={{ fontSize:"0.56rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", fontFamily:"'Inter',sans-serif", marginBottom:"2px" }}>{c.l}</div><div style={{ color:"rgba(255,255,255,0.58)", fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", lineHeight:1.5 }}>{c.v}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"rgba(245,200,66,0.02)", border:"1px solid rgba(245,200,66,0.08)", borderRadius:"10px", padding: isMob ? "1.3rem" : "1.85rem" }}>
            {contactSent ? (
              <div style={{ textAlign:"center", padding:"2rem 0" }}>
                <div style={{ fontSize:"2.8rem", marginBottom:"0.6rem" }}>✅</div>
                <div style={{ fontWeight:900, fontSize:"0.98rem", textTransform:"uppercase", letterSpacing:"0.04em" }}>Message Sent!</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", marginTop:"0.3rem" }}>We'll respond within 24 hours.</div>
                <button style={{ ...btnO, marginTop:"1rem" }} onClick={() => setContactSent(false)}>Send Another</button>
              </div>
            ) : (
              <>
                <div style={{ fontWeight:900, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"0.9rem", fontFamily:"'Rajdhani',sans-serif" }}>Send a Message</div>
                <div style={fg}><label style={lbl}>Your Name</label><input style={inp} value={contactForm.name} onChange={e => setContactForm({...contactForm,name:e.target.value})}/></div>
                <div style={fg}><label style={lbl}>Email</label><input style={inp} value={contactForm.email} onChange={e => setContactForm({...contactForm,email:e.target.value})}/></div>
                <div style={fg}><label style={lbl}>Message</label><textarea style={{ ...inp, minHeight:"85px", resize:"vertical" }} value={contactForm.msg} onChange={e => setContactForm({...contactForm,msg:e.target.value})}/></div>
                <button style={{ ...btnY, width:"100%" }} onClick={() => { if(contactForm.name&&contactForm.email&&contactForm.msg){ setMessages(p => [{ id:"MSG"+Math.floor(Math.random()*9000+1000), name:contactForm.name.trim(), email:contactForm.email.trim(), msg:contactForm.msg.trim(), createdAt:new Date().toISOString(), read:false }, ...p]); setContactSent(true); setContactForm({ name:"", email:"", msg:"" }); } }}>Send Message →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer style={{ background:"#07030f", borderTop:"1px solid rgba(245,200,66,0.07)", padding: isMob ? "2.5rem 1rem 1rem" : "3rem 2.5rem 1.5rem" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMob ? "1.6rem" : "2.5rem", marginBottom:"1.8rem" }}>
          <div style={{ gridColumn: isMob ? "1/-1" : undefined }}>
            <div style={{ fontSize:"1rem", fontWeight:900, ...gradTxt, textTransform:"uppercase", marginBottom:"0.6rem", fontFamily:"'Rajdhani',sans-serif" }}>{S.business.brandIcon} {S.business.brandName}</div>
            <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.77rem", lineHeight:1.7, fontFamily:"'Inter',sans-serif", maxWidth:"230px" }}>{S.footer.tagline}</p>
          </div>
          {[
            { t:"Quick Links", items:[["Home","home"],["About Us","about"],["Games","games"],[PARTNER_BUSINESS.name,"partner"],["Contact","contact"]] },
            { t:"Platforms", items:S.footer.platformLinks.map(l => [l,null]) },
            { t:"Contact", items:[[S.business.phone,null],[S.business.email,null],[S.business.address,null],[S.business.hoursShort,null]] },
          ].map(col => (
            <div key={col.t}>
              <div style={{ fontWeight:800, textTransform:"uppercase", letterSpacing:"0.13em", fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", marginBottom:"0.72rem", fontFamily:"'Rajdhani',sans-serif" }}>{col.t}</div>
              {col.items.map(([label,id],i) => (
                <div key={i} style={{ marginBottom:"0.45rem", cursor: id ? "pointer" : "default" }} onClick={() => id && goTo(id)}>
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.77rem", fontFamily:"'Inter',sans-serif" }}>{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.6rem" }}>
          <div style={{ color:"rgba(255,255,255,0.14)", fontSize:"0.68rem", fontFamily:"'Inter',sans-serif" }}>{S.footer.copyright}</div>
          <a href="https://glow-frame.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"5px", textDecoration:"none", whiteSpace:"nowrap" }}>
            <span style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.68rem", fontFamily:"'Inter',sans-serif" }}>Made by</span>
            <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:"0.78rem", letterSpacing:"0.05em" }}>
              <span style={{ color:"#fff" }}>GLOW</span><span style={{ background:"linear-gradient(135deg,#c4a5ff,#7d5cf0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>FRAME</span>
            </span>
          </a>
          <span style={{ color:"rgba(245,200,66,0.28)", fontSize:"0.66rem", fontFamily:"'Inter',sans-serif", cursor:"pointer" }} onClick={() => setPage("admin")}>Admin Portal</span>
        </div>
      </div>
    </footer>
  );

  const BookingModal = () => (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }}>
      <div style={{ ...mBox, maxWidth: isMob ? "calc(100vw - 2rem)" : "500px" }}>
        {done ? (
          <div style={{ textAlign:"center", padding:"1.4rem 0" }}>
            <span style={{ fontSize:"3rem", display:"block", marginBottom:"0.65rem" }}>🎉</span>
            <h3 style={{ fontSize:"1.4rem", fontWeight:900, textTransform:"uppercase", marginBottom:"0.3rem" }}>Booking Confirmed!</h3>
            <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", marginBottom:"1rem" }}>Payment received — see you at {branchNameOf(bk.branchId)}, {bk.name}!</p>
            <div style={{ display:"inline-block", padding:"6px 18px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.35)`, borderRadius:"4px", fontWeight:900, letterSpacing:"0.15em", fontSize:"0.96rem", marginBottom:"1.2rem", color:Y }}>{bkId}</div>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"6px", padding:"0.9rem", textAlign:"left", marginBottom:"1.2rem" }}>
              {[["Branch",branchNameOf(bk.branchId)],["Game",selGame?.title],["Date",bk.date],["Slot",bk.slot],["Players",bk.players],["Payment","Paid (Online)"],["Total",`₹${total}`]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:"0.79rem", fontFamily:"'Inter',sans-serif" }}>
                  <span style={{ color:"rgba(255,255,255,0.3)" }}>{k}</span><span style={{ fontWeight:600, color: k==="Total" ? Y : "rgba(255,255,255,0.75)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"0.6rem" }}>
              <button style={{ ...btnO, flex:1 }} onClick={() => { setPage("home"); setDone(false); setBk(freshBk()); }}>← Home</button>
              <button style={{ ...btnY, flex:1 }} onClick={() => { setDone(false); setBStep(1); setSelGame(null); setBk(freshBk()); }}>New Booking</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
              <div>
                <div style={{ fontWeight:900, fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"0.04em" }}>{["","Select Branch","Select Game","Your Details","Date & Slot","Payment"][bStep]}</div>
                <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.64rem", fontFamily:"'Inter',sans-serif" }}>Step {bStep} of 5</div>
              </div>
              <button className="nb" style={{ color:"rgba(255,255,255,0.3)", fontSize:"1.2rem" }} onClick={() => setPage("home")}>×</button>
            </div>
            <div style={{ display:"flex", gap:"4px", marginBottom:"1.2rem" }}>
              {[1,2,3,4,5].map(s => <div key={s} style={{ flex:1, height:"3px", borderRadius:"2px", background: s<=bStep ? `linear-gradient(90deg,${Y},${YD})` : "rgba(255,255,255,0.07)", transition:"background 0.35s" }}/>)}
            </div>

            {bStep===1 && <>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.8rem" }}>What would you like to do?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {branches.map(br => { const isFood = /sharmaji/i.test(br.name); return (
                  <div key={br.id} onClick={() => { if(isFood){ setPage("home"); openFood(); } else { setBk({...bk, branchId:br.id}); setBStep(2); } }} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.95rem", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"6px", cursor:"pointer", background:"rgba(255,255,255,0.02)", transition:"border-color 0.18s" }} onMouseEnter={e => e.currentTarget.style.borderColor=Y} onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
                    <span style={{ fontSize:"1.8rem" }}>{br.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:"0.92rem", textTransform:"uppercase" }}>{br.name}</div>
                      <div style={{ fontSize:"0.64rem", color:"rgba(255,255,255,0.3)", fontFamily:"'Inter',sans-serif" }}>{isFood ? "Order chai, snacks & meals →" : "Book a gaming session →"}</div>
                    </div>
                    <span style={{ color:Y, fontSize:"1.1rem" }}>→</span>
                  </div>
                ); })}
              </div>
            </>}

            {bStep===2 && <>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", marginBottom:"0.8rem" }}>Choose a game to play</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"5px", maxHeight:"310px", overflowY:"auto", paddingRight:"2px" }}>
                {games.map(g => (
                  <div key={g.id} onClick={() => setSelGame(g)} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 0.9rem", border:"1px solid", borderColor: selGame?.id===g.id ? Y : "rgba(255,255,255,0.06)", borderRadius:"6px", cursor:"pointer", background: selGame?.id===g.id ? "rgba(245,200,66,0.06)" : "transparent" }}>
                    <span style={{ fontSize:"1.5rem" }}>{g.img}</span>
                    <div style={{ flex:1 }}><div style={{ fontWeight:800, fontSize:"0.85rem", textTransform:"uppercase" }}>{g.title}</div><div style={{ fontSize:"0.63rem", color:"rgba(255,255,255,0.28)", fontFamily:"'Inter',sans-serif" }}>{g.category} · {g.duration}</div></div>
                    <div style={{ fontWeight:900, color:Y, fontSize:"0.88rem" }}>₹{g.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"0.6rem", marginTop:"1rem" }}>
                <button style={{ ...btnO, flex:1 }} onClick={() => setBStep(1)}>← Back</button>
                <button disabled={!selGame} style={{ ...btnY, flex:1, opacity: selGame ? 1 : 0.35, cursor: selGame ? "pointer" : "not-allowed" }} onClick={() => setBStep(3)}>Continue →</button>
              </div>
            </>}

            {bStep===3 && <>
              <div style={{ padding:"0.6rem 0.8rem", background:"rgba(245,200,66,0.05)", border:"1px solid rgba(245,200,66,0.13)", borderRadius:"5px", marginBottom:"0.9rem", display:"flex", gap:"0.6rem", alignItems:"center" }}>
                <span style={{ fontSize:"1.3rem" }}>{selGame?.img}</span>
                <div><div style={{ fontWeight:800, fontSize:"0.83rem", textTransform:"uppercase" }}>{selGame?.title}</div><div style={{ fontSize:"0.67rem", color:"rgba(255,255,255,0.3)", fontFamily:"'Inter',sans-serif" }}>{branchNameOf(bk.branchId)} · ₹{selGame?.price}/player</div></div>
              </div>
              <div style={fg}><label style={lbl}>Full Name *</label><input style={inp} value={bk.name} onChange={e => setBk({...bk,name:e.target.value})}/></div>
              <div style={fg}><label style={lbl}>Phone *</label><input style={inp} value={bk.phone} onChange={e => setBk({...bk,phone:e.target.value})}/></div>
              <div style={fg}><label style={lbl}>Email (optional)</label><input style={inp} value={bk.email} onChange={e => setBk({...bk,email:e.target.value})}/></div>
              <div style={fg}><label style={lbl}>Number of Players</label>
                <div style={{ display:"flex", gap:"5px" }}>{[1,2,3,4].map(n => <button key={n} className="nb" onClick={() => setBk({...bk,players:n})} style={{ flex:1, padding:"9px", border:"1px solid", borderColor: bk.players===n ? Y : "rgba(255,255,255,0.09)", borderRadius:"4px", background: bk.players===n ? "rgba(245,200,66,0.1)" : "transparent", color: bk.players===n ? Y : "rgba(255,255,255,0.38)", fontWeight:700, fontSize:"0.86rem" }}>{n}</button>)}</div>
              </div>
              <div style={{ display:"flex", gap:"0.6rem" }}>
                <button style={{ ...btnO, flex:1 }} onClick={() => setBStep(2)}>← Back</button>
                <button disabled={!bk.name||!bk.phone} style={{ ...btnY, flex:1, opacity:(bk.name&&bk.phone)?1:0.35 }} onClick={() => setBStep(4)}>Continue →</button>
              </div>
            </>}

            {bStep===4 && <>
              <div style={fg}><label style={lbl}>Select Date *</label><input type="date" style={inp} min={new Date().toISOString().split("T")[0]} value={bk.date} onChange={e => setBk({...bk,date:e.target.value})}/></div>
              {bk.date && <div style={fg}>
                <label style={lbl}>Select Time Slot *</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(78px,1fr))", gap:"5px", marginTop:"4px" }}>
                  {slots.map(s => <button key={s} className="slot nb" onClick={() => setBk({...bk,slot:s})} style={{ border:"1px solid", borderColor: bk.slot===s ? Y : "rgba(255,255,255,0.08)", background: bk.slot===s ? "rgba(245,200,66,0.1)" : "transparent", color: bk.slot===s ? Y : "rgba(255,255,255,0.4)" }}>{s}</button>)}
                </div>
              </div>}
              <div style={{ padding:"0.8rem", background:"rgba(255,255,255,0.02)", borderRadius:"6px", marginBottom:"0.9rem", fontFamily:"'Inter',sans-serif" }}>
                {[["Branch",branchNameOf(bk.branchId)],["Game",selGame?.title],[`${bk.players}p × ₹${selGame?.price}`,`= ₹${total}`]].map(([k,v]) => <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", color:"rgba(255,255,255,0.35)", marginBottom:"3px" }}><span>{k}</span><span style={{ color:"rgba(255,255,255,0.6)" }}>{v}</span></div>)}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, color:Y, paddingTop:"0.5rem", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:"0.95rem" }}><span>Total</span><span>₹{total}</span></div>
              </div>
              <div style={{ display:"flex", gap:"0.6rem" }}>
                <button style={{ ...btnO, flex:1 }} onClick={() => setBStep(3)}>← Back</button>
                <button disabled={!bk.date||!bk.slot} style={{ ...btnY, flex:1, opacity:(bk.date&&bk.slot)?1:0.35 }} onClick={() => { if(!customerMethods.find(m => m.id===pay)) setPay(customerMethods[0]?.id || PAYMENT_METHODS.UPI); setBStep(5); }}>Continue →</button>
              </div>
            </>}

            {bStep===5 && <>
              <div style={{ padding:"0.8rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:"5px", marginBottom:"1rem", fontFamily:"'Inter',sans-serif" }}>
                <div style={{ fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"0.55rem", fontSize:"0.75rem" }}>Order Summary</div>
                {[["Branch",branchNameOf(bk.branchId)],["Game",selGame?.title],["Date",bk.date],["Slot",bk.slot],["Players",bk.players],["Duration",selGame?.duration]].map(([k,v]) => <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.76rem", color:"rgba(255,255,255,0.35)", marginBottom:"2px" }}><span>{k}</span><span style={{ color:"rgba(255,255,255,0.6)" }}>{v}</span></div>)}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, color:Y, paddingTop:"0.5rem", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:"0.95rem" }}><span>Total</span><span>₹{total}</span></div>
              </div>
              <label style={{ ...lbl, marginBottom:"0.6rem" }}>Online Payment Method</label>
              {customerMethods.map(m => (
                <div key={m.id} className="prow" onClick={() => setPay(m.id)} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.88rem 0.95rem", border:"1px solid", borderColor: pay===m.id ? Y : "rgba(255,255,255,0.07)", borderRadius:"6px", background: pay===m.id ? "rgba(245,200,66,0.06)" : "transparent", marginBottom:"5px" }}>
                  <div style={{ width:"14px", height:"14px", borderRadius:"50%", border:`2px solid ${pay===m.id ? Y : "rgba(255,255,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{pay===m.id && <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:Y }}/>}</div>
                  <span style={{ fontSize:"1rem" }}>{m.icon}</span>
                  <div><div style={{ fontWeight:700, fontSize:"0.83rem" }}>{m.label}</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.68rem", fontFamily:"'Inter',sans-serif" }}>{m.sub}</div></div>
                </div>
              ))}
              {pay===PAYMENT_METHODS.UPI && <div style={{ padding:"0.7rem 0.85rem", background:"rgba(255,255,255,0.02)", borderRadius:"5px", margin:"0.4rem 0 0.65rem", fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.28)", marginBottom:"2px" }}>UPI ID</div><div style={{ fontWeight:700, color:Y }}>{S.payment.upiId}</div></div>}
              {pay===PAYMENT_METHODS.CARD && <div style={{ marginBottom:"0.65rem" }}>
                <div style={fg}><label style={lbl}>Card Number</label><input style={inp} placeholder="1234 5678 9012 3456"/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                  <div style={fg}><label style={lbl}>Expiry</label><input style={inp} placeholder="MM/YY"/></div>
                  <div style={fg}><label style={lbl}>CVV</label><input type="password" style={inp} placeholder="•••"/></div>
                </div>
              </div>}
              {pay===PAYMENT_METHODS.ONLINE && <div style={{ padding:"0.7rem 0.85rem", background:"rgba(255,255,255,0.02)", borderRadius:"5px", margin:"0.4rem 0 0.65rem", fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", color:"rgba(255,255,255,0.4)" }}>You'll be redirected to a secure payment page to complete payment.</div>}
              <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.2rem" }}>
                <button style={{ ...btnO, flex:1 }} onClick={() => setBStep(4)}>← Back</button>
                <button style={{ ...btnY, flex:1 }} onClick={submitBooking}>Pay ₹{total} →</button>
              </div>
            </>}
          </>
        )}
      </div>
    </div>
  );

  const DetailModal = () => detGame && (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }} onClick={() => setDetGame(null)}>
      <div style={{ ...mBox, maxWidth:"440px" }} onClick={e => e.stopPropagation()}>
        <button className="nb" style={{ position:"absolute", top:"0.85rem", right:"0.85rem", color:"rgba(255,255,255,0.3)", fontSize:"1.2rem" }} onClick={() => setDetGame(null)}>×</button>
        <div style={{ fontSize:"2.7rem", marginBottom:"0.65rem" }}>{detGame.img}</div>
        <div style={{ display:"flex", gap:"5px", marginBottom:"0.8rem", flexWrap:"wrap" }}>
          {[[detGame.category,"rgba(245,200,66"],[`⏱ ${detGame.duration}`,"rgba(100,100,255"],[`👥 ${detGame.players}`,"rgba(0,180,100"]].map(([t,c]) => (
            <span key={t} style={{ padding:"3px 7px", background:`${c},0.1)`, border:`1px solid ${c},0.24)`, borderRadius:"2px", fontSize:"0.57rem", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700, color:`${c},0.8)` }}>{t}</span>
          ))}
        </div>
        <h3 style={{ fontSize:"1.5rem", fontWeight:900, textTransform:"uppercase", marginBottom:"0.5rem", fontFamily:"'Rajdhani',sans-serif" }}>{detGame.title}</h3>
        <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.82rem", lineHeight:1.7, marginBottom:"1rem" }}>{detGame.desc}</p>
        <div style={{ padding:"0.88rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.13)", borderRadius:"6px", marginBottom:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontSize:"0.55rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.13em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Per Player</div><div style={{ fontSize:"1.6rem", fontWeight:900, ...gradTxt, fontFamily:"'Rajdhani',sans-serif" }}>₹{detGame.price}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:"0.55rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Session</div><div style={{ fontWeight:700, color:"rgba(255,255,255,0.58)" }}>{detGame.duration}</div></div>
        </div>
        <button style={{ ...btnY, width:"100%" }} onClick={() => { const g = detGame; setDetGame(null); openBooking(null, g); }}>🎮 Book This Game</button>
      </div>
    </div>
  );

  // Sharmaji Ki Chai order modal
  const FoodOrderModal = () => {
    const activeCats = menuCats.filter(c => menu.some(m => m.category===c && m.available!==false));
    const shown = foodCat==="All" ? activeCats : [foodCat];
    return (
      <div style={{ position:"fixed", inset:0, zIndex:920, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)" }}>
        <div style={{ ...mBox, maxWidth: isMob ? "calc(100vw - 2rem)" : "560px" }}>
          {foodDone ? (
            <div style={{ textAlign:"center", padding:"1.2rem 0" }}>
              <span style={{ fontSize:"3rem", display:"block", marginBottom:"0.6rem" }}>🎉</span>
              <h3 style={{ fontSize:"1.4rem", fontWeight:900, textTransform:"uppercase", marginBottom:"0.3rem" }}>Order Placed!</h3>
              <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", marginBottom:"1rem" }}>Payment confirmed — thanks {foodInfo.name || "friend"}! Your order is now at the Sharmaji Ki Chai counter.</p>
              <div style={{ display:"inline-block", padding:"6px 18px", background:"rgba(245,200,66,0.1)", border:`1px solid rgba(245,200,66,0.35)`, borderRadius:"4px", fontWeight:900, letterSpacing:"0.15em", fontSize:"0.96rem", marginBottom:"1.2rem", color:Y }}>{foodOrderId}</div>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"6px", padding:"0.9rem", textAlign:"left", marginBottom:"1.2rem" }}>
                {cart.map(c => <div key={c.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", fontFamily:"'Inter',sans-serif", color:"rgba(255,255,255,0.6)", marginBottom:"3px" }}><span>{c.name} ×{c.qty}</span><span>₹{c.price*c.qty}</span></div>)}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, color:Y, paddingTop:"0.5rem", borderTop:"1px solid rgba(255,255,255,0.05)", marginTop:"0.3rem" }}><span>Total Paid</span><span>₹{cartTotal}</span></div>
              </div>
              <button style={{ ...btnY, width:"100%" }} onClick={() => { setFoodOpen(false); setCart([]); setFoodDone(false); setFoodStep(1); setFoodInfo({ name:"", phone:"" }); }}>Done</button>
            </div>
          ) : (<>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
              <div>
                <div style={{ fontWeight:900, fontSize:"0.95rem", textTransform:"uppercase", letterSpacing:"0.04em", ...gradTxt }}>🍵 Sharmaji Ki Chai</div>
                <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.64rem", fontFamily:"'Inter',sans-serif" }}>{["","Select Items","Your Details","Payment"][foodStep]} · Step {foodStep} of 3</div>
              </div>
              <button className="nb" style={{ color:"rgba(255,255,255,0.3)", fontSize:"1.2rem" }} onClick={() => setFoodOpen(false)}>×</button>
            </div>
            <div style={{ display:"flex", gap:"4px", marginBottom:"1rem" }}>{[1,2,3].map(s => <div key={s} style={{ flex:1, height:"3px", borderRadius:"2px", background: s<=foodStep ? `linear-gradient(90deg,${Y},${YD})` : "rgba(255,255,255,0.07)" }}/>)}</div>

            {foodStep===1 && <>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"0.8rem" }}>
                {["All", ...activeCats].map(c => <button key={c} className="nb" onClick={() => setFoodCat(c)} style={{ padding:"5px 11px", borderRadius:"3px", border:"1px solid", borderColor: foodCat===c ? Y : "rgba(255,255,255,0.1)", background: foodCat===c ? "rgba(245,200,66,0.1)" : "transparent", color: foodCat===c ? Y : "rgba(255,255,255,0.4)", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>{c}</button>)}
              </div>
              <div style={{ maxHeight:"46vh", overflowY:"auto", paddingRight:"3px" }}>
                {shown.map(cat => (
                  <div key={cat} style={{ marginBottom:"1rem" }}>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:Y, fontWeight:700, fontFamily:"'Inter',sans-serif", marginBottom:"0.4rem", paddingBottom:"0.3rem", borderBottom:"1px solid rgba(245,200,66,0.12)" }}>{cat}</div>
                    {menu.filter(m => m.category===cat && m.available!==false).map(it => { const q = qtyInCart(it.id); return (
                      <div key={it.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"0.6rem", padding:"0.5rem 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                        <div style={{ flex:1 }}><div style={{ fontSize:"0.82rem", fontFamily:"'Inter',sans-serif", color:"rgba(255,255,255,0.8)" }}>{it.name}</div><div style={{ fontWeight:800, color:Y, fontSize:"0.82rem", fontFamily:"'Rajdhani',sans-serif" }}>₹{it.price}</div></div>
                        {q>0 ? (
                          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                            <button className="nb" onClick={() => decFromCart(it.id)} style={{ width:"26px", height:"26px", borderRadius:"4px", border:`1px solid ${Y}`, color:Y, fontSize:"1rem", lineHeight:1 }}>−</button>
                            <span style={{ minWidth:"16px", textAlign:"center", fontWeight:800 }}>{q}</span>
                            <button className="nb" onClick={() => addToCart(it)} style={{ width:"26px", height:"26px", borderRadius:"4px", border:"none", background:`linear-gradient(135deg,${Y},${YD})`, color:"#0d0618", fontSize:"1rem", lineHeight:1, fontWeight:900 }}>+</button>
                          </div>
                        ) : (
                          <button className="nb" onClick={() => addToCart(it)} style={{ ...btnY, padding:"6px 14px", fontSize:"0.65rem" }}>Add +</button>
                        )}
                      </div>
                    ); })}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"0.6rem", marginTop:"0.9rem", paddingTop:"0.8rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily:"'Inter',sans-serif" }}><div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{cartCount} item{cartCount===1?"":"s"}</div><div style={{ fontWeight:900, color:Y, fontSize:"1.1rem" }}>₹{cartTotal}</div></div>
                <button disabled={cartCount===0} style={{ ...btnY, opacity: cartCount ? 1 : 0.35, cursor: cartCount ? "pointer" : "not-allowed" }} onClick={() => setFoodStep(2)}>Checkout →</button>
              </div>
            </>}

            {foodStep===2 && <>
              <div style={fg}><label style={lbl}>Your Name *</label><input style={inp} value={foodInfo.name} onChange={e => setFoodInfo({...foodInfo, name:e.target.value})}/></div>
              <div style={fg}><label style={lbl}>Phone *</label><input style={inp} value={foodInfo.phone} onChange={e => setFoodInfo({...foodInfo, phone:e.target.value})}/></div>
              <div style={{ padding:"0.8rem", background:"rgba(255,255,255,0.02)", borderRadius:"6px", marginBottom:"0.9rem", fontFamily:"'Inter',sans-serif", maxHeight:"30vh", overflowY:"auto" }}>
                {cart.map(c => <div key={c.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:"3px" }}><span>{c.name} ×{c.qty}</span><span>₹{c.price*c.qty}</span></div>)}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, color:Y, paddingTop:"0.4rem", borderTop:"1px solid rgba(255,255,255,0.05)" }}><span>Total</span><span>₹{cartTotal}</span></div>
              </div>
              <div style={{ display:"flex", gap:"0.6rem" }}>
                <button style={{ ...btnO, flex:1 }} onClick={() => setFoodStep(1)}>← Back</button>
                <button disabled={!foodInfo.name||!foodInfo.phone} style={{ ...btnY, flex:1, opacity:(foodInfo.name&&foodInfo.phone)?1:0.35 }} onClick={() => setFoodStep(3)}>Continue →</button>
              </div>
            </>}

            {foodStep===3 && <>
              <div style={{ padding:"0.8rem", background:"rgba(245,200,66,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:"5px", marginBottom:"1rem", fontFamily:"'Inter',sans-serif" }}>
                <div style={{ fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"0.55rem", fontSize:"0.75rem" }}>Order Summary</div>
                {cart.map(c => <div key={c.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.76rem", color:"rgba(255,255,255,0.4)", marginBottom:"2px" }}><span>{c.name} ×{c.qty}</span><span>₹{c.price*c.qty}</span></div>)}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, color:Y, paddingTop:"0.5rem", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:"0.95rem" }}><span>Total</span><span>₹{cartTotal}</span></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.85rem 0.95rem", border:`1px solid rgba(245,200,66,0.25)`, borderRadius:"6px", marginBottom:"1rem", background:"rgba(245,200,66,0.04)" }}>
                <span style={{ fontSize:"1.3rem" }}>🔒</span>
                <div><div style={{ fontWeight:700, fontSize:"0.83rem" }}>Pay securely with Razorpay</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.68rem", fontFamily:"'Inter',sans-serif" }}>UPI · Cards · Net Banking · Wallets</div></div>
              </div>
              <button style={{ ...btnY, width:"100%", opacity: payProcessing ? 0.6 : 1, cursor: payProcessing ? "wait" : "pointer" }} disabled={payProcessing} onClick={payWithRazorpay}>{payProcessing ? "Processing payment…" : `Pay ₹${cartTotal} with Razorpay →`}</button>
              <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.6rem" }}>
                <button style={{ ...btnO, flex:1 }} disabled={payProcessing} onClick={() => setFoodStep(2)}>← Back</button>
              </div>
              <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.66rem", fontFamily:"'Inter',sans-serif", textAlign:"center", marginTop:"0.7rem" }}>Your order is confirmed and sent to the counter only after payment succeeds.</p>
            </>}
          </>)}
        </div>
      </div>
    );
  };

  const Site = () => (
    <>
      {isMob ? MobileTopBar() : DesktopNav()}
      <main style={{ paddingTop: isMob ? 0 : "66px" }}>
        {Hero()}{Features()}{About()}{GamesSection()}{PartnerSection()}{ContactSection()}{Footer()}
      </main>
      {isMob && MobileBottomTabs()}
      {page==="booking" && BookingModal()}
      {foodOpen && FoodOrderModal()}
      {DetailModal()}
    </>
  );

  return (
    <div style={{ fontFamily:"'Rajdhani',sans-serif", background:BG, color:"#fff", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{CSS}</style>

      {/* Floating "Made by GlowFrame" credit → links to portfolio. Sits below modals (z 500) so it never covers a dialog. */}
      <a className="gfbadge" href={GLOWFRAME_URL} target="_blank" rel="noopener noreferrer" title="Website by GlowFrame — Design. Build. Elevate."
        style={{ position:"fixed", bottom: isMob ? "10px" : "16px", right: isMob ? "10px" : "16px", zIndex:500, display:"flex", alignItems:"center", gap: isMob ? "6px" : "7px", padding: isMob ? "3px 10px 3px 3px" : "4px 13px 4px 4px", borderRadius:"999px", textDecoration:"none", opacity:0.7, background:"rgba(8,5,16,0.92)", border:"1px solid rgba(167,139,250,0.5)", backdropFilter:"blur(12px)", boxShadow:"0 0 14px rgba(139,92,246,0.35), 0 4px 16px rgba(0,0,0,0.5)" }}>
        {/* Logo tile — actual GlowFrame mark */}
        <span style={{ width: isMob ? "22px" : "26px", height: isMob ? "22px" : "26px", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", background:"radial-gradient(circle at 50% 35%, #160e28 0%, #050309 90%)", border:"1px solid rgba(167,139,250,0.2)", flexShrink:0, overflow:"hidden" }}>
          <img src="data:image/png;base64,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" alt="GlowFrame" style={{ width: isMob ? "18px" : "22px", height: isMob ? "18px" : "22px", display:"block" }}/>
        </span>
        {/* Text */}
        <span style={{ fontSize: isMob ? "0.66rem" : "0.76rem", fontWeight:600, letterSpacing:"0.01em", fontFamily:"'Inter',sans-serif", whiteSpace:"nowrap" }}>
          <span style={{ color:"rgba(255,255,255,0.6)" }}>Made by </span>
          <span style={{ fontWeight:800, background:"linear-gradient(135deg,#c4b5fd 0%,#8b5cf6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>GlowFrame</span>
        </span>
      </a>
      <div style={{ position:"fixed", bottom:"20px", left:"20px", zIndex:9999, display:"flex", gap:"3px", background:"rgba(13,6,24,0.96)", border:"1px solid rgba(245,200,66,0.22)", borderRadius:"8px", padding:"3px", backdropFilter:"blur(14px)", boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>
        {[["desktop","🖥 Desktop"],["mobile","📱 Mobile"]].map(([v,l]) => (
          <button key={v} className="nb" onClick={() => setView(v)} style={{ padding:"5px 12px", borderRadius:"5px", background: view===v ? "rgba(245,200,66,0.15)" : "transparent", color: view===v ? Y : "rgba(255,255,255,0.35)", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", whiteSpace:"nowrap" }}>{l}</button>
        ))}
      </div>

      {isMob ? (
        <div style={{ minHeight:"100vh", background:"#05020c", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"40px", paddingBottom:"2rem" }}>
          <div style={{ width:"100%", maxWidth:"390px", background:"#16122c", borderRadius:"44px", padding:"4px", boxShadow:"0 0 0 1px rgba(245,200,66,0.1), 0 40px 80px rgba(0,0,0,0.75)" }}>
            <div style={{ height:"32px", background:BG, borderRadius:"40px 40px 0 0", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
              <div style={{ width:"66px", height:"10px", borderRadius:"5px", background:"rgba(255,255,255,0.06)" }}/>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
            </div>
            <div style={{ background:BG, maxHeight:"76vh", overflowY:"auto", overflowX:"hidden" }}>{Site()}</div>
            <div style={{ height:"28px", background:BG, borderRadius:"0 0 40px 40px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"100px", height:"4px", borderRadius:"3px", background:"rgba(255,255,255,0.1)" }}/>
            </div>
          </div>
        </div>
      ) : Site()}
    </div>
  );
}
