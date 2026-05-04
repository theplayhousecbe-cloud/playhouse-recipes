import { useState, useEffect, useRef } from "react";

const OWNER_PIN = "1234";

const SAMPLE_RECIPES = [
  {
    id: 1,
    title: "Mango Dice Masala Smash",
    time: "", serves: 1, category: "Drink", emoji: "🥭",
    description: "Juicy mango and tangy blackcurrant, served chilled with a masala kick.",
    ingredients: [
      { name: "Mango drink", qty: "180 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Ice", qty: "Half glass" },
      { name: "Salt", qty: "Pinch" },
      { name: "Chaat Masala", qty: "Less than pinch" },
      { name: "Lemon", qty: "3 drops" },
      { name: "Mint", qty: "2–3 leaves" },
    ],
    steps: [
      "Add mint, lemon, salt and chaat masala in glass.",
      "Fill glass halfway with ice.",
      "Pour blackcurrant over ice.",
      "Top up with mango drink.",
      "Stir gently and serve chilled.",
    ],
  },
  {
    id: 2,
    title: "Thums Up Masala Storm",
    time: "", serves: 1, category: "Drink", emoji: "🥤",
    description: "Bold Thums Up with blackcurrant and masala — a storm in every sip.",
    ingredients: [
      { name: "Thums Up", qty: "200 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Ice", qty: "Half glass" },
      { name: "Chaat Masala", qty: "Pinch" },
      { name: "Lemon", qty: "2 drops" },
    ],
    steps: [
      "Add ice to the glass.",
      "Pour blackcurrant over ice.",
      "Slowly pour Thums Up to retain fizz.",
      "Add a pinch of chaat masala and lemon drops.",
      "Serve immediately.",
    ],
  },
  {
    id: 3,
    title: "Ludo Lychee Mint Splash",
    time: "", serves: 1, category: "Drink", emoji: "🍹",
    description: "Sweet lychee with fresh mint and blackcurrant — refreshing and fruity.",
    ingredients: [
      { name: "Lychee drink", qty: "180 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Mint leaves", qty: "4–5 leaves" },
      { name: "Lemon", qty: "3 drops" },
      { name: "Ice", qty: "Half glass" },
    ],
    steps: [
      "Muddle mint leaves at the bottom of the glass.",
      "Add ice.",
      "Pour blackcurrant over ice.",
      "Top up with lychee drink.",
      "Add lemon drops and stir lightly.",
    ],
  },
  {
    id: 4,
    title: "Uno Cranberry Twist",
    time: "", serves: 1, category: "Drink", emoji: "🍒",
    description: "Tangy cranberry layered with blackcurrant — bold and beautiful.",
    ingredients: [
      { name: "Cranberry drink", qty: "180 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Ice", qty: "Half glass" },
      { name: "Lemon", qty: "2 drops" },
    ],
    steps: [
      "Fill glass with ice.",
      "Pour blackcurrant first.",
      "Slowly pour cranberry drink over the back of a spoon for layered effect.",
      "Add lemon drops.",
      "Serve without stirring for best presentation.",
    ],
  },
  {
    id: 5,
    title: "Monopoly Mixed Fruit Magic",
    time: "", serves: 1, category: "Drink", emoji: "🍊",
    description: "Mixed fruit medley with blackcurrant — a magic blend of flavours.",
    ingredients: [
      { name: "Mixed fruit drink", qty: "180 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Ice", qty: "Half glass" },
      { name: "Mint", qty: "2 leaves" },
      { name: "Lemon", qty: "2 drops" },
    ],
    steps: [
      "Add ice to the glass.",
      "Pour blackcurrant over ice.",
      "Top up with mixed fruit drink.",
      "Garnish with mint and lemon drops.",
      "Stir gently and serve.",
    ],
  },
  {
    id: 6,
    title: "Pepsi Puzzle Pop",
    time: "", serves: 1, category: "Drink", emoji: "🥤",
    description: "Fizzy Pepsi with blackcurrant swirl — a crowd favourite every time.",
    ingredients: [
      { name: "Pepsi", qty: "200 ml" },
      { name: "Blackcurrant", qty: "20 ml" },
      { name: "Ice", qty: "Half glass" },
      { name: "Lemon", qty: "2 drops" },
    ],
    steps: [
      "Fill glass with ice.",
      "Pour blackcurrant over ice.",
      "Slowly pour Pepsi to keep the fizz.",
      "Add lemon drops on top.",
      "Serve immediately without stirring.",
    ],
  },
];

const CATEGORIES = ["All", "Veg", "Drink", "Dessert"];
const EMOJIS = ["🍲","🥗","🍛","🥘","🍜","🫓","🥭","🍰","🧁","🥤","🍱","🥚","🫕","🍮","🧆","🥞"];

const CAT_COLOR = { Veg:"#2d7a4f", Drink:"#1a6e8e", Dessert:"#8e44ad" };

const s = {
  input: {
    width:"100%", padding:"10px 14px", borderRadius:12,
    border:"1.5px solid #ede5dc", background:"#fff", fontSize:15,
    color:"#1a1208", outline:"none", fontFamily:"inherit", boxSizing:"border-box",
  },
  label: { fontSize:13, fontWeight:600, color:"#8a7a6a", marginBottom:5, display:"block" },
  btn: (primary) => ({
    padding: primary ? "13px 0" : "9px 18px",
    width: primary ? "100%" : "auto",
    background: primary ? "#c0392b" : "#fdf6f0",
    color: primary ? "#fff" : "#c0392b",
    border: primary ? "none" : "1.5px solid #f0d8d0",
    borderRadius:14, fontSize:15, fontWeight:700,
    cursor:"pointer", fontFamily:"inherit",
  }),
};

function Badge({ label }) {
  const color = CAT_COLOR[label] || "#888";
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
    background:color+"18", color, letterSpacing:0.3 }}>{label}</span>;
}

function RecipeCard({ recipe, onClick, isOwner, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div onClick={onClick} style={{
      background:"#fff", borderRadius:18, border:"1px solid #f0ece6",
      padding:"16px", cursor:"pointer", position:"relative",
      boxShadow:"0 2px 10px rgba(0,0,0,0.04)",
    }}>
      {isOwner && !confirmDelete && (
        <button onClick={e => { e.stopPropagation(); setConfirmDelete(true); }} style={{
          position:"absolute", top:12, right:12, background:"#fff0ee",
          border:"none", borderRadius:8, padding:"4px 8px", cursor:"pointer",
          fontSize:14, color:"#c0392b", fontWeight:700,
        }}>✕</button>
      )}
      {isOwner && confirmDelete && (
        <div onClick={e => e.stopPropagation()} style={{
          position:"absolute", top:10, right:10, background:"#fff",
          border:"1.5px solid #f0d8d0", borderRadius:12, padding:"8px 12px",
          display:"flex", alignItems:"center", gap:8, boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <span style={{ fontSize:12, color:"#c0392b", fontWeight:600 }}>Delete?</span>
          <button onClick={e => { e.stopPropagation(); onDelete(recipe.id); }} style={{
            background:"#c0392b", color:"#fff", border:"none", borderRadius:8,
            padding:"4px 10px", cursor:"pointer", fontSize:12, fontWeight:700,
          }}>Yes</button>
          <button onClick={e => { e.stopPropagation(); setConfirmDelete(false); }} style={{
            background:"#f5f0ea", color:"#888", border:"none", borderRadius:8,
            padding:"4px 10px", cursor:"pointer", fontSize:12, fontWeight:700,
          }}>No</button>
        </div>
      )}
      <div style={{ fontSize:40, textAlign:"center", background:"#fdf6f0",
        borderRadius:14, padding:"12px 0", marginBottom:12 }}>{recipe.emoji}</div>
      <h3 style={{ margin:"0 0 6px", fontSize:17, fontWeight:700, color:"#1a1208",
        fontFamily:"'Playfair Display', serif" }}>{recipe.title}</h3>
      <p style={{ margin:"0 0 10px", fontSize:13, color:"#9a8a7a", lineHeight:1.5 }}>
        {recipe.description}
      </p>
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <Badge label={recipe.category} />
        <span style={{ fontSize:12, color:"#bbb" }}>⏱ {recipe.time}</span>
        <span style={{ fontSize:12, color:"#bbb" }}>👥 {recipe.serves}</span>
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack }) {
  return (
    <div style={{ paddingBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onBack} style={{ background:"#fdf6f0", border:"none", borderRadius:12,
          padding:"8px 14px", cursor:"pointer", fontSize:18, color:"#c0392b" }}>←</button>
        <h2 style={{ margin:0, fontSize:20, fontFamily:"'Playfair Display', serif",
          color:"#1a1208", fontWeight:700 }}>{recipe.title}</h2>
      </div>
      <div style={{ fontSize:56, textAlign:"center", background:"#fdf6f0",
        borderRadius:20, padding:"18px 0", marginBottom:18 }}>{recipe.emoji}</div>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <Badge label={recipe.category} />
        <span style={{ fontSize:13, color:"#bbb" }}>⏱ {recipe.time}</span>
        <span style={{ fontSize:13, color:"#bbb" }}>👥 Serves {recipe.serves}</span>
      </div>
      <p style={{ color:"#6a5a4a", fontSize:15, lineHeight:1.6, marginBottom:22 }}>
        {recipe.description}
      </p>
      <h3 style={{ fontSize:16, fontWeight:700, color:"#1a1208", marginBottom:10,
        fontFamily:"'Playfair Display', serif" }}>🛒 Ingredients</h3>
      <div style={{ background:"#fdf6f0", borderRadius:16, padding:"12px 16px", marginBottom:22 }}>
        {recipe.ingredients.map((ing, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between",
            padding:"7px 0", borderBottom: i < recipe.ingredients.length-1 ? "1px solid #f0e8e0":"none" }}>
            <span style={{ fontSize:15, color:"#2a1a0a" }}>{ing.name}</span>
            <span style={{ fontSize:14, fontWeight:700, color:"#c0392b" }}>{ing.qty}</span>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize:16, fontWeight:700, color:"#1a1208", marginBottom:10,
        fontFamily:"'Playfair Display', serif" }}>📋 Steps</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {recipe.steps.map((step, i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"#c0392b",
              color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, flexShrink:0, marginTop:2 }}>{i+1}</div>
            <p style={{ margin:0, fontSize:15, color:"#3a2a1a", lineHeight:1.6 }}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRecipeForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ title:"", description:"", time:"", serves:4, category:"Veg", emoji:"🍲" });
  const [ingredients, setIngredients] = useState([{ name:"", qty:"" }]);
  const [steps, setSteps] = useState([""]);

  const up = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const addIng = () => setIngredients(a => [...a, { name:"", qty:"" }]);
  const upIng = (i,k,v) => setIngredients(a => a.map((x,j) => j===i ? { ...x,[k]:v } : x));
  const delIng = (i) => setIngredients(a => a.filter((_,j) => j!==i));
  const addStep = () => setSteps(a => [...a, ""]);
  const upStep = (i,v) => setSteps(a => a.map((x,j) => j===i ? v : x));
  const delStep = (i) => setSteps(a => a.filter((_,j) => j!==i));

  const submit = () => {
    if (!form.title.trim()) { alert("Please add a recipe title"); return; }
    onAdd({
      id: Date.now(),
      ...form,
      serves: parseInt(form.serves)||4,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.trim()),
    });
  };

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
        <button onClick={onCancel} style={{ background:"#fdf6f0", border:"none", borderRadius:12,
          padding:"8px 14px", cursor:"pointer", fontSize:18, color:"#c0392b" }}>←</button>
        <h2 style={{ margin:0, fontSize:20, fontFamily:"'Playfair Display', serif",
          color:"#1a1208", fontWeight:700 }}>New Recipe</h2>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => up("emoji",e)} style={{
            fontSize:22, background: form.emoji===e ? "#fdf6f0":"transparent",
            border: form.emoji===e ? "2px solid #c0392b":"2px solid transparent",
            borderRadius:10, padding:"5px 8px", cursor:"pointer",
          }}>{e}</button>
        ))}
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={s.label}>Recipe Name *</label>
        <input style={s.input} placeholder="e.g. Chicken Biryani" value={form.title}
          onChange={e => up("title", e.target.value)} />
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={s.label}>Description</label>
        <textarea style={{ ...s.input, minHeight:72, resize:"vertical" }}
          placeholder="Short description..." value={form.description}
          onChange={e => up("description", e.target.value)} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
        <div>
          <label style={s.label}>Category</label>
          <select style={{ ...s.input, padding:"10px 8px" }} value={form.category}
            onChange={e => up("category", e.target.value)}>
            {CATEGORIES.filter(c => c!=="All").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={s.label}>Cook Time</label>
          <input style={s.input} placeholder="30 min" value={form.time}
            onChange={e => up("time", e.target.value)} />
        </div>
        <div>
          <label style={s.label}>Serves</label>
          <input style={s.input} type="number" min={1} value={form.serves}
            onChange={e => up("serves", e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <label style={{ ...s.label, margin:0 }}>🛒 Ingredients</label>
          <button onClick={addIng} style={s.btn(false)}>+ Add</button>
        </div>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
            <input style={{ ...s.input, flex:2 }} placeholder="Name" value={ing.name}
              onChange={e => upIng(i,"name",e.target.value)} />
            <input style={{ ...s.input, flex:1 }} placeholder="Qty" value={ing.qty}
              onChange={e => upIng(i,"qty",e.target.value)} />
            {ingredients.length>1 && (
              <button onClick={() => delIng(i)} style={{ background:"none", border:"none",
                cursor:"pointer", color:"#c0392b", fontSize:18, flexShrink:0 }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <label style={{ ...s.label, margin:0 }}>📋 Steps</label>
          <button onClick={addStep} style={s.btn(false)}>+ Add</button>
        </div>
        {steps.map((step, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"#f0e8e0",
              color:"#c0392b", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700, flexShrink:0, marginTop:10 }}>{i+1}</div>
            <textarea style={{ ...s.input, flex:1, minHeight:60, resize:"vertical" }}
              placeholder={`Step ${i+1}...`} value={step}
              onChange={e => upStep(i, e.target.value)} />
            {steps.length>1 && (
              <button onClick={() => delStep(i)} style={{ background:"none", border:"none",
                cursor:"pointer", color:"#c0392b", fontSize:18, flexShrink:0, marginTop:8 }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button onClick={submit} style={s.btn(true)}>🍽 Save Recipe</button>
    </div>
  );
}

function PinModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pin === OWNER_PIN) { onSuccess(); }
    else { setErr(true); setPin(""); }
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,10,5,0.55)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
      <div style={{ background:"#fff", borderRadius:22, padding:"28px 24px", width:280,
        textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:12 }}>🔐</div>
        <h3 style={{ margin:"0 0 6px", fontFamily:"'Playfair Display', serif",
          fontSize:18, color:"#1a1208" }}>Owner Access</h3>
        <p style={{ margin:"0 0 18px", fontSize:13, color:"#9a8a7a" }}>Enter your PIN to manage recipes</p>
        <input type="password" maxLength={6} style={{ ...s.input, textAlign:"center",
          fontSize:22, letterSpacing:8, marginBottom:10 }}
          placeholder="••••" value={pin}
          onChange={e => { setPin(e.target.value); setErr(false); }}
          onKeyDown={e => e.key==="Enter" && submit()} autoFocus />
        {err && <p style={{ color:"#c0392b", fontSize:13, margin:"0 0 10px" }}>Wrong PIN. Try again.</p>}
        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          <button onClick={onClose} style={{ ...s.btn(false), flex:1 }}>Cancel</button>
          <button onClick={submit} style={{ ...s.btn(true), flex:1, padding:"13px 0" }}>Enter</button>
        </div>
        <p style={{ fontSize:11, color:"#ccc", marginTop:14 }}>Default PIN: 1234 — change in code</p>
      </div>
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [view, setView] = useState("feed");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef();

  const downloadTemplate = () => {
    const rows = [
      ["title","description","category","time","serves","emoji","ingredients","steps"],
      ["Mango Lassi","Refreshing mango yogurt drink","Drink","10 min","2","🥤","Mango:1 cup | Yogurt:half cup | Sugar:2 tbsp","Blend all | Pour over ice | Serve chilled"],
      ["Veg Biryani","Fragrant spiced rice","Veg","40 min","4","🍲","Basmati rice:2 cups | Mixed veg:1 cup | Ghee:1 tbsp","Soak rice 30 min | Fry spices | Add veg and rice | Cook 20 min"],
      ["Chocolate Mousse","Light chocolate dessert","Dessert","20 min","3","🍰","Dark chocolate:100g | Cream:200ml | Sugar:3 tbsp","Melt chocolate | Whip cream | Fold together | Chill 1 hr"],
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const a = document.createElement("a");
    a.setAttribute("href", uri);
    a.setAttribute("download", "playhouse_recipes_template.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.trim().split("\n");
        const parseCSVLine = (line) => {
          const result = [];
          let cur = "", inQ = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQ = !inQ; }
            else if (ch === ',' && !inQ) { result.push(cur.trim()); cur = ""; }
            else { cur += ch; }
          }
          result.push(cur.trim());
          return result;
        };
        const rows = lines.slice(1).map(parseCSVLine);
        const imported = rows.filter(r => r[0]).map(r => ({
          id: Date.now() + Math.random(),
          title: r[0] || "",
          description: r[1] || "",
          category: ["Veg","Drink","Dessert"].includes(r[2]) ? r[2] : "Veg",
          time: r[3] || "",
          serves: parseInt(r[4]) || 2,
          emoji: r[5] || "🍲",
          ingredients: (r[6]||"").split("|").map(i => {
            const [name, qty] = i.split(":").map(s => s.trim());
            return { name: name||"", qty: qty||"" };
          }).filter(i => i.name),
          steps: (r[7]||"").split("|").map(s => s.trim()).filter(Boolean),
        }));
        if (imported.length === 0) { setImportMsg("❌ No recipes found. Check format."); return; }
        saveRecipes([...imported, ...recipes]);
        setImportMsg(`✅ ${imported.length} recipe${imported.length>1?"s":""} imported!`);
        setTimeout(() => setImportMsg(null), 3000);
      } catch {
        setImportMsg("❌ Error reading file. Use the template.");
        setTimeout(() => setImportMsg(null), 3000);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("recipes");
        if (res?.value) setRecipes(JSON.parse(res.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const saveRecipes = async (updated) => {
    setRecipes(updated);
    try { await window.storage.set("recipes", JSON.stringify(updated)); } catch {}
  };

  const addRecipe = (recipe) => {
    saveRecipes([recipe, ...recipes]);
    setView("feed");
  };

  const deleteRecipe = (id) => {
    saveRecipes(recipes.filter(r => r.id !== id));
  };

  const filtered = recipes.filter(r => {
    const matchCat = filter==="All" || r.category===filter;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!loaded) return <div style={{ padding:40, textAlign:"center", color:"#c0392b", fontSize:24 }}>🍽</div>;

  return (
    <div style={{ maxWidth:420, margin:"0 auto", padding:"20px 16px 40px",
      fontFamily:"'DM Sans', sans-serif", minHeight:"100vh", background:"#faf7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing:border-box; }
        input:focus, textarea:focus, select:focus {
          border-color:#c0392b !important;
          box-shadow:0 0 0 3px rgba(192,57,43,0.10) !important;
        }
      `}</style>

      {showPin && <PinModal onSuccess={() => { setIsOwner(true); setShowPin(false); }} onClose={() => setShowPin(false)} />}

      {view==="feed" && (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h1 style={{ margin:0, fontSize:26, fontFamily:"'Playfair Display', serif",
                color:"#1a1208", lineHeight:1.2 }}>Playhouse<br/>Recipes 🍴</h1>
              {isOwner && <span style={{ fontSize:12, background:"#fff0ee", color:"#c0392b",
                padding:"3px 10px", borderRadius:20, fontWeight:700 }}>Owner Mode</span>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
              {isOwner ? (
                <>
                  <button onClick={() => setView("add")} style={s.btn(true)}>+ New Recipe</button>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => fileRef.current.click()} style={{ ...s.btn(false), fontSize:12, padding:"7px 12px" }}>📥 Import Excel</button>
                    <button onClick={downloadTemplate} style={{ ...s.btn(false), fontSize:12, padding:"7px 12px" }}>📄 Template</button>
                  </div>
                  <button onClick={() => setIsOwner(false)} style={{ background:"none", border:"none",
                    color:"#bbb", fontSize:12, cursor:"pointer" }}>Exit owner mode</button>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display:"none" }} onChange={handleImport} />
                </>
              ) : (
                <button onClick={() => setShowPin(true)} style={s.btn(false)}>🔐 Owner</button>
              )}
            </div>
          </div>

          {importMsg && (
            <div style={{ background: importMsg.startsWith("✅") ? "#eafaf1":"#fff0ee",
              color: importMsg.startsWith("✅") ? "#2d7a4f":"#c0392b",
              borderRadius:12, padding:"10px 16px", marginBottom:14,
              fontSize:14, fontWeight:600, textAlign:"center" }}>
              {importMsg}
            </div>
          )}

          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
            <input style={{ ...s.input, paddingLeft:42 }} placeholder="Search recipes..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8,
            marginBottom:18, scrollbarWidth:"none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                flexShrink:0, padding:"7px 16px", borderRadius:20,
                border:"1.5px solid " + (filter===cat ? "#c0392b":"#f0e8e0"),
                background: filter===cat ? "#c0392b":"#fff",
                color: filter===cat ? "#fff":"#8a7a6a",
                fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit",
              }}>{cat}</button>
            ))}
          </div>

          {filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:"#bbb" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🍽</div>
              <p style={{ fontSize:15 }}>No recipes yet.{isOwner ? " Add your first one!" : ""}</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map(r => (
                <RecipeCard key={r.id} recipe={r}
                  onClick={() => { setSelected(r); setView("detail"); }}
                  isOwner={isOwner} onDelete={deleteRecipe} />
              ))}
            </div>
          )}
        </>
      )}

      {view==="detail" && selected && (
        <RecipeDetail recipe={selected} onBack={() => setView("feed")} />
      )}

      {view==="add" && isOwner && (
        <AddRecipeForm onAdd={addRecipe} onCancel={() => setView("feed")} />
      )}
    </div>
  );
}
