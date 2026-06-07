import { useState, useRef } from "react";

const DEFAULT_DATA = {
  personal: {
    name: "Syed Afroz",
    phone: "+91 8179706839",
    email: "syedafroz7492@gmail.com",
    linkedin: "linkedin.com/in/s-yedafroz/",
    linkedinLabel: "syed afroz",
  },
  summary:
    "Business Analyst at Myntra. Proficient in SQL, Python, and Power BI — comfortable working across ambiguous business problems, stakeholder requests, and large datasets. Known for translating complex data into clear decisions for non-technical teams. Transitioning into Product Analytics with a strong foundation in user behavior, conversion metrics, and customer lifecycle analysis.",
  experience: [
    {
      id: 1,
      company: "Myntra",
      location: "Bangalore",
      role: "Associate Business Planning (Business Analyst)",
      from: "Aug 2025",
      to: "Present",
      points: [
        "Developed 15+ ad-hoc sales performance reports weekly (YTD, MTD, daily) tracking revenue, units sold, PPV, AISP, and GM%, helping 5+ category & marketing teams make faster decisions.",
        "Proposed and built a customer analytics dashboard tracking MAU, new-to-platform/category users, transactions per customer, demographic segments, and lapsing cohorts (L1M to L12M buckets) — adopted by product and growth teams for retention and lifecycle decisions.",
        "Built a seller performance dashboard covering L30/L60/L90 metrics, AISP, live inventory, and new SKUs, used by 20+ stakeholders monthly for seller negotiations and stock planning.",
        "Identified a 12% MoM dip in GM% through business performance reporting, enabling category managers to take corrective pricing and procurement actions.",
        "Fulfilled 30+ departmental data requests per month for campaign planning, pricing decisions, and inventory strategy.",
        "Tracked product visibility and conversion metrics (RPI, CTR, CVR, UPV, and UPI) across categories to surface underperforming SKUs and inform ad placement decisions.",
        "Automated 10+ recurring reports, reducing manual effort by 30% and saving 15+ hours/week — freeing team bandwidth for higher-order analysis.",
      ],
    },
    {
      id: 2,
      company: "Bijliride",
      location: "Hyderabad",
      role: "Business Analyst Intern",
      from: "Mar 2025",
      to: "Jul 2025",
      points: [
        "Delivered sales, payment, and inventory reports for 4000+ vehicles across B2B, B2C, and 3PL vendors, improving operational visibility and fleet management.",
        "Built a vehicle-level revenue tracker to monitor daily earnings and utilization rate, identifying 20% underutilized vehicles and supporting fleet optimization.",
        "Created a service performance dashboard tracking technician TAT & issue resolution, helping reduce average service time by 18%.",
        "Processed structured and semi-structured JSON data using Python & Excel, extracting 10+ key KPIs for business teams.",
        "Automated reconciliation tasks, cutting data processing time by 30% and saving 6+ hours/week.",
      ],
    },
    {
      id: 3,
      company: "Sports Authority of Telangana State",
      location: "Hyderabad",
      role: "Data Analyst Intern",
      from: "Dec 2024",
      to: "Dec 2024",
      points: [
        "Managed data for 32k+ athletes across 41 sports disciplines and 401 events, enhancing accuracy and reducing processing delays.",
        "Tracked 25+ performance KPIs and built dashboards in Apache Superset to generate event insights for stakeholders.",
      ],
    },
  ],
  skills: [
    {
      id: 1,
      items: "SQL, Python, Advanced Excel (Power Query, Pivot Tables, XLOOKUP, INDEX-MATCH, Macros), Power BI, Apache Superset",
    },
    {
      id: 2,
      items: "Data Cleaning & Transformation, EDA, Dashboarding, KPI Development, Reporting Automation",
    },
    {
      id: 3,
      items: "A/B Testing, Forecasting, Inventory Optimization, Funnel Analysis, Retention Analysis, Cohort Analysis, Data-driven decisions",
    },
    {
      id: 4,
      items: "E-commerce & Retail Analytics, Operations & Supply Chain Analytics, Sales & Marketing Analytics, Product Category Management",
    },
  ],
  education: [
    {
      id: 1,
      institution: "University of Hyderabad",
      location: "Hyderabad, Telangana",
      degree: "MBA in Business Analytics",
      from: "Sep 2023",
      to: "May 2025",
      coursework:
        "Spreadsheet Modeling, Operations & Supply Chain Management, Text Social Media & Web Analytics, Statistics, Econometrics and Business Forecasting, Machine Learning & Data Mining",
    },
    {
      id: 2,
      institution: "University of Hyderabad",
      location: "Hyderabad, Telangana",
      degree: "B.Sc. in Applied Geology",
      from: "Aug 2019",
      to: "Jul 2022",
      coursework: "",
    },
  ],
};

// ─── tiny reusable form bits ───────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#888", marginBottom: 4 }}>
      {children}
    </div>
  );
}
function FInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <Label>{label}</Label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "7px 9px", fontSize: 12.5, border: "1px solid #ddd", borderRadius: 5, fontFamily: "inherit", background: "#fafafa", color: "#222" }}
      />
    </div>
  );
}
function FTextarea({ label, value, onChange, rows = 3 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <Label>{label}</Label>}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: "7px 9px", fontSize: 12.5, border: "1px solid #ddd", borderRadius: 5, fontFamily: "inherit", resize: "vertical", lineHeight: 1.5, background: "#fafafa", color: "#222" }}
      />
    </div>
  );
}
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 12px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a2e", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#ccc" }} />
    </div>
  );
}
const ghostBtn = { background: "none", border: "1px solid #ddd", borderRadius: 5, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#555" };
const addBtn   = { ...ghostBtn, borderColor: "#1a1a2e", color: "#1a1a2e" };
const delBtn   = { ...ghostBtn, borderColor: "#f0c4b3", color: "#c0522a" };

// ─── Editor ───────────────────────────────────────────────────────────────
function Editor({ data, set }) {
  const upP = (k, v) => set(d => ({ ...d, personal: { ...d.personal, [k]: v } }));

  const upExp = (id, k, v) =>
    set(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }));
  const upExpPt = (id, i, v) =>
    set(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, points: e.points.map((p, j) => j === i ? v : p) } : e) }));
  const addExpPt = (id) =>
    set(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, points: [...e.points, ""] } : e) }));
  const delExpPt = (id, i) =>
    set(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, points: e.points.filter((_, j) => j !== i) } : e) }));
  const addExp = () =>
    set(d => ({ ...d, experience: [...d.experience, { id: Date.now(), company: "", location: "", role: "", from: "", to: "", points: [""] }] }));
  const delExp = (id) =>
    set(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));

  const upSkill = (id, v) =>
    set(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, items: v } : s) }));
  const addSkill = () =>
    set(d => ({ ...d, skills: [...d.skills, { id: Date.now(), items: "" }] }));
  const delSkill = (id) =>
    set(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));

  const upEdu = (id, k, v) =>
    set(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [k]: v } : e) }));
  const addEdu = () =>
    set(d => ({ ...d, education: [...d.education, { id: Date.now(), institution: "", location: "", degree: "", from: "", to: "", coursework: "" }] }));
  const delEdu = (id) =>
    set(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  return (
    <div style={{ padding: "20px 18px 40px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 }}>Resume Editor</div>
      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}>Jake's Resume template · live preview →</div>

      <Divider label="Personal" />
      <FInput label="Full Name"    value={data.personal.name}         onChange={v => upP("name", v)} />
      <FInput label="Phone"        value={data.personal.phone}        onChange={v => upP("phone", v)} />
      <FInput label="Email"        value={data.personal.email}        onChange={v => upP("email", v)} />
      <FInput label="LinkedIn URL" value={data.personal.linkedin}     onChange={v => upP("linkedin", v)} />
      <FInput label="LinkedIn Display Label" value={data.personal.linkedinLabel} onChange={v => upP("linkedinLabel", v)} />

      <Divider label="Summary" />
      <FTextarea value={data.summary} onChange={v => set(d => ({ ...d, summary: v }))} rows={5} />

      <Divider label="Experience" />
      {data.experience.map((exp, ei) => (
        <div key={exp.id} style={{ border: "1px solid #eee", borderRadius: 7, padding: 12, marginBottom: 12, background: "#fafafa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#777" }}>#{ei + 1}</span>
            <button style={delBtn} onClick={() => delExp(exp.id)}>Remove</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <FInput label="Company"  value={exp.company}  onChange={v => upExp(exp.id, "company", v)} />
            <FInput label="Location" value={exp.location} onChange={v => upExp(exp.id, "location", v)} />
          </div>
          <FInput label="Role / Title" value={exp.role} onChange={v => upExp(exp.id, "role", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <FInput label="From" value={exp.from} onChange={v => upExp(exp.id, "from", v)} placeholder="Aug 2024" />
            <FInput label="To"   value={exp.to}   onChange={v => upExp(exp.id, "to",   v)} placeholder="Present" />
          </div>
          <Label>Bullet Points</Label>
          {exp.points.map((pt, pi) => (
            <div key={pi} style={{ display: "flex", gap: 5, marginBottom: 5 }}>
              <textarea
                rows={2}
                value={pt}
                onChange={e => upExpPt(exp.id, pi, e.target.value)}
                style={{ flex: 1, padding: "6px 8px", fontSize: 12, border: "1px solid #ddd", borderRadius: 4, fontFamily: "inherit", resize: "vertical", lineHeight: 1.45 }}
              />
              <button style={{ ...delBtn, alignSelf: "flex-start", marginTop: 1 }} onClick={() => delExpPt(exp.id, pi)}>✕</button>
            </div>
          ))}
          <button style={addBtn} onClick={() => addExpPt(exp.id)}>+ bullet</button>
        </div>
      ))}
      <button style={addBtn} onClick={addExp}>+ Add Experience</button>

      <Divider label="Skills" />
      {data.skills.map((sk, si) => (
        <div key={sk.id} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "flex-start" }}>
          <textarea
            rows={2}
            value={sk.items}
            onChange={e => upSkill(sk.id, e.target.value)}
            style={{ flex: 1, padding: "6px 8px", fontSize: 12, border: "1px solid #ddd", borderRadius: 4, fontFamily: "inherit", resize: "vertical", lineHeight: 1.45 }}
            placeholder={`Skill line ${si + 1}`}
          />
          <button style={{ ...delBtn, marginTop: 2 }} onClick={() => delSkill(sk.id)}>✕</button>
        </div>
      ))}
      <button style={addBtn} onClick={addSkill}>+ Add Skill Line</button>

      <Divider label="Education" />
      {data.education.map((edu, ei) => (
        <div key={edu.id} style={{ border: "1px solid #eee", borderRadius: 7, padding: 12, marginBottom: 12, background: "#fafafa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#777" }}>#{ei + 1}</span>
            <button style={delBtn} onClick={() => delEdu(edu.id)}>Remove</button>
          </div>
          <FInput label="Institution" value={edu.institution} onChange={v => upEdu(edu.id, "institution", v)} />
          <FInput label="Location"    value={edu.location}    onChange={v => upEdu(edu.id, "location", v)} />
          <FInput label="Degree"      value={edu.degree}      onChange={v => upEdu(edu.id, "degree", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <FInput label="From" value={edu.from} onChange={v => upEdu(edu.id, "from", v)} />
            <FInput label="To"   value={edu.to}   onChange={v => upEdu(edu.id, "to",   v)} />
          </div>
          <FTextarea label="Relevant Coursework (optional)" value={edu.coursework} onChange={v => upEdu(edu.id, "coursework", v)} rows={2} />
        </div>
      ))}
      <button style={addBtn} onClick={addEdu}>+ Add Education</button>
    </div>
  );
}

// ─── Jake Template ─────────────────────────────────────────────────────────
function JakeTemplate({ data }) {
  // mimics LaTeX Jake resume visual exactly
  const page = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 10.5,
    color: "#000",
    background: "#fff",
    padding: "36px 48px 36px 48px",
    lineHeight: 1.35,
    minHeight: "100%",
    boxSizing: "border-box",
  };

  const sectionTitle = {
    fontSize: 13,
    fontWeight: 700,
    fontVariant: "small-caps",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 3,
    marginTop: 14,
  };

  const hrStyle = {
    border: "none",
    borderTop: "1px solid #000",
    margin: "2px 0 6px",
  };

  const subheadRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  };

  const boldSm = { fontWeight: 700, fontSize: 10.5 };
  const italicSm = { fontStyle: "italic", fontSize: 10 };

  return (
    <div style={page}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, fontVariant: "small-caps", letterSpacing: "0.04em" }}>
          {data.personal.name || "Your Name"}
        </div>
        <div style={{ fontSize: 10, marginTop: 4, display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "0 10px" }}>
          {data.personal.phone && (
            <span>📞 {data.personal.phone}</span>
          )}
          {data.personal.email && (
            <span>✉ <span style={{ color: "#00007f" }}>{data.personal.email}</span></span>
          )}
          {data.personal.linkedin && (
            <span>🔗 <span style={{ color: "#00007f" }}>{data.personal.linkedinLabel || data.personal.linkedin}</span></span>
          )}
        </div>
      </div>

      {/* ── Summary ── */}
      {data.summary && (
        <>
          <div style={sectionTitle}>Summary</div>
          <hr style={hrStyle} />
          <div style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 2 }}>{data.summary}</div>
        </>
      )}

      {/* ── Experience ── */}
      {data.experience.length > 0 && (
        <>
          <div style={sectionTitle}>Experience</div>
          <hr style={hrStyle} />
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 8 }}>
              <div style={subheadRow}>
                <span style={boldSm}>{exp.company || "Company"}</span>
                <span style={boldSm}>{[exp.from, exp.to].filter(Boolean).join(" -- ")}</span>
              </div>
              <div style={{ ...subheadRow, marginBottom: 4 }}>
                <span style={italicSm}>{exp.role || "Role"}</span>
                <span style={italicSm}>{exp.location}</span>
              </div>
              {exp.points.filter(p => p.trim()).length > 0 && (
                <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
                  {exp.points.filter(p => p.trim()).map((pt, i) => (
                    <li key={i} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 1 }}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* ── Skills ── */}
      {data.skills.length > 0 && (
        <>
          <div style={sectionTitle}>Skills</div>
          <hr style={hrStyle} />
          <ul style={{ margin: "2px 0 6px 16px", padding: 0 }}>
            {data.skills.filter(s => s.items.trim()).map((sk) => (
              <li key={sk.id} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 1 }}>{sk.items}</li>
            ))}
          </ul>
        </>
      )}

      {/* ── Education ── */}
      {data.education.length > 0 && (
        <>
          <div style={sectionTitle}>Education</div>
          <hr style={hrStyle} />
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <div style={subheadRow}>
                <span style={boldSm}>{edu.institution || "Institution"}</span>
                <span style={boldSm}>{[edu.from, edu.to].filter(Boolean).join(" -- ")}</span>
              </div>
              <div style={{ ...subheadRow, marginBottom: 2 }}>
                <span style={italicSm}>{edu.degree}</span>
                <span style={italicSm}>{edu.location}</span>
              </div>
              {edu.coursework && (
                <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
                  <li style={{ fontSize: 10.5, lineHeight: 1.5 }}>
                    <strong>Relevant Coursework:</strong> {edu.coursework}
                  </li>
                </ul>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── App shell ─────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const printRef = useRef(null);

  const handlePrint = () => {
    const html = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${data.personal.name} — Resume</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Times New Roman',Times,serif; }
        @page { size: Letter; margin: 0; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      </style>
    </head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#ececec" }}>
      {/* Editor panel */}
      <div style={{ width: 370, flexShrink: 0, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e0e0e0" }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Jake's Resume</div>
            <div style={{ fontSize: 10.5, color: "#aaa" }}>ATS-friendly · single column</div>
          </div>
          <button
            onClick={handlePrint}
            style={{ padding: "7px 14px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            ↓ Export PDF
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Editor data={data} set={setData} />
        </div>
      </div>

      {/* Preview panel */}
      <div style={{ flex: 1, overflow: "auto", background: "#d6d6d6", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "28px 20px" }}>
        {/* Letter-size page: 816px wide at 96dpi */}
        <div style={{ background: "#fff", width: 816, minHeight: 1056, boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}>
          <div ref={printRef} style={{ minHeight: 1056 }}>
            <JakeTemplate data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
