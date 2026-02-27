<script>
  import data from '$lib/components/data/counter-token.json';

  const storage = data.storage;
  const tokens = data.tokens;
  const users = data.users;
  const cta = data.cta;

  let collapsed = false;

  const clampPercent = (value) => Math.max(0, Math.min(100, value ?? 0));
  const normalizeNumber = (value) => {
    if (!value) return null;
    const cleaned = String(value).trim();
    const match = cleaned.match(/^([0-9.,]+)\s*([a-zA-Z]+)?$/);
    if (!match) return null;

    let numPart = match[1];
    const unit = match[2] ?? '';
    const lastDot = numPart.lastIndexOf('.');
    const lastComma = numPart.lastIndexOf(',');
    const hasDot = lastDot !== -1;
    const hasComma = lastComma !== -1;

    if (hasDot && !hasComma) {
      const digitsAfter = numPart.length - lastDot - 1;
      if (digitsAfter === 3 && numPart.match(/\./g)?.length >= 1) {
        numPart = numPart.replace(/\./g, '');
      } else {
        numPart = numPart.replace(/,/g, '');
      }
    } else if (hasComma && !hasDot) {
      const digitsAfter = numPart.length - lastComma - 1;
      if (digitsAfter === 3 && numPart.match(/,/g)?.length >= 1) {
        numPart = numPart.replace(/,/g, '');
      } else {
        numPart = numPart.replace(/\./g, '').replace(',', '.');
      }
    } else if (hasComma && hasDot) {
      const decimalSep = lastDot > lastComma ? '.' : ',';
      const parts = numPart.split(decimalSep);
      const intPart = parts[0].replace(/[.,]/g, '');
      const fracPart = parts.slice(1).join('').replace(/[.,]/g, '');
      numPart = fracPart.length ? `${intPart}.${fracPart}` : intPart;
    }

    const amount = Number(numPart);
    if (Number.isNaN(amount)) return null;
    return { amount, unit };
  };

  const parseCount = (label) => {
    const parsed = normalizeNumber(label);
    if (!parsed) return null;
    const unit = parsed.unit.toUpperCase();
    const multipliers = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
    return parsed.amount * (multipliers[unit] ?? 1);
  };

  const parseDataSize = (label) => {
    const parsed = normalizeNumber(label);
    if (!parsed) return null;
    const unit = parsed.unit.toUpperCase();
    const multipliers = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };
    const normalizedUnit = unit.replace(/IB$/i, 'B');
    return parsed.amount * (multipliers[normalizedUnit] ?? 1);
  };

  const computePercent = ({ usedLabel, totalLabel, fallback }) => {
    const used = parseDataSize(usedLabel) ?? parseCount(usedLabel);
    const total = parseDataSize(totalLabel) ?? parseCount(totalLabel);
    if (used === null || total === null || total === 0) return clampPercent(fallback);
    return clampPercent((used / total) * 100);
  };

  const storagePercent = computePercent({
    usedLabel: storage.usedLabel,
    totalLabel: storage.totalLabel,
    fallback: storage.percent
  });

  const tokenPercent = computePercent({
    usedLabel: tokens.usedLabel,
    totalLabel: tokens.valueLabel,
    fallback: tokens.percent
  });
</script>

<div class="counter-token {collapsed ? 'is-collapsed' : ''}" aria-label="Usage summary">
  <div class="content">
    <div class="top-row">
      <div class="label" aria-hidden="true">
        <div class="mini-card-header">
          <svg class="mini-card-icon" width="35" height="19" viewBox="0 0 35 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="34" height="9" stroke="currentColor" />
            <rect x="0.5" y="9.5" width="34" height="9" stroke="currentColor" />
            <rect x="4" y="4" width="2" height="2" fill="#414142" />
            <rect x="4" y="13" width="2" height="2" fill="#BABDBE" />
            <rect x="4" y="13" width="2" height="2" fill="currentColor" fill-opacity="0.2" />
            <rect x="12" y="4" width="19" height="2" fill="currentColor" />
            <rect x="12" y="13" width="19" height="2" fill="currentColor" />
            <rect x="8" y="4" width="2" height="2" fill="#F25C05" />
            <rect x="8" y="13" width="2" height="2" fill="#BABDBE" />
          </svg>
        </div>
      </div>

      <div class="storage">
        <div class="bar-row">
          <div class="bar">
            <span class="bar-fill" style={`width: ${storagePercent}%`}></span>
          </div>
          <span class="bar-value">{storage.usedLabel}</span>
        </div>
        <div class="bar-total">{storage.totalLabel}</div>
      </div>
    </div>
  
    <div class="stat-row tokens-row">
      <span class="label">{tokens.label}</span>
      <div class="token-stack">
        <div class="bar-row">
          <div class="bar tokens">
            <span class="bar-fill" style={`width: ${tokenPercent}%`}></span>
          </div>
          <span class="bar-value">{tokens.usedLabel}</span>
        </div>
        <div class="bar-total">{tokens.valueLabel}</div>
      </div>
    </div>
  
    <div class="stat-row">
      <span class="label">{users.label}</span>
      <span class="value">{users.valueLabel}</span>
    </div>
    </div>

  <div class="collapsed-row" aria-hidden={!collapsed}>
      <div class="label" aria-hidden="true">
        <div class="mini-card-header">
          <svg width="35" height="19" viewBox="0 0 35 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="34" height="9" stroke="currentColor" />
            <rect x="0.5" y="9.5" width="34" height="9" stroke="currentColor" />
            <rect x="4" y="4" width="2" height="2" fill="#414142" />
            <rect x="4" y="13" width="2" height="2" fill="#BABDBE" />
            <rect x="4" y="13" width="2" height="2" fill="currentColor" fill-opacity="0.2" />
            <rect x="12" y="4" width="19" height="2" fill="currentColor" />
            <rect x="12" y="13" width="19" height="2" fill="currentColor" />
            <rect x="8" y="4" width="2" height="2" fill="#F25C05" />
            <rect x="8" y="13" width="2" height="2" fill="#BABDBE" />
          </svg>
        </div>
      </div>

    <div class="collapsed-bar-row">
      <div class="bar">
        <span class="bar-fill" style={`width: ${storagePercent}%`}></span>
      </div>
      <div class="collapsed-value">{storage.usedLabel}</div>
    </div>
  </div>

  <button
    type="button"
    class="chevron"
    aria-label={collapsed ? 'Expand token usage' : 'Collapse token usage'}
    aria-expanded={!collapsed}
    on:click={() => {
      collapsed = !collapsed;
    }}
  >
    <svg viewBox="0 0 24 24" role="img">
      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</div>
