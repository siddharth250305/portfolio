import DATA from './personalData';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Command Registry ──
// Each entry: { desc, aliases, visible }
// visible=false → hidden from `help` list (Easter eggs)
export const COMMANDS = {
  help:       { desc: 'Show available commands',    aliases: ['?', 'commands'], visible: true },
  about:      { desc: 'Learn about me',             aliases: ['bio', 'me'],     visible: true },
  whoami:     { desc: 'Who am I?',                  aliases: [],                visible: true },
  skills:     { desc: 'Technical skill set',        aliases: ['tech', 'stack'], visible: true },
  projects:   { desc: 'Featured projects',          aliases: ['work'],          visible: true },
  education:  { desc: 'My education history',       aliases: ['edu'],           visible: true },
  contact:    { desc: 'How to reach me',            aliases: ['email'],         visible: true },
  social:     { desc: 'Social media links',         aliases: ['links'],         visible: true },
  resume:     { desc: 'View/download resume',       aliases: ['cv'],            visible: true },
  neofetch:   { desc: 'System info display',        aliases: ['sysinfo'],       visible: true },
  echo:       { desc: 'Echo a message',             aliases: [],                visible: true },
  date:       { desc: 'Show current date & time',   aliases: ['time'],          visible: true },
  clear:      { desc: 'Clear the terminal',         aliases: ['cls'],           visible: true },
  history:    { desc: 'View command history',        aliases: ['hist'],          visible: true },
  banner:     { desc: 'Display name banner',        aliases: ['logo'],          visible: true },
  ls:         { desc: 'List available sections',    aliases: ['dir'],           visible: true },
  pwd:        { desc: 'Print working directory',    aliases: [],                visible: true },
  // Easter eggs (hidden from help, surfaced via nudge)
  // matrix command removed
  coffee:     { desc: 'Brew some coffee',            aliases: [],                visible: false },
  sudo:       { desc: '',                            aliases: [],                visible: false },
  hire:       { desc: 'Hire me!',                    aliases: [],                visible: false },
  theme:      { desc: 'Toggle CRT scanlines',       aliases: ['mode'],          visible: false },
  secret:     { desc: '',                            aliases: [],                visible: false },
  exit:       { desc: '',                            aliases: ['quit'],          visible: false },
  cd:         { desc: '',                            aliases: [],                visible: false },
  gui:        { desc: '',                            aliases: [],                visible: false },
  vim:        { desc: '',                            aliases: ['nano', 'vi'],    visible: false },
  rm:         { desc: '',                            aliases: [],                visible: false },
  weather:    { desc: 'Weather info',               aliases: [],                visible: true },
};

// DESC map for command palette
export const DESC_MAP = {};
for (const [cmd, info] of Object.entries(COMMANDS)) {
  if (info.desc) DESC_MAP[cmd] = info.desc;
}

// Hidden commands list (excluded from help but searchable in palette)
export const HIDDEN_COMMANDS = Object.entries(COMMANDS)
  .filter(([, info]) => !info.visible)
  .map(([cmd]) => cmd);

export function buildAliasMap() {
  const map = {};
  for (const [cmd, info] of Object.entries(COMMANDS)) {
    if (info.aliases) {
      for (const alias of info.aliases) {
        map[alias] = cmd;
      }
    }
  }
  return map;
}

// ── Command Handlers ──

export function cmdHelp() {
  const lines = ['<span class="section-header">╭─── Available Commands ───╮</span>', '<div class="help-table">'];
  for (const [cmd, info] of Object.entries(COMMANDS)) {
    if (!info.visible) continue;
    const aliasStr = info.aliases.length ? ` <span class="muted">(${info.aliases.join(', ')})</span>` : '';
    lines.push(`<span class="help-cmd">${cmd}${aliasStr}</span><span class="help-desc">${info.desc}</span>`);
  }
  lines.push('</div>');
  lines.push('');
  lines.push('<span class="faint-text">Hint: there are also some hidden commands… try exploring 😉</span>');
  return lines.join('\n');
}

export function cmdAbout() {
  return `<span class="section-header">┌─ About Me ─┐</span>

  Hey! I'm <span class="highlight">${esc(DATA.displayName)}</span>.

  🎓 ${esc(DATA.shortBio.split('\n')[0])}
  💡 ${esc(DATA.shortBio.split('\n')[1])}
  🌍 Based in <span class="value">${esc(DATA.location)}</span>

  ${esc(DATA.shortBio.split('\n')[2])}

  Type <span class="highlight">skills</span> to see my tech stack or <span class="highlight">projects</span> to see my work.`;
}

export function cmdEducation() {
  let out = '<span class="section-header">┌─ Education ─┐</span>\n';
  for (const edu of DATA.education) {
    out += `\n  ${edu.emoji} <span class="highlight">${esc(edu.degree)}</span>\n`;
    out += `     <span class="value">${esc(edu.school)}</span>\n`;
    out += `     <span class="muted">${esc(edu.location)} · ${esc(edu.period)}</span>\n`;
  }
  return out;
}

export function cmdSkills() {
  let out = '<span class="section-header">┌─ Technical Skills ─┐</span>\n';
  for (const [group, items] of Object.entries(DATA.skillGroups)) {
    const label = group.padEnd(12);
    const values = items.map(s => `<span class="value">${esc(s)}</span>`).join(' · ');
    out += `\n  <span class="label">${esc(label)}</span>  ${values}`;
  }
  return out;
}

export function cmdProjects() {
  let out = '<span class="section-header">┌─ Featured Projects ─┐</span>\n';
  DATA.projects.forEach((proj, i) => {
    const tags = proj.tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ');
    out += `\n  <span class="muted">${i + 1}.</span> <span class="highlight">${esc(proj.name)}</span>\n`;
    out += `     ${esc(proj.description)}\n`;
    out += `     ${tags}\n`;
  });
  return out;
}

export function cmdContact() {
  let out = `<span class="section-header">┌─ Contact ─┐</span>

  📧 <span class="label">Email</span>    <a href="mailto:${esc(DATA.email)}" class="link">${esc(DATA.email)}</a>
  📱 <span class="label">Phone</span>    <a href="tel:${esc(DATA.phone)}" class="link">${esc(DATA.phone)}</a>
  📍 <span class="label">Location</span> <span class="value">${esc(DATA.location)}</span>`;

  if (DATA.linkedin) {
    out += `\n  🔗 <span class="label">LinkedIn</span> <a href="${esc(DATA.linkedin)}" target="_blank" rel="noopener" class="link">LinkedIn Profile</a>`;
  }
  if (DATA.github) {
    out += `\n  🐙 <span class="label">GitHub</span>   <a href="${esc(DATA.github)}" target="_blank" rel="noopener" class="link">GitHub Profile</a>`;
  }
  if (DATA.x) {
    out += `\n  𝕏  <span class="label">X</span>        <a href="${esc(DATA.x)}" target="_blank" rel="noopener" class="link">X Profile</a>`;
  }
  return out;
}

export function cmdSocial() {
  let out = `<span class="section-header">┌─ Social Links ─┐</span>\n`;
  if (DATA.github) {
    out += `\n  🐙 <span class="label">GitHub</span>    <a href="${esc(DATA.github)}" target="_blank" rel="noopener" class="link">${esc(DATA.github)}</a>`;
  }
  if (DATA.linkedin) {
    out += `\n  🔗 <span class="label">LinkedIn</span>  <a href="${esc(DATA.linkedin)}" target="_blank" rel="noopener" class="link">${esc(DATA.linkedin)}</a>`;
  }
  if (DATA.x) {
    out += `\n  𝕏  <span class="label">X</span>         <a href="${esc(DATA.x)}" target="_blank" rel="noopener" class="link">${esc(DATA.x)}</a>`;
  }
  out += `\n  📧 <span class="label">Email</span>     <a href="mailto:${esc(DATA.email)}" class="link">${esc(DATA.email)}</a>`;
  return out;
}

export function cmdResume() {
  return 'OPEN_RESUME';
}

export function cmdNeofetch() {
  const art = `<span class="neofetch-art">  ┌─────────┐
  │  <span class="neofetch-glyph">&gt;_</span>     │
  └─────────┘</span>`;

  const nf = DATA.neofetchInfo;
  const info = `<span class="neofetch-info"><span class="highlight">visitor</span>@<span class="highlight">siddharth</span>
──────────────
<span class="label">role  </span>  ${esc(nf.role)}
<span class="label">focus </span>  ${esc(nf.focus)}
<span class="label">stack </span>  ${esc(nf.stack)}
<span class="label">based </span>  ${esc(nf.based)}
<span class="label">status</span>  <span class="status-green">●</span> ${esc(nf.status)}</span>`;

  return `<div class="neofetch">${art}${info}</div>`;
}

export function cmdClear() {
  return 'CLEAR_TERMINAL';
}

export function cmdBanner() {
  return '<span style="font-family:var(--font-display);font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.3em;color:var(--accent-gold);text-shadow:var(--glow-text)">S I D D H A R T H</span>';
}

export function cmdTheme() {
  return 'TOGGLE_SCANLINES';
}

export function cmdHistory(history) {
  if (!history.length) return '<span class="muted">No commands in history.</span>';
  return history.map((cmd, i) => `  <span class="muted">${String(i + 1).padStart(3)}</span>  ${esc(cmd)}`).join('\n');
}

export function cmdWhoami() {
  return '<span class="value">visitor — a welcome guest</span>';
}

export function cmdDate() {
  return `<span class="value">${new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })}</span>`;
}

export function cmdPwd() {
  return '<span class="value">/home/visitor/siddharth-portfolio</span>';
}

export function cmdLs() {
  return `  <span class="highlight">about.txt</span>      <span class="highlight">education.txt</span>   <span class="value">skills.dat</span>
  <span class="info">projects/</span>      <span class="highlight">contact.txt</span>     <span class="success">resume.pdf</span>
  <span class="info">social -> links/</span>`;
}

export function cmdEcho(args) {
  if (!args.length) return '';
  return `<span class="value">${esc(args.join(' '))}</span>`;
}

export function cmdWeather() {
  return `  🌤️ <a href="https://wttr.in/Karlskrona" target="_blank" rel="noopener" class="link">Check weather in Karlskrona →</a>`;
}

// ── Easter Egg Commands ──

// cmdMatrix removed

export function cmdCoffee() {
  return `<span class="muted">brewing...</span>

<span class="highlight">    ( (
     ) )
  ┌───────┐
  │       │]
  └───────┘
  ─────────</span>

  <span class="value">Here's your coffee ☕ — fuel for late-night coding sessions!</span>`;
}

export function cmdSudo(args) {
  if (args && args.length > 0 && args.join(' ').toLowerCase().includes('hire')) {
    return `<span class="success">sudo hire accepted! 🎉</span>

  I'm <span class="highlight">open to work</span> and would love to connect!
  Type <span class="highlight">contact</span> to reach out. Let's build something great together.`;
  }
  return `<span class="error">nice try 😏 — ${esc(DATA.displayName)} is not in the sudoers file. This incident will be reported.</span>`;
}

export function cmdHire() {
  const contactOutput = cmdContact();
  return `<span class="success">✨ Yes! I'm open to work! ✨</span>

  Let's build something amazing together.

${contactOutput}`;
}

export function cmdSecret() {
  return `<span class="highlight">🔮 The answer to life, the universe, and everything is... 42.</span>

  <span class="muted">You found a secret! Not many make it this far.</span>
  <span class="muted">Here's a cookie for your curiosity: 🍪</span>`;
}

export function cmdExit() { return '<span class="error">There is no escape! You\'re stuck with me. 😈</span>'; }
export function cmdCd()   { return '<span class="muted">You\'re already home. 🏠</span>'; }
export function cmdGui()  { return '<span class="error">This is a TERMINAL. We don\'t do GUIs here. 💻</span>'; }
export function cmdVim()  { return '<span class="error">You\'re now stuck in vim. Good luck. 😂</span>'; }
export function cmdRm()   { return '<span class="error">Nice try! Portfolio files are protected. 🛡️</span>'; }

// Map command names to handlers
export const HANDLERS = {
  help: cmdHelp,
  about: cmdAbout,
  education: cmdEducation,
  skills: cmdSkills,
  projects: cmdProjects,
  contact: cmdContact,
  social: cmdSocial,
  resume: cmdResume,
  neofetch: cmdNeofetch,
  clear: cmdClear,
  banner: cmdBanner,
  theme: cmdTheme,
  history: cmdHistory,
  whoami: cmdWhoami,
  date: cmdDate,
  pwd: cmdPwd,
  ls: cmdLs,
  echo: cmdEcho,
  weather: cmdWeather,
  // Easter eggs
  // matrix handler removed
  coffee: cmdCoffee,
  sudo: cmdSudo,
  hire: cmdHire,
  secret: cmdSecret,
  exit: cmdExit,
  cd: cmdCd,
  gui: cmdGui,
  vim: cmdVim,
  rm: cmdRm,
};
