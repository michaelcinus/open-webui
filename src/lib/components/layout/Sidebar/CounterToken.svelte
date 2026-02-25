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
          <svg width="35" height="19" viewBox="0 0 35 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="34" height="9" stroke="black" />
            <rect x="0.5" y="9.5" width="34" height="9" stroke="black" />
            <rect x="4" y="4" width="2" height="2" fill="#414142" />
            <rect x="4" y="13" width="2" height="2" fill="#BABDBE" />
            <rect x="4" y="13" width="2" height="2" fill="black" fill-opacity="0.2" />
            <rect x="12" y="4" width="19" height="2" fill="black" />
            <rect x="12" y="13" width="19" height="2" fill="black" />
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
            <rect x="0.5" y="0.5" width="34" height="9" stroke="black" />
            <rect x="0.5" y="9.5" width="34" height="9" stroke="black" />
            <rect x="4" y="4" width="2" height="2" fill="#414142" />
            <rect x="4" y="13" width="2" height="2" fill="#BABDBE" />
            <rect x="4" y="13" width="2" height="2" fill="black" fill-opacity="0.2" />
            <rect x="12" y="4" width="19" height="2" fill="black" />
            <rect x="12" y="13" width="19" height="2" fill="black" />
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

<style>
  .counter-token {
    width: 254px;
    background: #eeeeee;
    border-radius: 0px;
    padding: 1px 14px 30px;
    color: #111111 !important;
    font-family: inherit;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 9999;
    transition: padding 150ms ease, box-shadow 150ms ease;
  }

  .counter-token.is-collapsed {
    padding: 10px 12px 12px;
  }

  .content {
    transition: opacity 150ms ease, max-height 150ms ease;
    max-height: 500px;
    opacity: 1;
  }

  .counter-token.is-collapsed .content {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .collapsed-row {
    display: none;
    align-items: center;
    gap: 10px;
    min-height: 44px;
  }

  .counter-token.is-collapsed .collapsed-row {
    display: flex;
  }

  .collapsed-bar-row {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .collapsed-bar-row .bar {
    flex: 1;
  }

  .collapsed-value {
    font-weight: 700;
    font-size: 12px;
    color: #111111;
  }

  .top-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .mini-card {
    width: 44px;
    height: 30px;
    border: 1px solid #1f1f1f;
    background: #f7f7f7;
    border-radius: 3px;
    padding: 3px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mini-card-header {
    display: flex;
    gap: 3px;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    display: inline-block;
  }

  .dot.red { background: #f97316; }
  .dot.amber { background: #f59e0b; }
  .dot.green { background: #10b981; }

  .mini-card-line {
    height: 4px;
    background: #cfcfcf;
  }

  .mini-card-line.short {
    width: 70%;
  }

  .storage {
    margin-top: 20px;
    flex: 1;
  }

  .bar {
    height: 8px;
    background: #bfbfbf;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }

  .bar.tokens {
    margin-top: 2px;
  }

  .bar-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #f97316;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bar-row .bar {
    flex: 1;
  }

  .bar-total {
    color: #6b7280;
    font-size: 11px;
    margin-top: 4px;
  }

  .bar-value {
    font-weight: 700;
    font-size: 12px;
  }

  .stat-row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 13px;
  }

  .stat-row.tokens-row {
    align-items: flex-start;
    gap: 10px;
  }

  .token-stack {
    margin-top: 1px;
    flex: 1;
  }

  .label {
    width: 45px !important;
    color: #111827;
  }

  .value {
    margin-left: 9px;
    font-weight: 700;
  }

  .chevron {
    position: absolute;
    left: 50%;
    bottom: 6px;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: #111111;
    color: #ffffff;
    display: grid;
    place-items: center;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .chevron svg {
    width: 14px;
    height: 14px;
    transition: transform 150ms ease;
  }

  .counter-token.is-collapsed .chevron svg {
    transform: rotate(180deg);
  }

  :global(.dark) .counter-token {
    background: #3b3b3b;
    color: #f9fafb !important;
  }

  :global(.dark) .mini-card {
    background: #2f2f2f;
    border-color: #dddddd;
  }

  :global(.dark) .mini-card-line {
    background: #6b6b6b;
  }

  :global(.dark) .bar {
    background: #9a9a9a;
  }

  :global(.dark) .bar-total {
    color: #e5e7eb;
  }

  :global(.dark) .label {
    color: #f3f4f6;
  }

  :global(.dark) .chevron {
    background: #1f1f1f;
  }
</style>
