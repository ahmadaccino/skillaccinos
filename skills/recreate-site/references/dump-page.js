/**
 * Paste into page.evaluate (Aside REPL or agent-browser eval --stdin).
 * Returns JSON: viewport, type root, fonts, colors, named layers, text blocks, media.
 */
(() => {
  const px = (n) => Math.round(n * 10) / 10
  const vis = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  const fonts = [...document.fonts].map((f) => ({
    family: f.family,
    weight: f.weight,
    style: f.style,
    status: f.status,
  }))

  const fontFaces = []
  for (const ss of document.styleSheets) {
    try {
      for (const r of ss.cssRules) {
        if (r instanceof CSSFontFaceRule) fontFaces.push(r.cssText)
      }
    } catch {}
  }

  const colors = new Set()
  const named = [...document.querySelectorAll('[data-framer-name], [data-name], [id], section, header, footer')]
    .slice(0, 80)
    .map((el) => {
      if (!vis(el)) return null
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      colors.add(s.color)
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(s.backgroundColor)
      return {
        name: el.getAttribute('data-framer-name') || el.getAttribute('data-name') || el.id || el.tagName.toLowerCase(),
        x: px(r.x),
        y: px(r.y + scrollY),
        w: px(r.width),
        h: px(r.height),
        pos: s.position,
        z: s.zIndex,
        display: s.display,
        grid: s.gridTemplateColumns,
        gap: s.gap,
        pad: s.padding,
        bg: s.backgroundColor,
        mix: s.mixBlendMode,
        filter: s.filter,
        radius: s.borderRadius,
        overflow: s.overflow,
        opacity: s.opacity,
        transform: s.transform,
        sticky: s.top,
      }
    })
    .filter(Boolean)

  const seen = new Set()
  const text = []
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,label,span')) {
    if (el.children.length > 3) continue
    const t = (el.innerText || '').replace(/\s+/g, ' ').trim()
    if (!t || t.length < 2 || t.length > 180) continue
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    const key = `${t.slice(0, 40)}|${Math.round(r.y + scrollY)}|${s.fontSize}`
    if (seen.has(key)) continue
    seen.add(key)
    text.push({
      t,
      tag: el.tagName.toLowerCase(),
      x: px(r.x),
      y: px(r.y + scrollY),
      w: px(r.width),
      h: px(r.height),
      fs: s.fontSize,
      fw: s.fontWeight,
      ff: s.fontFamily.split(',')[0].replace(/['"]/g, ''),
      lh: s.lineHeight,
      ls: s.letterSpacing,
      color: s.color,
      ws: s.whiteSpace,
    })
    if (text.length >= 80) break
  }

  const media = [...document.querySelectorAll('img, video, svg')].map((el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(),
      src: (el.currentSrc || el.src || '').split('?')[0],
      w: px(r.width),
      h: px(r.height),
      x: px(r.x),
      y: px(r.y + scrollY),
      nw: el.naturalWidth || el.videoWidth || null,
      nh: el.naturalHeight || el.videoHeight || null,
      fit: s.objectFit,
      mix: s.mixBlendMode,
    }
  }).filter((m) => m.w > 8 && m.h > 8)

  const html = getComputedStyle(document.documentElement)
  const body = getComputedStyle(document.body)

  return {
    url: location.href,
    viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio, scrollH: document.documentElement.scrollHeight },
    root: {
      htmlFontSize: html.fontSize,
      bodyFontSize: body.fontSize,
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
      bodyFont: body.fontFamily,
    },
    fonts,
    fontFaces,
    colors: [...colors],
    named,
    text,
    media,
  }
})()
