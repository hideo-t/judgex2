import { useState } from "react";

const categories = [
  {
    id: "ownership",
    title: "判断主体性",
    subtitle: "Judgment Ownership",
    question: "誰が最終判断者かが、構造として明確か",
    levels: [
      { score: 0, label: "空気・他人・状況が決めている" },
      { score: 5, label: "ほぼ他者依存だが、意識はある" },
      { score: 10, label: "形式上は自分だが、流されやすい" },
      { score: 15, label: "自覚的に決めているが、迷いが残る" },
      { score: 20, label: "自分が引き受けて決めている" },
    ],
  },
  {
    id: "responsibility",
    title: "責任引受度",
    subtitle: "Responsibility Taking",
    question: "失敗時の責任を、感情ではなく構造で引き受けているか",
    levels: [
      { score: 0, label: "責任の所在が曖昧" },
      { score: 5, label: "責任があることは認識している" },
      { score: 10, label: "精神論的に背負っている" },
      { score: 15, label: "役割は明確だが、言語化が弱い" },
      { score: 20, label: "役割・範囲・覚悟が言語化されている" },
    ],
  },
  {
    id: "ambiguity",
    title: "曖昧耐性",
    subtitle: "Ambiguity Tolerance",
    question: "正解がない状態でも、判断を止めずにいられるか",
    levels: [
      { score: 0, label: "迷い続ける／先延ばし" },
      { score: 5, label: "動けるが、強いストレスを感じる" },
      { score: 10, label: "動くが、その場しのぎ" },
      { score: 15, label: "不確実性を認識し、仮決めできる" },
      { score: 20, label: "不確実性を前提に決断できる" },
    ],
  },
  {
    id: "aiBoundary",
    title: "AI線引力",
    subtitle: "AI Boundary Design",
    question: "AIや他者に、任せる／任せないの線が引けているか",
    levels: [
      { score: 0, label: "丸投げ or 全拒否" },
      { score: 5, label: "使うが、依存度が高い" },
      { score: 10, label: "補助として使っている" },
      { score: 15, label: "線引きはあるが、場面で揺れる" },
      { score: 20, label: "判断主体を自分に残したまま使えている" },
    ],
  },
  {
    id: "articulation",
    title: "言語化力",
    subtitle: "Judgment Articulation",
    question: "判断理由を、他者に説明できるか",
    levels: [
      { score: 0, label: "感覚のみ" },
      { score: 5, label: "断片的には言える" },
      { score: 10, label: "事後的には説明できる" },
      { score: 15, label: "判断中に概ね言語化できる" },
      { score: 20, label: "判断前・判断中に言語化できる" },
    ],
  },
];

const radiusLevels = [
  { id: "R1", label: "自己半径", desc: "自分の時間・感情・生活", icon: "◉" },
  { id: "R2", label: "現場半径", desc: "チーム・店舗・プロジェクト", icon: "◎" },
  { id: "R3", label: "組織半径", desc: "会社・雇用・財務・法務", icon: "⬡" },
  { id: "R4", label: "社会半径", desc: "業界・地域・評判・取引網", icon: "◇" },
  { id: "R5", label: "文明半径", desc: "国家・制度・文化・次世代", icon: "△" },
];

function ScoreBar({ value, max = 100 }) {
  const pct = (value / max) * 100;
  const color =
    pct >= 80 ? "#00e5a0" : pct >= 60 ? "#00bcd4" : pct >= 40 ? "#f0c040" : pct >= 20 ? "#ff8a50" : "#ff5252";
  return (
    <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 3,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

function RadarChart({ scores, size = 260 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const labels = ["主体性", "責任", "曖昧耐性", "AI線引", "言語化"];

  const getPoint = (index, value, maxVal = 20) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const dist = (value / maxVal) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const dataPoints = scores.map((s, i) => getPoint(i, s));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((level) => {
        const pts = Array.from({ length: 5 }, (_, i) => getPoint(i, 20 * level));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={level} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const end = getPoint(i, 20);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
      })}
      <path d={pathD} fill="rgba(0,229,160,0.12)" stroke="#00e5a0" strokeWidth={2} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#00e5a0" />
      ))}
      {labels.map((label, i) => {
        const pt = getPoint(i, 26);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={11}
            fontFamily="'Noto Sans JP', sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function JUDGEX2App() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [radius, setRadius] = useState(null);
  const [fadeClass, setFadeClass] = useState("in");

  const transition = (fn) => {
    setFadeClass("out");
    setTimeout(() => {
      fn();
      setFadeClass("in");
    }, 300);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const handleSelect = (catId, score) => {
    const next = { ...answers, [catId]: score };
    setAnswers(next);
    if (currentQ < 4) {
      transition(() => setCurrentQ(currentQ + 1));
    } else {
      transition(() => setPhase("radius"));
    }
  };

  const handleRadius = (r) => {
    setRadius(r);
    transition(() => setPhase("result"));
  };

  const reset = () => {
    transition(() => {
      setPhase("intro");
      setCurrentQ(0);
      setAnswers({});
      setRadius(null);
    });
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e8e8ec",
    fontFamily: "'Noto Sans JP', 'SF Pro Display', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  };

  const fadeStyle = {
    opacity: fadeClass === "in" ? 1 : 0,
    transform: fadeClass === "in" ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  };

  const cardStyle = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: "36px 32px",
    maxWidth: 520,
    width: "100%",
    backdropFilter: "blur(20px)",
  };

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,229,160,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={fadeStyle}>
        {phase === "intro" && (
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 24,
              textTransform: "uppercase",
            }}>
              Judgment Infrastructure
            </div>
            <h1 style={{
              fontSize: 42,
              fontWeight: 700,
              margin: "0 0 4px 0",
              letterSpacing: -1,
              background: "linear-gradient(135deg, #e8e8ec, #00e5a0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              JUDGEX²
            </h1>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 2,
              marginBottom: 32,
            }}>
              ジャッジエックス・スクエア
            </div>
            <p style={{
              fontSize: 14,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
              fontWeight: 300,
            }}>
              判断の質 × 引き受ける世界
            </p>
            <p style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 36,
              fontWeight: 300,
              maxWidth: 360,
              margin: "0 auto 36px",
            }}>
              正解のない状況で「どれだけ良い判断をしているか」と
              「どこまでの世界を引き受けているか」を可視化します。
              所要時間：約2分
            </p>
            <button
              onClick={() => transition(() => setPhase("assess"))}
              style={{
                background: "linear-gradient(135deg, #00e5a0, #00bcd4)",
                color: "#0a0a0f",
                border: "none",
                borderRadius: 10,
                padding: "14px 48px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,229,160,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              診断を開始する
            </button>
            <div style={{
              marginTop: 28,
              fontSize: 11,
              color: "rgba(255,255,255,0.15)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              5項目 + Decision Radius
            </div>
          </div>
        )}

        {phase === "assess" && (
          <div style={cardStyle}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: 2,
              }}>
                JUDGEX INDEX
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "#00e5a0",
              }}>
                {currentQ + 1} / 5
              </div>
            </div>

            <div style={{
              width: "100%",
              height: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 1,
              marginBottom: 28,
            }}>
              <div style={{
                width: `${((currentQ + 1) / 5) * 100}%`,
                height: "100%",
                background: "#00e5a0",
                borderRadius: 1,
                transition: "width 0.5s ease",
              }} />
            </div>

            <h2 style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 4px 0",
            }}>
              {categories[currentQ].title}
            </h2>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 16,
            }}>
              {categories[currentQ].subtitle}
            </div>
            <p style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 24,
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
              {categories[currentQ].question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories[currentQ].levels.map((level) => (
                <button
                  key={level.score}
                  onClick={() => handleSelect(categories[currentQ].id, level.score)}
                  style={{
                    background: answers[categories[currentQ].id] === level.score
                      ? "rgba(0,229,160,0.1)"
                      : "rgba(255,255,255,0.02)",
                    border: answers[categories[currentQ].id] === level.score
                      ? "1px solid rgba(0,229,160,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    color: "#e8e8ec",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    lineHeight: 1.5,
                  }}
                  onMouseOver={(e) => {
                    if (answers[categories[currentQ].id] !== level.score) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (answers[categories[currentQ].id] !== level.score) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    }
                  }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: answers[categories[currentQ].id] === level.score ? "#00e5a0" : "rgba(255,255,255,0.25)",
                    minWidth: 28,
                    fontWeight: 600,
                  }}>
                    {level.score}
                  </span>
                  <span style={{ fontWeight: 300 }}>{level.label}</span>
                </button>
              ))}
            </div>

            {currentQ > 0 && (
              <button
                onClick={() => transition(() => setCurrentQ(currentQ - 1))}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 12,
                  cursor: "pointer",
                  marginTop: 20,
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
              >
                ← 前の項目に戻る
              </button>
            )}
          </div>
        )}

        {phase === "radius" && (
          <div style={cardStyle}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 2,
              marginBottom: 24,
            }}>
              DECISION RADIUS
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px 0" }}>
              決断半径
            </h2>
            <p style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 28,
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
              現在のあなたの判断が影響を与えている範囲は？
              <br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                ※ 大きい＝偉い ではない。立場と文脈の違いを示すだけ
              </span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {radiusLevels.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRadius(r.id)}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: "16px",
                    color: "#e8e8ec",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(0,229,160,0.06)";
                    e.currentTarget.style.borderColor = "rgba(0,229,160,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <span style={{
                    fontSize: 24,
                    opacity: 0.6,
                    minWidth: 36,
                    textAlign: "center",
                  }}>
                    {r.icon}
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#00e5a0",
                      }}>
                        {r.id}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
                      {r.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "result" && (
          <div style={{ ...cardStyle, maxWidth: 560 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 2,
              marginBottom: 24,
              textAlign: "center",
            }}>
              YOUR RESULT
            </div>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 8,
                padding: "16px 32px",
                background: "rgba(0,229,160,0.06)",
                border: "1px solid rgba(0,229,160,0.15)",
                borderRadius: 14,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                }}>
                  JUDGEX²
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 44,
                  fontWeight: 600,
                  color: "#00e5a0",
                  lineHeight: 1,
                }}>
                  {totalScore}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.3)",
                }}>
                  / 100
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.3)",
                  margin: "0 4px",
                }}>
                  ｜
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#00bcd4",
                }}>
                  {radius}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <RadarChart scores={categories.map((c) => answers[c.id] || 0)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.title}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.25)",
                      }}>
                        {cat.subtitle}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#00e5a0",
                    }}>
                      {answers[cat.id]}
                    </span>
                  </div>
                  <ScoreBar value={answers[cat.id]} max={20} />
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "16px",
              marginBottom: 28,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#00bcd4",
                }}>
                  {radius}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {radiusLevels.find((r) => r.id === radius)?.label}
                </span>
              </div>
              <p style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                margin: 0,
                lineHeight: 1.6,
                fontWeight: 300,
              }}>
                {radiusLevels.find((r) => r.id === radius)?.desc}
              </p>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 28,
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <p style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                margin: 0,
                lineHeight: 1.7,
                fontWeight: 300,
                textAlign: "center",
              }}>
                この数値は能力評価ではありません。
                <br />
                今この瞬間の判断構造の状態を示すものです。
                <br />
                比較対象は過去の自分だけ。
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={reset}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "12px 36px",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "#e8e8ec";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                もう一度診断する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
