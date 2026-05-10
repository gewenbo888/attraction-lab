const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const html = document.documentElement;

// lang + theme
const langBtn = $('#lang-btn'), themeBtn = $('#theme-btn');
const sLang = localStorage.getItem('al-lang') || 'en';
const sTheme = localStorage.getItem('al-theme') || 'dark';
html.setAttribute('data-lang', sLang);
html.setAttribute('data-theme', sTheme);
langBtn.textContent = sLang === 'en' ? 'EN' : '中';
langBtn.addEventListener('click', () => {
  const n = html.getAttribute('data-lang') === 'en' ? 'zh' : 'en';
  html.setAttribute('data-lang', n);
  localStorage.setItem('al-lang', n);
  langBtn.textContent = n === 'en' ? 'EN' : '中';
});
themeBtn.addEventListener('click', () => {
  const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', n);
  localStorage.setItem('al-theme', n);
});

// ===== HERO aura SVG =====
function renderAura() {
  $('#aura-viz').innerHTML = `
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%">
          <stop offset="0%" stop-color="var(--amber)" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="var(--rose)" stop-opacity="0.5"/>
          <stop offset="80%" stop-color="var(--mystery)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--mystery)" stop-opacity="0"/>
        </radialGradient>
        <filter id="b1"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      ${[210, 175, 140, 105, 70].map((r,i) => `
        <circle cx="250" cy="250" r="${r}" fill="none" stroke="${i%2 ? 'var(--rose)' : 'var(--amber)'}" stroke-opacity="${0.2 + i*0.08}" stroke-width="${0.6 + i*0.2}" stroke-dasharray="${i*1.5} ${4-i*0.4}"/>
      `).join('')}
      <circle cx="250" cy="250" r="280" fill="url(#g1)" filter="url(#b1)" opacity="0.55"/>
      <circle cx="250" cy="250" r="38" fill="var(--amber)" filter="url(#b1)" opacity="0.7"/>
      <circle cx="250" cy="250" r="24" fill="var(--bg)"/>
      <circle cx="250" cy="250" r="22" fill="none" stroke="var(--amber)" stroke-width="1.5"/>
      <text x="250" y="255" text-anchor="middle" font-family="Bodoni Moda" font-style="italic" font-size="18" fill="var(--text)">field</text>
      ${[0,1,2,3,4,5,6].map(i => {
        const ang = (-90 + i * 360/7) * Math.PI/180;
        const x = 250 + 200 * Math.cos(ang), y = 250 + 200 * Math.sin(ang);
        const colors = ['var(--amber)','var(--rose)','var(--voice)','var(--mystery)','var(--gold)','var(--crimson)','var(--emerald)'];
        return `<circle cx="${x}" cy="${y}" r="8" fill="${colors[i]}" opacity="0.85"/>
                <line x1="250" y1="250" x2="${x}" y2="${y}" stroke="${colors[i]}" stroke-opacity="0.25" stroke-width="1"/>`;
      }).join('')}
    </svg>`;
}
renderAura();

// ===== A1 · VECTORS =====
const vectors = [
  { glow: 'amber', en_t: 'Charisma',
    en_h: 'Bandwidth × focus.',
    en_p: 'Charisma is not warmth alone and not confidence alone — it is the ability to widen the emotional bandwidth of a room while pointing it somewhere specific. Without focus it is noise; without bandwidth it is lecture.',
    zh_t: '魅力',
    zh_h: '带宽 × 聚焦。',
    zh_p: '魅力不是温暖单独的，也不是自信单独的——它是把房间的情绪带宽拓宽、并将其指向某个具体方向的能力。没有聚焦就是噪声，没有带宽就是讲课。' },
  { glow: 'rose', en_t: 'Emotional Energy',
    en_h: 'The body that doesn\'t leak.',
    en_p: 'The most overlooked vector. Magnetic people maintain a stable internal energy state and don\'t expect the room to regulate them. Low-energy people drain the room; over-energy people overwhelm it; the magnetic register is high baseline with low volatility.',
    zh_t: '情绪能量',
    zh_h: '不漏电的身体。',
    zh_p: '最被忽视的向量。有磁性的人维持稳定的内部能量状态，不指望房间来调节自己。低能量者消耗房间；过能量者压过房间；磁性的语域是高基线、低波动。' },
  { glow: 'voice', en_t: 'Voice Rhythm',
    en_h: 'Tempo, not timbre.',
    en_p: 'Voice carries more attraction signal than face does, and rhythm carries more than timbre. The voice that pauses where it shouldn\'t pause and accelerates where it shouldn\'t accelerate is more memorable than the voice that is "objectively pleasant."',
    zh_t: '声音节奏',
    zh_h: '节奏而非音色。',
    zh_p: '声音承载的吸引力信号比脸更多，节奏承载的又比音色更多。在不该停顿处停顿、在不该加速处加速的声音，比"客观上悦耳"的声音更难忘。' },
  { glow: 'emerald', en_t: 'Eye Contact',
    en_h: 'Lock, release, lock.',
    en_p: 'The signal is in the rhythm of locking and releasing, not in the total fraction. A fixed stare reads as threat; a darting gaze reads as anxiety; the magnetic pattern locks for 2–3 seconds, releases briefly, and returns. Pupils dilate for the things you actually want.',
    zh_t: '眼神接触',
    zh_h: '锁定，释放，再锁定。',
    zh_p: '信号在锁定—释放的节奏里，不在总占比里。固定凝视读作威胁；游离目光读作焦虑；磁性模式是 2–3 秒的锁定，短暂释放，再回来。瞳孔为你真正想要的事物而扩张。' },
  { glow: 'mystery', en_t: 'Mystery',
    en_h: 'Information unevenly distributed, without anxiety.',
    en_p: 'Mystery is asymmetric information that the carrier seems unbothered by. Withholding and mystery look identical from outside until the cost of maintenance leaks; once it leaks, mystery becomes evasion and the field collapses.',
    zh_t: '神秘',
    zh_h: '信息不对称，但不带焦虑。',
    zh_p: '神秘是承载者看似不为所动的信息不对称。隐瞒与神秘从外部看完全相同，直到维持的代价泄漏；一旦泄漏，神秘就变成回避，场也随之坍塌。' },
  { glow: 'crimson', en_t: 'Dominance',
    en_h: 'Micro, not macro.',
    en_p: 'Magnetic dominance is a thousand small calibrations — slower speech, longer end-of-sentence pause, the willingness to not fill silence — not the loud register most people imagine. Loud dominance reads as insecure; the calibrated kind reads as gravity.',
    zh_t: '支配',
    zh_h: '微观，非宏观。',
    zh_p: '磁性支配是一千次微小校准——更慢的语速、更长的句末停顿、不去填补沉默的意愿——而不是大多数人想象的高音域。响亮的支配读作不安；校准过的支配读作重力。' },
  { glow: 'gold', en_t: 'Flirt Style',
    en_h: 'A grammar, not a script.',
    en_p: 'Six recognisable grammars — playful, sincere, physical, traditional, polite, mysterious. Magnetic people aren\'t fluent in all six; they\'re fluent in the one that matches the room they\'re in, and they switch when the room changes.',
    zh_t: '调情风格',
    zh_h: '语法，非脚本。',
    zh_p: '六种可辨识的语法——俏皮、真诚、身体的、传统、礼貌、神秘。有磁性的人并非六种都流利；他们对所处房间的那一种流利，并在房间变化时切换。' },
  { glow: 'amber', en_t: 'Presence',
    en_h: 'The composite. Not a separate vector.',
    en_p: 'What people call "presence" is the perceived integral of the other six. Optimising it directly is futile; optimise three of the six and presence appears as a side-effect. Trying to "be more present" without component work usually produces performance-of-presence, which reads as the opposite.',
    zh_t: '在场',
    zh_h: '复合量，不是独立向量。',
    zh_p: '人们所说的"在场"是其他六维的感知积分。直接优化它是徒劳的；优化六维中的三个，"在场"就会作为副作用出现。在不做组件工作的情况下试图"更加在场"，通常制造出"在场的表演"，读起来恰相反。' },
];

function renderVectors() {
  $('#vectors-grid').innerHTML = vectors.map(v => `
    <div class="card glow-${v.glow}">
      <div class="card-tag"><span lang="en">${v.en_h}</span><span lang="zh">${v.zh_h}</span></div>
      <h3><span lang="en">${v.en_t}</span><span lang="zh">${v.zh_t}</span></h3>
      <p><span lang="en">${v.en_p}</span><span lang="zh">${v.zh_p}</span></p>
    </div>`).join('');
}
renderVectors();

// ===== A2 · AURA WHEEL =====
const auraVecs = [
  { en: 'Charisma',     zh: '魅力',     v: 7, c: '#ffb066' },
  { en: 'Energy',       zh: '能量',     v: 6, c: '#ff5e8a' },
  { en: 'Voice',        zh: '声音',     v: 5, c: '#5fdcff' },
  { en: 'Eye',          zh: '眼神',     v: 6, c: '#5fe3a1' },
  { en: 'Mystery',      zh: '神秘',     v: 7, c: '#a78cff' },
  { en: 'Dominance',    zh: '支配',     v: 5, c: '#e94560' },
  { en: 'Flirt',        zh: '调情',     v: 6, c: '#f5d76e' },
];

function renderAuraWheel() {
  const cx = 240, cy = 240, R = 180;
  const n = auraVecs.length;
  const points = auraVecs.map((v, i) => {
    const ang = (-90 + i * 360/n) * Math.PI/180;
    const r = (v.v / 10) * R;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang),
             ax: cx + R * Math.cos(ang), ay: cy + R * Math.sin(ang), ang, label: v };
  });
  const grid = [2,4,6,8,10].map(t => {
    const r = (t/10)*R;
    const pts = Array.from({length: n}, (_, i) => {
      const a = (-90 + i*360/n) * Math.PI/180;
      return `${cx + r*Math.cos(a)},${cy + r*Math.sin(a)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="var(--line)" stroke-width="0.5" opacity="${0.3 + t*0.04}"/>`;
  }).join('');
  const axes = points.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.ax}" y2="${p.ay}" stroke="var(--line)" stroke-width="0.5" opacity="0.4"/>`).join('');
  const poly = points.map(p => `${p.x},${p.y}`).join(' ');
  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${p.label.c}"/>`).join('');
  const lbls = points.map((p, i) => {
    const ang = (-90 + i * 360/n) * Math.PI/180;
    const lx = cx + (R + 28) * Math.cos(ang), ly = cy + (R + 28) * Math.sin(ang);
    const lang = html.getAttribute('data-lang');
    const t = lang === 'en' ? p.label.en : p.label.zh;
    return `<text x="${lx}" y="${ly+4}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="${p.label.c}">${t}</text>`;
  }).join('');

  $('#aura-svg').innerHTML = `
    ${grid}
    ${axes}
    <polygon points="${poly}" fill="var(--amber)" fill-opacity="0.18" stroke="var(--amber)" stroke-width="2"/>
    ${dots}
    ${lbls}
  `;
}

function renderAuraControls() {
  $('#aura-controls').innerHTML = auraVecs.map((v, i) => `
    <div>
      <label>
        <span><span lang="en">${v.en}</span><span lang="zh">${v.zh}</span></span>
        <span class="mono" id="av-${i}">${v.v}</span>
      </label>
      <input type="range" min="0" max="10" value="${v.v}" data-i="${i}" class="aura-slider">
    </div>`).join('');
  $$('.aura-slider').forEach(s => s.addEventListener('input', e => {
    const i = +e.target.dataset.i;
    auraVecs[i].v = +e.target.value;
    $('#av-' + i).textContent = auraVecs[i].v;
    renderAuraWheel();
  }));
}
renderAuraControls();
renderAuraWheel();

// re-render labels when language changes
const obs = new MutationObserver(() => renderAuraWheel());
obs.observe(html, { attributes: true, attributeFilter: ['data-lang'] });

// ===== A3 · VOICE LAB =====
function runVoice() {
  const t = +$('#v-tempo').value;
  const p = +$('#v-pitch').value;
  const w = +$('#v-pause').value;
  const b = +$('#v-breath').value;
  $('#vo-t').textContent = t.toFixed(1);
  $('#vo-p').textContent = p;
  $('#vo-w').textContent = w;
  $('#vo-b').textContent = b;

  let band, en, zh;
  if (t > 4.8 && p < 4) { band = 'compressed-fast';
    en = 'Compressed-and-fast. Reads as anxiety. The room hears the speed first and the content second; charisma vector takes a hit, mystery is unreadable. Slow tempo by 0.5 first; pitch will follow.';
    zh = '压缩+快速。读作焦虑。房间先听到速度、再听到内容；魅力向量受损，神秘不可读。先把语速降低 0.5；音高会跟着调整。'; }
  else if (t < 3 && p < 3) { band = 'monotone-slow';
    en = 'Monotone-and-slow. Reads as deflated authority. The voice is technically dominant — slower than the room — but the lack of pitch movement reads as either depleted or disengaged. Add 1 to pitch variance and check.';
    zh = '单调+缓慢。读作疲惫的权威。技术上是支配性的——比房间更慢——但缺乏音高变动读起来要么是耗尽，要么是脱离。把音高方差加 1 再看。'; }
  else if (p > 7 && b > 7) { band = 'over-projected';
    en = 'Over-projected. Reads as performance, not presence. Variance is high but breath ratio is too thin; the body is selling rather than carrying the voice. Drop breath ratio toward 5 and let the chest carry more.';
    zh = '过度投射。读作表演而非在场。方差高，但气声比过薄；身体在推销声音而不是承载它。把气声比降向 5，让胸声承担更多。'; }
  else if (w > 7 && t < 4) { band = 'magnetic-low';
    en = 'Magnetic-low. Slow, weighted pauses, stable pitch movement. The voice reads as gravity. Watch that the pause weight doesn\'t cross into mannered — past 9, it starts to read as withholding.';
    zh = '磁性—低音域。慢速、有重量的停顿、稳定的音高位移。声音读作重力。注意停顿权重不要越过造作的边界——超过 9，就开始读作隐瞒。'; }
  else if (p > 5 && w > 5) { band = 'magnetic-mid';
    en = 'Magnetic-mid. Healthy pitch variance, healthy pauses, healthy tempo. This is the configuration most adults can move toward without retraining their entire vocal habit — it is achievable through pause practice alone.';
    zh = '磁性—中音域。健康的音高方差、健康的停顿、健康的语速。这是大多数成年人不需重训整个发声习惯就能移动到的配置——只通过停顿练习就可以达到。'; }
  else { band = 'neutral';
    en = 'Neutral band. Nothing leaks, nothing sings. Most adults sit here. The fastest single change: increase pause weight by 2 and listen for which sentences suddenly carry more.';
    zh = '中性带。无泄漏，无歌唱。多数成年人停留于此。最快的单点改变：把停顿权重加 2，听哪些句子忽然承载得更多。'; }

  $('#voice-out').innerHTML = `
    <span lang="en"><strong>${band}.</strong> ${en}</span>
    <span lang="zh"><strong>${band}。</strong>${zh}</span>`;
}
['v-tempo','v-pitch','v-pause','v-breath'].forEach(id => $('#'+id).addEventListener('input', runVoice));
runVoice();

// ===== A4 · EYE LAB =====
function runEye() {
  const f = +$('#e-frac').value;
  const d = +$('#e-dur').value;
  const b = +$('#e-blink').value;
  $('#eo-f').textContent = f;
  $('#eo-d').textContent = d.toFixed(1);
  $('#eo-b').textContent = b;

  let band, en, zh;
  if (f < 30) { band = 'avoidant';
    en = 'Avoidant. The room reads as anxious or disinterested — usually the latter, even when the former is true. Lift the floor to 50% before tuning anything else.';
    zh = '回避型。房间读作焦虑或不感兴趣——通常是后者，即便实情是前者。先把下限抬到 50%，再调其他。'; }
  else if (f > 80 && b > 6) { band = 'predatory';
    en = 'Predatory. Total fraction is high and blink suppression is high — this is the configuration most often misread as threat, regardless of intent. Drop blink suppression first; total fraction matters less.';
    zh = '掠夺型。总占比高、眨眼抑制高——这是最常被误读为威胁的配置，与意图无关。先降眨眼抑制，总占比反而次要。'; }
  else if (f > 60 && d > 5) { band = 'over-locked';
    en = 'Over-locked. Each individual lock is too long. The signal stops being "presence" past 4 seconds and starts being "demand." Cut single-lock duration to 2.5s — total fraction can stay where it is.';
    zh = '过度锁定。每次单独锁定过长。信号在超过 4 秒后从"在场"变为"索求"。把单次锁定降到 2.5 秒——总占比可以保持。'; }
  else if (f >= 50 && f <= 70 && d >= 2 && d <= 3.5 && b <= 4) { band = 'magnetic-band';
    en = 'Magnetic band. The 60/40 sweet spot, 2–3 second locks, normal blink rate. This is the eye configuration most people read as confident-without-threat. Hold here; it is harder to keep than to find.';
    zh = '磁性带。60/40 甜蜜点、2–3 秒锁定、正常眨眼率。这是大多数人读作"自信但无威胁"的眼神配置。守在这里——保持比找到更难。'; }
  else if (f < 50 && d < 2) { band = 'flickering';
    en = 'Flickering. Below the 50% floor and short locks — reads as either shy or uncalibrated. The cheap fix is to extend the locks rather than to push the total fraction.';
    zh = '闪烁型。低于 50% 下限、单次锁定短——读作害羞或未校准。便宜的解法是延长单次锁定，而非推高总占比。'; }
  else { band = 'neutral';
    en = 'Neutral. The configuration is unremarkable — no negative signal, no positive signal. Most adults sit here for most conversations and only move when the conversation matters.';
    zh = '中性。配置不起眼——无负面信号，也无正面信号。多数成年人在多数对话里都停留于此，只在对话重要时才移动。'; }

  $('#eye-out').innerHTML = `
    <span lang="en"><strong>${band}.</strong> ${en}</span>
    <span lang="zh"><strong>${band}。</strong>${zh}</span>`;
}
['e-frac','e-dur','e-blink'].forEach(id => $('#'+id).addEventListener('input', runEye));
runEye();

// ===== A5 · FLIRT TABLE =====
const flirtStyles = [
  { en_n: 'Playful', zh_n: '俏皮',
    en_d: 'Tease, banter, mock-rivalry. Lowers the stakes of approach by signalling "this is play."',
    zh_d: '逗弄、戏谑、假装竞争。通过传达"这是游戏"来降低接近的赌注。',
    en_c: 'Cheap mistake: lands in front of someone whose register is sincere; reads as not serious.',
    zh_c: '廉价错误：落在语域是真诚的对象面前；读作不当真。' },
  { en_n: 'Sincere', zh_n: '真诚',
    en_d: 'Direct emotional disclosure, eye-contact-heavy. Trades velocity for depth.',
    zh_d: '直接的情感披露、重眼神接触。以速度换深度。',
    en_c: 'Cheap mistake: deployed too early; reads as intensity, not interest.',
    zh_c: '廉价错误：部署过早；读作强度而非兴趣。' },
  { en_n: 'Physical', zh_n: '身体的',
    en_d: 'Touch-mediated escalation — light contact on shoulder, arm, hand — used to update status of the connection in real time.',
    zh_d: '通过触碰推进——肩、臂、手的轻触——用以实时更新连结状态。',
    en_c: 'Cheap mistake: ignores calibration of the recipient; reads as invasive without warning.',
    zh_c: '廉价错误：忽略对方的校准；读作无预告的侵入。' },
  { en_n: 'Traditional', zh_n: '传统',
    en_d: 'Asymmetric initiation, paced escalation, courtship rhythms. The most coordinated style at the cost of the most setup.',
    zh_d: '不对称的发起、节奏化的推进、求偶节奏。最协调的风格，代价是最多的前置铺设。',
    en_c: 'Cheap mistake: in a room where the script is dead, it reads as awkward rather than gallant.',
    zh_c: '廉价错误：在脚本已失效的房间里，读作笨拙而非绅士。' },
  { en_n: 'Polite', zh_n: '礼貌',
    en_d: 'Strict signal floor — no overt flirtation, only courtesy that is allowed to be read as interest.',
    zh_d: '严格的信号下限——无明显调情，只有可被读作兴趣的礼貌。',
    en_c: 'Cheap mistake: read as not interested at all; the signal floor is too low.',
    zh_c: '廉价错误：被读作完全无兴趣；信号下限过低。' },
  { en_n: 'Mysterious', zh_n: '神秘',
    en_d: 'Asymmetric information held without anxiety. Pulls curiosity rather than pushes signal.',
    zh_d: '在不带焦虑的状态下持有信息不对称。拉动好奇而非推送信号。',
    en_c: 'Cheap mistake: tips into withholding; produces distance instead of pull.',
    zh_c: '廉价错误：跌入隐瞒；产生距离而非吸引。' },
];

function renderFlirt() {
  const lang = html.getAttribute('data-lang');
  const head = `<tr>
    <th><span lang="en">Style</span><span lang="zh">风格</span></th>
    <th><span lang="en">Description</span><span lang="zh">描述</span></th>
    <th><span lang="en">Cost line</span><span lang="zh">代价</span></th></tr>`;
  const body = flirtStyles.map(f => `<tr>
    <td><span lang="en">${f.en_n}</span><span lang="zh">${f.zh_n}</span></td>
    <td><span lang="en">${f.en_d}</span><span lang="zh">${f.zh_d}</span></td>
    <td><span lang="en">${f.en_c}</span><span lang="zh">${f.zh_c}</span></td></tr>`).join('');
  $('#flirt-table').innerHTML = `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
}
renderFlirt();

// ===== A6 · MYSTERY =====
const mysteryCards = [
  { glow: 'mystery', en_t: 'Mystery vs Withholding',
    en_p: 'The signal that distinguishes the two is whether maintenance looks costly. Mystery looks like a person who happens to have an interior life. Withholding looks like a person actively keeping a door shut. The first reads as depth; the second reads as defense.',
    zh_t: '神秘 vs 隐瞒',
    zh_p: '区分两者的信号是：维持是否看起来费力。神秘看起来像一个恰巧拥有内心生活的人。隐瞒看起来像一个主动关着门的人。前者读作深度，后者读作防御。' },
  { glow: 'amber', en_t: 'Asymmetric Information, Cheap',
    en_p: 'The cheapest form of magnetic mystery: live a life that produces unusual data, then mention specifics in passing without dressing them. The mention is short, contextual, and deflects the obvious follow-up question without making the deflection visible.',
    zh_t: '便宜的信息不对称',
    zh_p: '磁性神秘最便宜的形式：过一种产生异常数据的生活，然后在不加修饰的情况下顺带提到具体细节。提及简短、依语境而生，并在不让回避可见的情况下回避了显而易见的追问。' },
  { glow: 'rose', en_t: 'The Mystery Half-Life',
    en_p: 'Mystery decays linearly with time spent in proximity. Most relationships pass through a mystery threshold around month four; the magnetic profile is the one whose decay rate is slowest, not whose initial level is highest. Initial mystery is cheap; durable mystery requires a life worth being mysterious about.',
    zh_t: '神秘的半衰期',
    zh_p: '神秘随相处时间线性衰减。多数关系会在约第四个月跨越神秘阈值；磁性剖面是衰减率最慢的那个，而非初始水平最高的那个。初始神秘很便宜；持久的神秘要求一份值得神秘的生活。' },
];

function renderMystery() {
  $('#mystery-grid').innerHTML = mysteryCards.map(c => `
    <div class="card glow-${c.glow}">
      <h3><span lang="en">${c.en_t}</span><span lang="zh">${c.zh_t}</span></h3>
      <p><span lang="en">${c.en_p}</span><span lang="zh">${c.zh_p}</span></p>
    </div>`).join('');
}
renderMystery();

// ===== A7 · AURA READER =====
const probes = [
  { id: 'charisma-deficit',
    en_t: 'Charisma Deficit', zh_t: '魅力赤字',
    en_h: 'I am liked but not magnetic. What is missing?',
    zh_h: '我被喜欢，但没有磁性。缺什么？',
    en_a: `The honest answer: probably bandwidth.

Liked-but-not-magnetic almost always means you are running on focus without bandwidth. Focus is the ability to attend to one person at high resolution; bandwidth is the ability to widen the emotional surface area of a room while you do it. People who are kind, attentive, and reliable but not magnetic are usually paying for the focus by drawing bandwidth in. The room registers the attention as warmth and registers the lowered bandwidth as "safe but not interesting."

Three diagnostics. (1) Voice rhythm — does pitch variance go up when you find the conversation interesting, or does it stay flat regardless? Magnetic people leak interest through pitch movement; the flat-pitch profile is the most common bandwidth-low signature. (2) Energy floor — when you walk into a room tired, does your energy floor drop visibly, or does the body hold a baseline regardless? Magnetic people hold the floor; the room learns it can rely on it. (3) Pause weight — do you fill silence quickly because the room rewards it, or do you let it sit because you have nothing in particular to fill it with?

The intervention is structural, not surface. Optimising charisma directly produces performance-of-charisma, which reads as the opposite. The cheaper move is to choose two of the seven vectors — voice rhythm and energy stability are the highest-leverage pair — and audit them for one week each. Charisma will rise as a side-effect; the integral of seven moderately-tuned vectors beats the integral of one well-tuned one.

What this lab will not say: that the missing thing is "you" in some essential sense. There is no static self that magnetism is the costume of. The vectors are what magnetism is made of.`,
    zh_a: `坦诚的答案：很可能是带宽。

被喜欢但没有磁性，几乎总是意味着你只在跑聚焦、没在跑带宽。聚焦是高分辨率地注意一个人的能力；带宽是在你聚焦的同时拓宽房间情绪表面积的能力。那些善良、专注、可靠但没有磁性的人，通常以收紧带宽的代价支付聚焦。房间把那份注意登记为温暖，把降低的带宽登记为"安全但不有趣"。

三个诊断。(1) 声音节奏——当你觉得谈话有趣时，音高方差是否上升，还是无论如何都保持平直？磁性的人通过音高位移泄漏兴趣；平直音高是最常见的低带宽签名。(2) 能量下限——你疲惫时走进房间，能量下限是否明显下沉，还是身体无论如何都守住一个基线？磁性的人守住下限，房间学会它可以倚赖。(3) 停顿权重——你迅速填补沉默是因为房间奖励它，还是因为你确实没有什么特别要填补的？

干预是结构性的，不是表面的。直接优化"魅力"会制造"魅力的表演"，读起来恰相反。更便宜的做法是从七维中挑两维——声音节奏与能量稳定性是杠杆率最高的一对——每周审计其中一维。魅力会作为副作用上升；七维中等调谐的积分胜过一维优良调谐的积分。

本实验室不会说的是：缺的那件东西是某种本质意义上的"你"。没有一个静止的自我让磁性作为它的服装。向量本身就是磁性所由构成。` },

  { id: 'voice-monotone',
    en_t: 'Voice Monotone Fix', zh_t: '声音单调修复',
    en_h: 'My voice is flat. People stop listening. Where do I start?',
    zh_h: '我的声音平直。人们停止聆听。从哪里开始？',
    en_a: `Start with pause weight, not pitch. This is counterintuitive but it is the highest-leverage single intervention.

A flat voice is rarely flat in pitch — most "flat" voices have normal pitch range when measured. What's flat is the absence of weighted pauses. The voice is moving through pitch, but every syllable is given the same temporal weight, so the pitch movement is invisible. Adding pause weight makes the existing pitch movement audible without retraining your vocal habit.

Three drills, in order. (1) Read a paragraph out loud. Insert a half-second pause after every comma and a one-second pause after every period. The text will sound stilted at first; it will sound magnetic by week two. (2) Watch a recording of yourself in conversation, muted. Where does your face emphasise — eyebrow, head tilt, hand? Make the voice mirror those emphasis points; most flat voices have expressive faces and the body knows where the weight should go. (3) End sentences on the lower pitch register, not the higher one. The "rising" sentence end reads as questioning permission; the falling one reads as gravity.

The honest disclaimer: a flat voice is sometimes a depleted-affect signal, not a vocal-habit one. If you are flat across all six contexts in your life and not just this one, the issue is upstream of the voice and the slider above is treating a symptom. See the Mask Engine site's suppression module for that flow.`,
    zh_a: `从停顿权重开始，不是音高。这是反直觉的，但它是杠杆率最高的单点干预。

一个平直的声音很少是音高平直——多数被称为"平直"的声音，测量时音高范围都是正常的。平直的是有权重的停顿之缺席。声音正在穿过音高，但每个音节都被赋予相同的时间权重，因此音高位移变得不可见。加上停顿权重就让既有的音高位移可听见，无需重训发声习惯。

三个练习，按顺序。(1) 朗读一段话。每个逗号后插入半秒停顿，每个句号后插入一秒。文本起初会显得僵硬；到第二周会显得有磁性。(2) 静音观看自己谈话的录像。你的脸在哪里强调——眉毛、头倾、手？让声音镜映那些强调点；多数平直声音都有富表情的脸，身体知道重量应去哪。(3) 在较低音域结束句子，而不是较高音域。"上升"的句尾读作询问许可，"下降"的句尾读作重力。

诚实的免责声明：平直的声音有时是一种情感耗尽的信号，而非发声习惯的信号。如果你在生活的全部六种语境中都平直、而不只是这一种，问题位于声音的上游，上方的滑块只是在治症状。相关流程见姊妹站点 Mask Engine 的压抑模块。` },

  { id: 'eye-contact',
    en_t: 'Eye-Contact Overcorrection', zh_t: '眼神过度校正',
    en_h: 'I read that confident people hold eye contact. I tried it. It feels weird.',
    zh_h: '我读到自信的人会保持眼神接触。我试了。感觉怪。',
    en_a: `Yes. It feels weird because the rule is wrong.

The rule "confident people hold eye contact" is one-third of a real signal. The real signal has three parameters: total fraction (50–70%), single-lock duration (2–3 seconds), and blink rate (normal). What people read as "predatory" or "intense" isn't the total fraction — it's a long single lock, especially when paired with blink suppression. You probably overcorrected by extending each individual lock past 4 seconds, which is the threshold past which the room reads "demand" instead of "presence."

Three corrections. (1) Lock for the duration of one phrase, not the duration of one sentence. A phrase is two to four seconds. A sentence can run twelve. (2) Release downward and slightly to the side, not sideways and not upward — downward release reads as natural, sideways reads as evasion, upward reads as searching for the next thing to say. (3) Blink normally. Suppressed blinking is the single highest-correlation predatory signal, regardless of total fraction.

The harder thing the rule misses: eye contact between strangers is a higher-stakes signal than eye contact between intimates. With strangers, the magnetic configuration is closer to 50% than to 70%; with intimates, it can run to 80% without reading as threat. If your "weird" feedback came from new acquaintances, the protocol you copied was the wrong one for that room.`,
    zh_a: `是的。它感觉怪，是因为规则错了。

"自信的人会保持眼神接触"这条规则只是真实信号的三分之一。真实信号有三个参数：总占比（50–70%）、单次锁定时长（2–3 秒）、眨眼率（正常）。被读作"掠夺"或"强烈"的，不是总占比——而是单次长锁定，尤其搭配眨眼抑制时。你很可能通过把单次锁定延长到 4 秒以上而过度校正了，那是房间从"在场"切换为"索求"的阈值。

三种纠正。(1) 锁定一个短语的时长，不是一个句子的时长。一个短语两到四秒。一个句子可达十二秒。(2) 向下并轻微侧偏地释放，不是侧向、也不是向上——向下释放读作自然，侧向读作回避，向上读作"在搜索下一句"。(3) 正常眨眼。被抑制的眨眼是最高相关性的掠夺信号，与总占比无关。

规则没说的更难那一点：陌生人之间的眼神接触，是比亲密者之间的眼神接触更高风险的信号。对陌生人，磁性配置更接近 50% 而非 70%；对亲密者可达 80% 也不读作威胁。如果你那句"奇怪"的反馈来自新认识的人，你复制的那份协议不属于那个房间。` },

  { id: 'mystery-coldness',
    en_t: 'Mystery Without Coldness', zh_t: '神秘但不冷漠',
    en_h: 'How do I become more mysterious without becoming cold?',
    zh_h: '我如何在不变冷的同时更神秘？',
    en_a: `Mysteriousness and coldness look the same from the outside until the cost of maintenance leaks. The trick is not to add coldness; the trick is to stop performing the absence of mystery.

Most adults perform anti-mystery reflexively. They explain themselves before they're asked. They append qualifiers. They preempt the obvious follow-up question by answering it in the original sentence. None of that is warmth — it is anxiety dressed as warmth. The mistake is to read it as the opposite of coldness; in fact it sits adjacent to it on the same axis.

Three small habits, all subtractive. (1) When asked what you do, give a four-word answer. Not three — three reads as withholding. Not eight — eight reads as resume. Four leaves a question unanswered without making the unanswering visible. (2) Mention specifics, not categories. "I lived in Wuhan for two years" is more magnetic than "I've lived in a few cities," because specifics produce verifiable asymmetry; categories produce vagueness that reads as deflection. (3) Don't append. The reflex to add "but it wasn't a big deal" or "anyway, enough about me" is what kills mystery faster than any single thing. Let the sentence sit.

The signal that you've crossed into coldness rather than mystery: the room becomes quieter around you. Mystery makes the room ask another question. Coldness makes the room move on. If you don't see the next question coming, you've over-corrected.`,
    zh_a: `从外部看，神秘与冷漠完全相同，直到维持的代价泄漏。诀窍不是加冷，诀窍是停止表演"我不神秘"。

多数成年人会反射性地表演反神秘。他们在被问之前先解释自己。他们附加限定词。他们用原句先回答显而易见的下一个问题来抢先封堵。这些都不是温暖——是穿着温暖外衣的焦虑。错误在于把它读作冷漠的反面；事实上它与冷漠位于同一轴线相邻处。

三个小习惯，全是减法。(1) 被问做什么的时，给一个四字答案。不是三字——三字读作隐瞒；不是八字——八字读作简历。四字留下一个未答的问题，但不让未答可见。(2) 提及具体，不是范畴。"我在武汉住过两年"比"我住过几个城市"更有磁性，因为具体生成可被核实的不对称；范畴生成读作回避的模糊。(3) 不附加。"但其实没什么"或"反正——别说我了"这种反射，比任何单一事物都更快地杀死神秘。让句子停在那里。

你越线进入冷漠而非神秘的信号：房间在你周围变得更安静。神秘让房间问出下一个问题。冷漠让房间转身离开。如果你没看到下一个问题正在到来，你已过度校正。` },

  { id: 'dominance-arrogance',
    en_t: 'Dominance Without Arrogance', zh_t: '支配但不傲慢',
    en_h: 'I want to be dominant in a room without being arrogant. Where is the line?',
    zh_h: '我想在房间里有支配感而不傲慢。界线在哪？',
    en_a: `The line is in the cost. Magnetic dominance is calibrated and cheap; arrogant dominance is loud and expensive.

Three signatures distinguish them. First, the loudness register. Magnetic dominance is the slowest voice in the room and the longest end-of-sentence pause. Arrogant dominance is the loudest voice and the fastest reclaim of the floor after interruption. The body that doesn't need to reclaim is the one the room defers to; the body that fights for the floor is the one the room writes off after the second beer.

Second, the disagreement register. Magnetic dominance disagrees by lowering pitch and stating the disagreement once. Arrogant dominance disagrees by raising pitch, repeating the disagreement, and adding evaluative words about the other person's reasoning. The first reads as gravity; the second reads as performance of gravity. Most rooms can tell the difference within four seconds.

Third, the silence register. Magnetic dominance lets silence sit when there is nothing in particular to say. Arrogant dominance fills silence with status-claiming filler — credentials, name-drops, contrarian takes. The body that doesn't need silence to be filled is the body the room reads as occupying space without effort. The body that fills silence is the body the room reads as needing to occupy space, which is itself a deference signal.

What this lab will not pretend: that the line is easy to hold. It is not. Most adults in dominant social positions cross into arrogance within the first six months of the role and never come back unless they're specifically humbled. Magnetism is fragile and the failure mode is one-directional.`,
    zh_a: `界线在代价里。磁性支配是被校准的、便宜的；傲慢支配是响亮的、昂贵的。

三个签名将它们区分开。第一，音量语域。磁性支配是房间里最慢的声音、最长的句末停顿。傲慢支配是最响的声音、被打断后最快夺回话语权。不需要夺回话语权的身体是房间默认会让位的那个；为话语权而战的身体是房间在第二杯啤酒后会划掉的那个。

第二，不同意语域。磁性支配以降低音高、只陈述一次的方式不同意。傲慢支配以提高音高、重复不同意、并加上对对方推理的评价词的方式不同意。前者读作重力，后者读作"重力的表演"。多数房间能在四秒内分辨。

第三，沉默语域。磁性支配在没什么特别要说时让沉默停留。傲慢支配以身份主张的填充词——头衔、人名、反向观点——填补沉默。不需要沉默被填充的身体，是房间读作"无需努力即占据空间"的身体。填补沉默的身体，是房间读作"需要去占据空间"的身体——而这本身就是一种屈从信号。

本实验室不会假装的：这条界线易于把守。它不易。多数处于支配性社交位置的成年人，在角色的前六个月内就跨入傲慢，且除非被特别惩诫，否则不再回来。磁性是脆弱的，失败模式是单向的。` },
];

function renderProbes() {
  $('#prompt-grid').innerHTML = probes.map(p => `
    <button class="prompt-btn" data-id="${p.id}">
      <span class="pt-tag">probe</span>
      <strong><span lang="en">${p.en_t}</span><span lang="zh">${p.zh_t}</span></strong>
      <div style="margin-top:6px; color: var(--muted); font-size: 12px;"><span lang="en">${p.en_h}</span><span lang="zh">${p.zh_h}</span></div>
    </button>`).join('');
  $$('.prompt-btn').forEach(b => b.addEventListener('click', () => {
    const p = probes.find(x => x.id === b.dataset.id);
    const lang = html.getAttribute('data-lang');
    $('#mirror-out').textContent = lang === 'en' ? p.en_a : p.zh_a;
  }));
}
renderProbes();

function heuristicRead(text) {
  const lang = html.getAttribute('data-lang');
  const t = text.toLowerCase();
  const flags = [];
  if (/voice|tone|speak|sound|声音|说话|口音|嗓音/.test(t)) flags.push(lang === 'en' ? 'voice' : '声音');
  if (/eye|gaze|stare|look|眼|目光|凝视/.test(t)) flags.push(lang === 'en' ? 'eye contact' : '眼神');
  if (/mystery|secret|interesting|神秘|有趣|秘密/.test(t)) flags.push(lang === 'en' ? 'mystery' : '神秘');
  if (/charisma|magnetic|presence|魅力|磁性|气场/.test(t)) flags.push(lang === 'en' ? 'charisma' : '魅力');
  if (/dominant|leader|powerful|支配|领导|强势/.test(t)) flags.push(lang === 'en' ? 'dominance' : '支配');
  if (/flirt|date|attract|romantic|调情|约会|追求|恋爱/.test(t)) flags.push(lang === 'en' ? 'flirt' : '调情');
  if (/shy|invisible|ignored|害羞|被忽视|隐形/.test(t)) flags.push(lang === 'en' ? 'invisibility signal' : '隐形信号');
  if (/intense|too much|threat|强烈|过头|威胁/.test(t)) flags.push(lang === 'en' ? 'over-projection' : '过度投射');

  if (lang === 'en') {
    return `Heuristic read · vectors detected: ${flags.length ? flags.join(' · ') : 'none flagged'}.

The free-text mode runs a pattern-matcher, not a frontier model. Three things to consider:

(1) ${flags.length === 0 ? `No vector vocabulary surfaced. Either you're describing a result (liked, ignored, etc.) without naming a mechanism — return to the seven vectors and try again — or the issue isn't on this site's map at all.` : flags.length === 1 ? `One vector named. The deficit is rarely on a single vector; the second-largest contributor is usually invisible to the person asking. Pick one of the canned probes above for the named vector, then audit one adjacent.` : `Multiple vectors named (${flags.length}). The interactions are where the magnetism leaks — see the aura wheel and try sliding the named vectors down one by one to find which combination produces what you describe.`}

(2) ${/(invisible|ignored|shy|害羞|隐形|被忽视)/.test(t) ? `Invisibility signals are present. The most common cause is energy floor, not charisma surface. The body that doesn't hold a baseline is the body the room doesn't update on.` : `No strong invisibility signals. If outcomes don't match input, the leak is likely between vectors rather than within one.`}

(3) ${/(intense|too much|threat|强烈|过头|威胁)/.test(t) ? `Over-projection signals are present. Cut blink suppression first; total fraction matters less. The "too intense" reading almost always traces to two parameters out of nine.` : `No strong over-projection signal. The vectors are likely below threshold rather than above.`}

The probes above are cleaner than this fallback. Pick the closest one for a fully written response.`;
  } else {
    return `启发式读取 · 检测到的向量：${flags.length ? flags.join(' · ') : '无标记'}。

自由文本模式运行的是模式匹配器，不是前沿模型。三点可考虑的：

(1) ${flags.length === 0 ? `没有向量词汇浮现。要么你在描述结果（被喜欢、被忽视等）而未命名机制——回到七维再试一次——要么问题完全不在本站的地图上。` : flags.length === 1 ? `命名了一个向量。赤字很少只在一维；第二大贡献者通常对发问者不可见。先用上方该向量的预设探针，再审计一维相邻向量。` : `命名了多个向量（${flags.length}）。磁性的泄漏发生在向量之间——参见气场轮，试着把已命名的向量逐一下调，找出产生你所述结果的组合。`}

(2) ${/(invisible|ignored|shy|害羞|隐形|被忽视)/.test(t) ? `存在隐形信号。最常见的原因是能量下限，而非魅力表面。不守住基线的身体是房间不会更新对其印象的身体。` : `无强烈隐形信号。如果结果与输入不符，泄漏更可能在向量之间，而非某一向量内。`}

(3) ${/(intense|too much|threat|强烈|过头|威胁)/.test(t) ? `存在过度投射信号。先降眨眼抑制，总占比反而次要。"太强烈"的读法几乎总是溯源到九个参数里的两个。` : `无强烈过度投射信号。各向量更可能在阈值以下，而非以上。`}

上方的探针比这个回退更干净。选最贴近的一个，可得到完整成型的回答。`;
  }
}

$('#mirror-go').addEventListener('click', () => {
  const text = $('#mirror-input').value.trim();
  if (!text) return;
  $('#mirror-out').textContent = heuristicRead(text);
});
