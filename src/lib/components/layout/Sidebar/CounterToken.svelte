<script>
  import data from '$lib/components/data/counter-token.json';

  const storage = data.storage;
  const tokens = data.tokens;
  const users = data.users;
  const cta = data.cta;

  let collapsed = false;
  const MIN_VISIBLE_PERCENT = 4;

  const clampPercent = (value) => Math.max(0, Math.min(100, value ?? 0));
  const toVisiblePercent = (value) => {
    const clamped = clampPercent(value);
    if (clamped > 0 && clamped < MIN_VISIBLE_PERCENT) {
      return MIN_VISIBLE_PERCENT;
    }
    return clamped;
  };
  const storagePercent = clampPercent(storage.percent);
  const storageFillPercent = toVisiblePercent(storagePercent);

  const tokenPercent = clampPercent(tokens.percent);
  const tokenFillPercent = toVisiblePercent(tokenPercent);
</script>

<div class="counter-token {collapsed ? 'is-collapsed' : ''}" aria-label="Usage summary">
  <div class="content">
    <div class="top-row">
      <div class="label" aria-hidden="true">
        <div class="mini-card-header">
          <svg class="mini-card-icon" width="35" height="19" viewBox="0 0 35 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="34" height="9" stroke="currentColor" />
            <rect x="0.5" y="9.5" width="34" height="9" stroke="currentColor" />
            <rect class="fill-custom" x="4" y="4" width="2" height="2" fill="#FFFFFF" />
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
            <span class="bar-fill" style={`width: ${storageFillPercent}%`}></span>
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
            <span class="bar-fill" style={`width: ${tokenFillPercent}%`}></span>
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
            <rect class="fill-custom" x="4" y="4" width="2" height="2" fill="#FFFFFF" />
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
        <span class="bar-fill" style={`width: ${storageFillPercent}%`}></span>
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
