const colors = [
  "#f94144",
  "#f8961e",
  "#f9c74f",
  "#43aa8b",
  "#277da1",
  "#9b5de5",
  "#ff70a6",
  "#70d6ff",
  "#8ac926",
  "#6d597a",
  "#8d5524",
  "#ffffff"
];

const lineAttrs = `fill="none" stroke="#111" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"`;

function svgPage(content) {
  return `<svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg"><g ${lineAttrs}>${content}</g></svg>`;
}

function maskPage(content) {
  return `<svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

function layer(content, x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${content}</g>`;
}

function fittedLayers(pieces, content) {
  const artSize = 330;
  const padding = 0;
  const bounds = pieces.reduce(
    (box, [, x, y, scale = 1]) => ({
      minX: Math.min(box.minX, x),
      minY: Math.min(box.minY, y),
      maxX: Math.max(box.maxX, x + artSize * scale),
      maxY: Math.max(box.maxY, y + artSize * scale)
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const fitScale = Math.min((900 - padding * 2) / width, (900 - padding * 2) / height);
  const x = (900 - width * fitScale) / 2 - bounds.minX * fitScale;
  const y = (900 - height * fitScale) / 2 - bounds.minY * fitScale;

  return `<g transform="translate(${x} ${y}) scale(${fitScale})">${content}</g>`;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const artParts = {
  
  dog: {
    line: `<path d="M66 128 C66 76 104 48 150 48 C196 48 234 76 234 128 C234 212 196 260 150 260 C104 260 66 212 66 128 Z" /><path d="M82 106 C48 82 38 34 72 24 C108 14 128 60 112 104" /><path d="M218 106 C252 82 262 34 228 24 C192 14 172 60 188 104" /><path d="M116 142 C124 134 136 134 144 142" /><path d="M156 142 C164 134 176 134 184 142" /><path d="M150 160 C136 160 128 172 138 184 C146 192 154 192 162 184 C172 172 164 160 150 160 Z" /><path d="M150 184 V204" /><path d="M126 214 C140 228 160 228 174 214" />`,
    mask: `<path fill="#000" d="M66 128 C66 76 104 48 150 48 C196 48 234 76 234 128 C234 212 196 260 150 260 C104 260 66 212 66 128 Z" /><path fill="#000" d="M82 106 C48 82 38 34 72 24 C108 14 128 60 112 104 Z" /><path fill="#000" d="M218 106 C252 82 262 34 228 24 C192 14 172 60 188 104 Z" />`
  },
  cat: {
    line: `<path d="M72 116 L56 44 L120 86" /><path d="M228 116 L244 44 L180 86" /><path d="M52 142 C52 82 98 56 150 56 C202 56 248 82 248 142 C248 218 200 260 150 260 C100 260 52 218 52 142 Z" /><path d="M112 146 C120 138 132 138 140 146" /><path d="M160 146 C168 138 180 138 188 146" /><path d="M150 164 L138 184 L162 184 Z" /><path d="M150 184 C136 202 116 208 96 204" /><path d="M150 184 C164 202 184 208 204 204" />`,
    mask: `<path fill="#000" d="M72 116 L56 44 L120 86 C138 66 162 66 180 86 L244 44 L228 116 C244 138 250 162 248 188 C242 234 202 260 150 260 C98 260 58 234 52 188 C50 162 56 138 72 116 Z" />`
  },
  rabbit: {
    line: `<ellipse cx="150" cy="160" rx="78" ry="92" /><path d="M116 76 C88 22 108 0 140 60" /><path d="M184 76 C212 22 192 0 160 60" /><path d="M118 150 C126 140 138 140 146 150" /><path d="M154 150 C162 140 174 140 182 150" /><path d="M150 170 L140 184 L160 184 Z" /><path d="M126 212 C140 230 160 230 174 212" /><path d="M84 190 H38" /><path d="M216 190 H262" />`,
    mask: `<ellipse fill="#000" cx="150" cy="160" rx="78" ry="92" /><path fill="#000" d="M116 76 C88 22 108 0 140 60 Z" /><path fill="#000" d="M184 76 C212 22 192 0 160 60 Z" />`
  },
  fish: {
    line: `<path d="M34 150 C82 88 184 88 236 148 C258 122 278 106 296 100 C288 132 288 168 296 200 C278 194 258 178 236 152 C184 212 82 212 34 150 Z" /><circle cx="92" cy="136" r="10" /><path d="M134 104 C150 134 150 166 134 196" /><path d="M176 104 C192 134 192 166 176 196" />`,
    mask: `<path fill="#000" d="M34 150 C82 88 184 88 236 148 C258 122 278 106 296 100 C288 132 288 168 296 200 C278 194 258 178 236 152 C184 212 82 212 34 150 Z" />`
  },
  bird: {
    line: `<path d="M76 164 C82 104 132 66 184 84 C238 102 258 162 228 212 C194 266 98 250 76 164 Z" /><path d="M208 120 L282 102 L230 152" /><circle cx="178" cy="126" r="8" /><path d="M118 170 C154 130 200 136 222 178" /><path d="M130 242 L106 280" /><path d="M176 246 L182 286" />`,
    mask: `<path fill="#000" d="M76 164 C82 104 132 66 184 84 C238 102 258 162 228 212 C194 266 98 250 76 164 Z" /><path fill="#000" d="M208 120 L282 102 L230 152 Z" />`
  },
  butterfly: {
    line: `<path d="M150 82 C122 42 62 42 38 84 C8 136 52 194 128 180 C116 234 88 276 128 286 C146 290 150 238 150 194" /><path d="M150 82 C178 42 238 42 262 84 C292 136 248 194 172 180 C184 234 212 276 172 286 C154 290 150 238 150 194" /><path d="M150 84 C166 118 166 182 150 214 C134 182 134 118 150 84 Z" /><path d="M118 28 C140 44 146 58 150 82" /><path d="M182 28 C160 44 154 58 150 82" />`,
    mask: `<path fill="#000" d="M150 82 C122 42 62 42 38 84 C8 136 52 194 128 180 C116 234 88 276 128 286 C146 290 150 238 150 194 C150 238 154 290 172 286 C212 276 184 234 172 180 C248 194 292 136 262 84 C238 42 178 42 150 82 Z" />`
  },
  turtle: {
    line: `<ellipse cx="146" cy="164" rx="92" ry="66" /><path d="M220 146 C252 128 282 142 286 170 C262 184 238 176 220 146 Z" /><circle cx="260" cy="158" r="6" /><path d="M80 128 L54 98" /><path d="M98 214 L72 246" /><path d="M194 214 L224 246" /><path d="M112 122 C128 148 128 180 112 206" /><path d="M150 100 C170 142 170 184 150 228" /><path d="M186 122 C202 148 202 180 186 206" />`,
    mask: `<ellipse fill="#000" cx="146" cy="164" rx="92" ry="66" /><path fill="#000" d="M220 146 C252 128 282 142 286 170 C262 184 238 176 220 146 Z" />`
  },
  flower: {
    line: `<circle cx="150" cy="102" r="26" /><path d="M150 76 C132 36 158 12 184 36 C204 56 184 76 150 76 Z" /><path d="M176 102 C216 84 240 110 216 136 C196 156 176 136 176 102 Z" /><path d="M150 128 C168 168 142 192 116 168 C96 148 116 128 150 128 Z" /><path d="M124 102 C84 120 60 94 84 68 C104 48 124 68 124 102 Z" /><path d="M150 128 V280" /><path d="M150 210 C108 180 70 198 54 234 C102 250 136 240 150 210 Z" /><path d="M150 238 C188 204 230 214 250 246 C202 270 168 262 150 238 Z" />`,
    mask: `<circle fill="#000" cx="150" cy="102" r="30" /><path fill="#000" d="M150 76 C132 36 158 12 184 36 C204 56 184 76 150 76 Z" /><path fill="#000" d="M176 102 C216 84 240 110 216 136 C196 156 176 136 176 102 Z" /><path fill="#000" d="M150 128 C168 168 142 192 116 168 C96 148 116 128 150 128 Z" /><path fill="#000" d="M124 102 C84 120 60 94 84 68 C104 48 124 68 124 102 Z" /><path fill="none" stroke="#000" stroke-width="36" stroke-linecap="round" d="M150 128 V280" /><path fill="#000" d="M150 210 C108 180 70 198 54 234 C102 250 136 240 150 210 Z" /><path fill="#000" d="M150 238 C188 204 230 214 250 246 C202 270 168 262 150 238 Z" />`
  },
  tree: {
    line: `<path d="M132 274 V170" /><path d="M170 274 V170" /><path d="M72 168 C42 148 42 104 76 88 C82 50 124 30 152 54 C184 18 246 38 250 92 C294 96 320 142 294 180 C314 220 274 262 232 246 C208 280 150 278 128 244 C84 258 50 208 72 168 Z" /><path d="M94 274 H208" />`,
    mask: `<path fill="#000" d="M72 168 C42 148 42 104 76 88 C82 50 124 30 152 54 C184 18 246 38 250 92 C294 96 320 142 294 180 C314 220 274 262 232 246 C208 280 150 278 128 244 C84 258 50 208 72 168 Z" /><path fill="#000" d="M124 168 H178 V282 H124 Z" />`
  },
  sun: {
    line: `<circle cx="150" cy="150" r="58" /><path d="M150 34 V74" /><path d="M150 226 V266" /><path d="M34 150 H74" /><path d="M226 150 H266" /><path d="M68 68 L96 96" /><path d="M204 204 L232 232" /><path d="M232 68 L204 96" /><path d="M96 204 L68 232" /><path d="M118 140 C126 132 138 132 146 140" /><path d="M154 140 C162 132 174 132 182 140" /><path d="M116 174 C136 198 164 198 184 174" />`,
    mask: `<circle fill="#000" cx="150" cy="150" r="64" /><g fill="none" stroke="#000" stroke-width="34" stroke-linecap="round"><path d="M150 34 V74" /><path d="M150 226 V266" /><path d="M34 150 H74" /><path d="M226 150 H266" /><path d="M68 68 L96 96" /><path d="M204 204 L232 232" /><path d="M232 68 L204 96" /><path d="M96 204 L68 232" /></g>`
  },
  cloud: {
    line: `<path d="M70 190 C36 190 14 166 14 136 C14 104 42 82 76 90 C92 54 136 36 174 54 C204 24 260 44 264 94 C300 96 326 124 326 158 C326 194 296 220 258 216 H78 C50 216 30 204 18 184" />`,
    mask: `<path fill="#000" d="M70 190 C36 190 14 166 14 136 C14 104 42 82 76 90 C92 54 136 36 174 54 C204 24 260 44 264 94 C300 96 326 124 326 158 C326 194 296 220 258 216 H78 C50 216 30 204 18 184 Z" />`
  },
  rainbow: {
    line: `<path d="M34 230 C34 132 86 62 150 62 C214 62 266 132 266 230" /><path d="M72 230 C72 158 106 104 150 104 C194 104 228 158 228 230" /><path d="M110 230 C110 182 126 148 150 148 C174 148 190 182 190 230" /><path d="M34 230 H266" />`,
    mask: `<path fill="none" stroke="#000" stroke-width="42" stroke-linecap="round" d="M34 230 C34 132 86 62 150 62 C214 62 266 132 266 230" /><path fill="none" stroke="#000" stroke-width="42" stroke-linecap="round" d="M72 230 C72 158 106 104 150 104 C194 104 228 158 228 230" /><path fill="none" stroke="#000" stroke-width="42" stroke-linecap="round" d="M110 230 C110 182 126 148 150 148 C174 148 190 182 190 230" />`
  },
  star: {
    line: `<path d="M150 34 L182 112 L266 118 L202 172 L222 254 L150 210 L78 254 L98 172 L34 118 L118 112 Z" />`,
    mask: `<path fill="#000" d="M150 34 L182 112 L266 118 L202 172 L222 254 L150 210 L78 254 L98 172 L34 118 L118 112 Z" />`
  },
  moon: {
    line: `<path d="M198 44 C150 58 116 104 116 158 C116 222 168 274 232 274 C176 296 92 258 70 184 C48 110 96 34 198 44 Z" />`,
    mask: `<path fill="#000" d="M198 44 C150 58 116 104 116 158 C116 222 168 274 232 274 C176 296 92 258 70 184 C48 110 96 34 198 44 Z" />`
  },
  car: {
    line: `<path d="M40 164 L66 104 C76 84 94 72 116 72 H198 C220 72 238 84 248 104 L274 164" /><path d="M36 164 H280 C298 164 310 178 310 194 V224 H10 V194 C10 178 22 164 36 164 Z" /><path d="M102 72 L84 126 H230 L212 72" /><circle cx="72" cy="224" r="28" /><circle cx="248" cy="224" r="28" />`,
    mask: `<path fill="#000" d="M40 164 L66 104 C76 84 94 72 116 72 H198 C220 72 238 84 248 104 L274 164 H280 C298 164 310 178 310 194 V224 H10 V194 C10 178 22 164 36 164 Z" /><circle fill="#000" cx="72" cy="224" r="28" /><circle fill="#000" cx="248" cy="224" r="28" />`
  },
  bus: {
    line: `<path d="M34 64 H274 C292 64 306 78 306 96 V220 H18 V80 C18 72 26 64 34 64 Z" /><path d="M42 94 H118 V152 H42 Z" /><path d="M136 94 H212 V152 H136 Z" /><path d="M230 94 H284 V152 H230 Z" /><circle cx="76" cy="220" r="28" /><circle cx="248" cy="220" r="28" /><path d="M18 176 H306" />`,
    mask: `<path fill="#000" d="M34 64 H274 C292 64 306 78 306 96 V220 H18 V80 C18 72 26 64 34 64 Z" /><circle fill="#000" cx="76" cy="220" r="28" /><circle fill="#000" cx="248" cy="220" r="28" />`
  },
  rocket: {
    line: `<path d="M150 24 C202 76 220 154 194 234 H106 C80 154 98 76 150 24 Z" /><circle cx="150" cy="112" r="28" /><path d="M106 234 L64 284 L98 294 L126 234" /><path d="M194 234 L236 284 L202 294 L174 234" /><path d="M128 234 H172 L186 294 C166 274 134 274 114 294 Z" />`,
    mask: `<path fill="#000" d="M150 24 C202 76 220 154 194 234 H106 C80 154 98 76 150 24 Z" /><path fill="#000" d="M106 234 L64 284 L98 294 L126 234 Z" /><path fill="#000" d="M194 234 L236 284 L202 294 L174 234 Z" /><path fill="#000" d="M128 234 H172 L186 294 C166 274 134 274 114 294 Z" />`
  },
  airplane: {
    line: `<path d="M12 154 L272 78 C294 72 306 96 288 110 L204 174 L228 260 L196 268 L154 208 L76 256 L50 252 L98 188 L20 178 Z" /><path d="M98 188 L204 174" /><path d="M154 208 L132 154" />`,
    mask: `<path fill="#000" d="M12 154 L272 78 C294 72 306 96 288 110 L204 174 L228 260 L196 268 L154 208 L76 256 L50 252 L98 188 L20 178 Z" />`
  },
  boat: {
    line: `<path d="M150 34 V170" /><path d="M150 42 C98 80 70 122 58 164 H150 Z" /><path d="M150 58 C206 90 236 128 250 164 H150 Z" /><path d="M34 184 H266 L232 248 C210 284 90 284 68 248 Z" /><path d="M50 224 C82 242 110 242 142 224 C174 242 202 242 234 224" />`,
    mask: `<path fill="#000" d="M150 42 C98 80 70 122 58 164 H150 Z" /><path fill="#000" d="M150 58 C206 90 236 128 250 164 H150 Z" /><path fill="#000" d="M34 184 H266 L232 248 C210 284 90 284 68 248 Z" />`
  },
  train: {
    line: `<path d="M42 112 H210 C252 112 282 144 282 186 V218 H22 V132 C22 120 30 112 42 112 Z" /><path d="M62 70 H144 V112 H62 Z" /><path d="M166 82 H226 L242 112 H166 Z" /><circle cx="78" cy="218" r="24" /><circle cx="150" cy="218" r="24" /><circle cx="230" cy="218" r="24" /><path d="M46 146 H112" /><path d="M136 146 H202" />`,
    mask: `<path fill="#000" d="M42 112 H210 C252 112 282 144 282 186 V218 H22 V132 C22 120 30 112 42 112 Z" /><path fill="#000" d="M62 70 H144 V112 H62 Z" /><path fill="#000" d="M166 82 H226 L242 112 H166 Z" /><circle fill="#000" cx="78" cy="218" r="24" /><circle fill="#000" cx="150" cy="218" r="24" /><circle fill="#000" cx="230" cy="218" r="24" />`
  },
  apple: {
    line: `<path d="M150 92 C116 54 46 84 48 154 C50 228 102 284 150 246 C198 284 250 228 252 154 C254 84 184 54 150 92 Z" /><path d="M150 92 C152 56 172 34 202 28" /><path d="M166 58 C192 46 216 56 232 82 C202 96 182 88 166 58 Z" />`,
    mask: `<path fill="#000" d="M150 92 C116 54 46 84 48 154 C50 228 102 284 150 246 C198 284 250 228 252 154 C254 84 184 54 150 92 Z" /><path fill="#000" d="M166 58 C192 46 216 56 232 82 C202 96 182 88 166 58 Z" />`
  },
  cake: {
    line: `<path d="M62 126 H238 V254 H62 Z" /><path d="M62 166 C96 196 118 136 150 166 C182 196 204 136 238 166" /><path d="M82 126 V88" /><path d="M150 126 V82" /><path d="M218 126 V88" /><path d="M72 254 H228" /><path d="M82 88 C72 72 88 58 82 44 C100 56 108 76 82 88 Z" /><path d="M150 82 C140 66 156 52 150 38 C168 50 176 70 150 82 Z" /><path d="M218 88 C208 72 224 58 218 44 C236 56 244 76 218 88 Z" />`,
    mask: `<path fill="#000" d="M62 126 H238 V254 H62 Z" /><path fill="none" stroke="#000" stroke-width="22" stroke-linecap="round" d="M82 126 V88 M150 126 V82 M218 126 V88" /><path fill="#000" d="M82 88 C72 72 88 58 82 44 C100 56 108 76 82 88 Z" /><path fill="#000" d="M150 82 C140 66 156 52 150 38 C168 50 176 70 150 82 Z" /><path fill="#000" d="M218 88 C208 72 224 58 218 44 C236 56 244 76 218 88 Z" />`
  },
  icecream: {
    line: `<path d="M92 132 C70 86 106 44 150 58 C194 44 230 86 208 132 C244 154 232 204 190 210 H110 C68 204 56 154 92 132 Z" /><path d="M104 210 L150 286 L196 210" /><path d="M120 232 H180" /><path d="M134 254 H166" />`,
    mask: `<path fill="#000" d="M92 132 C70 86 106 44 150 58 C194 44 230 86 208 132 C244 154 232 204 190 210 H110 C68 204 56 154 92 132 Z" /><path fill="#000" d="M104 210 L150 286 L196 210 Z" />`
  },
  pizza: {
    line: `<path d="M54 62 L254 112 L114 272 Z" /><path d="M54 62 C116 88 188 104 254 112" /><circle cx="142" cy="130" r="12" /><circle cx="176" cy="176" r="12" /><circle cx="126" cy="214" r="12" /><path d="M118 104 C136 116 142 136 132 154" />`,
    mask: `<path fill="#000" d="M54 62 L254 112 L114 272 Z" />`
  },
  cupcake: {
    line: `<path d="M88 146 C60 98 100 54 148 76 C196 54 238 98 208 146" /><path d="M70 146 H230 L202 268 H98 Z" /><path d="M92 190 H208" /><path d="M106 228 H194" /><circle cx="150" cy="58" r="16" />`,
    mask: `<path fill="#000" d="M88 146 C60 98 100 54 148 76 C196 54 238 98 208 146 Z" /><path fill="#000" d="M70 146 H230 L202 268 H98 Z" /><circle fill="#000" cx="150" cy="58" r="16" />`
  },
  house: {
    line: `<path d="M42 142 L150 52 L258 142" /><path d="M70 140 V270 H230 V140" /><path d="M124 270 V198 H176 V270" /><path d="M92 166 H132 V206 H92 Z" /><path d="M168 166 H208 V206 H168 Z" />`,
    mask: `<path fill="#000" d="M42 142 L150 52 L258 142 Z" /><path fill="#000" d="M70 140 V270 H230 V140 Z" />`
  },
  kite: {
    line: `<path d="M150 28 L242 124 L150 256 L58 124 Z" /><path d="M150 28 V256" /><path d="M58 124 H242" /><path d="M150 256 C122 280 168 306 140 330" /><path d="M126 286 L106 300" /><path d="M158 306 L184 318" />`,
    mask: `<path fill="#000" d="M150 28 L242 124 L150 256 L58 124 Z" />`
  },
  ball: {
    line: `<circle cx="150" cy="150" r="108" /><path d="M150 42 C118 86 116 214 150 258" /><path d="M150 42 C182 86 184 214 150 258" /><path d="M54 104 C104 132 196 132 246 104" /><path d="M54 196 C104 168 196 168 246 196" />`,
    mask: `<circle fill="#000" cx="150" cy="150" r="108" />`
  },
  gift: {
    line: `<path d="M54 122 H246 V266 H54 Z" /><path d="M42 82 H258 V122 H42 Z" /><path d="M150 82 V266" /><path d="M110 82 C68 62 92 26 146 80" /><path d="M190 82 C232 62 208 26 154 80" />`,
    mask: `<path fill="#000" d="M54 122 H246 V266 H54 Z" /><path fill="#000" d="M42 82 H258 V122 H42 Z" /><path fill="#000" d="M110 82 C68 62 92 26 146 80 Z" /><path fill="#000" d="M190 82 C232 62 208 26 154 80 Z" />`
  },
  robot: {
    line: `<path d="M80 94 H220 V238 H80 Z" /><path d="M120 94 V52 H180 V94" /><circle cx="120" cy="144" r="16" /><circle cx="180" cy="144" r="16" /><path d="M116 198 H184" /><path d="M80 132 H44 V206 H80" /><path d="M220 132 H256 V206 H220" /><path d="M110 238 V282" /><path d="M190 238 V282" />`,
    mask: `<path fill="#000" d="M80 94 H220 V238 H80 Z" /><path fill="#000" d="M120 94 V52 H180 V94 Z" /><path fill="none" stroke="#000" stroke-width="28" stroke-linecap="round" d="M80 166 H44 V206 M220 166 H256 V206 M110 238 V282 M190 238 V282" />`
  },
  crown: {
    line: `<path d="M46 230 H254 L236 100 L188 166 L150 74 L112 166 L64 100 Z" /><path d="M70 230 V260 H230 V230" /><circle cx="150" cy="72" r="12" /><circle cx="64" cy="100" r="12" /><circle cx="236" cy="100" r="12" />`,
    mask: `<path fill="#000" d="M46 230 H254 L236 100 L188 166 L150 74 L112 166 L64 100 Z" /><path fill="#000" d="M70 230 V260 H230 V230 Z" /><circle fill="#000" cx="150" cy="72" r="12" /><circle fill="#000" cx="64" cy="100" r="12" /><circle fill="#000" cx="236" cy="100" r="12" />`
  },
  frog: {
    line: `<ellipse cx="150" cy="168" rx="90" ry="72" /><circle cx="110" cy="104" r="20" /><circle cx="190" cy="104" r="20" /><circle cx="110" cy="104" r="7" /><circle cx="190" cy="104" r="7" /><path d="M118 182 C136 200 164 200 182 182" /><path d="M126 162 C138 156 162 156 174 162" /><path d="M82 136 C56 116 44 138 58 156" /><path d="M218 136 C244 116 256 138 242 156" />`,
    mask: `<ellipse fill="#000" cx="150" cy="168" rx="90" ry="72" /><circle fill="#000" cx="110" cy="104" r="20" /><circle fill="#000" cx="190" cy="104" r="20" />`
  },
  bee: {
    line: `<ellipse cx="150" cy="164" rx="88" ry="54" /><path d="M120 132 C102 100 122 84 142 104" /><path d="M180 132 C198 100 178 84 158 104" /><path d="M124 140 H176" /><path d="M112 164 H188" /><path d="M124 188 H176" /><path d="M90 148 C58 132 48 154 74 170" /><path d="M210 148 C242 132 252 154 226 170" /><path d="M150 218 V260" />`,
    mask: `<ellipse fill="#000" cx="150" cy="164" rx="88" ry="54" /><path fill="#000" d="M120 132 C102 100 122 84 142 104 Z" /><path fill="#000" d="M180 132 C198 100 178 84 158 104 Z" />`
  },
  pig: {
    line: `<circle cx="150" cy="154" r="86" /><path d="M96 94 L68 54 L110 74" /><path d="M204 94 L232 54 L190 74" /><ellipse cx="150" cy="172" rx="34" ry="26" /><circle cx="138" cy="170" r="5" /><circle cx="162" cy="170" r="5" /><path d="M124 140 C136 132 164 132 176 140" /><path d="M112 206 C132 224 168 224 188 206" />`,
    mask: `<circle fill="#000" cx="150" cy="154" r="86" /><path fill="#000" d="M96 94 L68 54 L110 74 Z" /><path fill="#000" d="M204 94 L232 54 L190 74 Z" /><ellipse fill="#000" cx="150" cy="172" rx="34" ry="26" />`
  },
  panda: {
    line: `<circle cx="150" cy="154" r="84" /><circle cx="92" cy="100" r="24" /><circle cx="208" cy="100" r="24" /><ellipse cx="124" cy="154" rx="24" ry="30" /><ellipse cx="176" cy="154" rx="24" ry="30" /><path d="M142 182 C146 176 154 176 158 182" /><path d="M124 214 C138 226 162 226 176 214" />`,
    mask: `<circle fill="#000" cx="150" cy="154" r="84" /><circle fill="#000" cx="92" cy="100" r="24" /><circle fill="#000" cx="208" cy="100" r="24" /><ellipse fill="#fff" cx="124" cy="154" rx="24" ry="30" /><ellipse fill="#fff" cx="176" cy="154" rx="24" ry="30" />`
  },
  truck: {
    line: `<path d="M40 146 H200 V88 H262 L308 146 V214 H40 Z" /><path d="M200 114 H250 L274 146" /><rect x="54" y="106" width="98" height="52" rx="8" /><circle cx="96" cy="214" r="28" /><circle cx="246" cy="214" r="28" /><path d="M228 118 H254" />`,
    mask: `<path fill="#000" d="M40 146 H200 V88 H262 L308 146 V214 H40 Z" /><circle fill="#000" cx="96" cy="214" r="28" /><circle fill="#000" cx="246" cy="214" r="28" />`
  },
  heart: {
  line: `
    <path d="
      M150 220
      C90 180 60 140 60 100
      C60 70 84 50 114 50
      C132 50 144 58 150 72
      C156 58 168 50 186 50
      C216 50 240 70 240 100
      C240 140 210 180 150 220
      Z
    " />
  `,
  mask: `
    <path fill="#000" d="
      M150 220
      C90 180 60 140 60 100
      C60 70 84 50 114 50
      C132 50 144 58 150 72
      C156 58 168 50 186 50
      C216 50 240 70 240 100
      C240 140 210 180 150 220
      Z
    " />
  `
},
star: {
  line: `
    <path d="M150 70 L172 126 L232 126 L184 162 L202 220 L150 184 L98 220 L116 162 L68 126 L128 126 Z" />
    <circle cx="150" cy="150" r="24" />
  `,
  mask: `
    <path fill="#000" d="M150 70 L172 126 L232 126 L184 162 L202 220 L150 184 L98 220 L116 162 L68 126 L128 126 Z" />
  `
},
flower: {
  line: `
    <circle cx="150" cy="150" r="24" />
    <circle cx="150" cy="96" r="28" />
    <circle cx="204" cy="150" r="28" />
    <circle cx="150" cy="204" r="28" />
    <circle cx="96" cy="150" r="28" />
    <circle cx="112" cy="112" r="24" />
    <circle cx="188" cy="112" r="24" />
    <circle cx="188" cy="188" r="24" />
    <circle cx="112" cy="188" r="24" />
  `,
  mask: `
    <circle fill="#000" cx="150" cy="150" r="24" />
    <circle fill="#000" cx="150" cy="96" r="28" />
    <circle fill="#000" cx="204" cy="150" r="28" />
    <circle fill="#000" cx="150" cy="204" r="28" />
    <circle fill="#000" cx="96" cy="150" r="28" />
  `
}
};

function makePicture(name, pieces) {
  const lineContent = pieces.map(([key, x, y, scale]) => layer(artParts[key].line, x, y, scale)).join("");
  const maskContent = pieces.map(([key, x, y, scale]) => layer(artParts[key].mask, x, y, scale)).join("");
  return {
    id: slug(name),
    name,
    svg: svgPage(fittedLayers(pieces, lineContent)),
    mask: maskPage(fittedLayers(pieces, maskContent))
  };
}

function scene(name, pieces) {
  return makePicture(name, pieces);
}

function makeCategory(id, name, scenes) {
  return { id, name, pictures: scenes };
}

const categories = [
  makeCategory("animals", "Animals", [
    scene("Heart", [["heart", 250, 250, 1.35]]),
    scene("Star", [["star", 250, 250, 1.35]]),
    scene("Flower", [["flower", 250, 250, 1.35]]),
    scene("Dog", [["dog", 250, 250, 1.35]]),
    scene("Rabbit", [["rabbit", 250, 250, 1.35]]),
    scene("Fish", [["fish", 235, 285, 1.35]]),
    scene("Bird", [["bird", 245, 250, 1.35]]),
    scene("Butterfly", [["butterfly", 245, 245, 1.35]]),
    scene("Turtle", [["turtle", 250, 265, 1.3]]),
    scene("Cat", [["cat", 250, 250, 1.35]]),
    scene("Frog", [["frog", 250, 250, 1.35]]),
    scene("Bee", [["bee", 250, 250, 1.35]]),
    scene("Pig", [["pig", 250, 250, 1.35]]),
    scene("Panda", [["panda", 250, 250, 1.35]]),
    // scene("Cat and Fish", [["cat", 120, 230, 1.05], ["fish", 470, 320, 0.95]]),
    // scene("Dog and Ball", [["dog", 120, 225, 1.05], ["ball", 500, 370, 0.8]]),
    // scene("Rabbit Garden", [["rabbit", 105, 255, 0.95], ["flower", 460, 300, 0.85], ["flower", 610, 330, 0.75]]),
    scene("Bird in Tree", [["tree", 130, 185, 1.15], ["bird", 460, 240, 0.82]]),
    // scene("Fish Friends", [["fish", 110, 245, 0.92], ["fish", 405, 335, 0.82], ["fish", 550, 185, 0.72]]),
    // scene("Butterfly Flowers", [["butterfly", 115, 180, 0.92], ["flower", 430, 285, 0.82], ["flower", 570, 330, 0.78]]),
    // scene("Turtle and Sun", [["turtle", 135, 355, 1.0], ["sun", 545, 95, 0.78]]),
    // scene("Cat Moon", [["cat", 130, 275, 1.05], ["moon", 535, 90, 0.75], ["star", 440, 170, 0.36]]),
    scene("Dog House", [["dog", 85, 310, 0.92], ["house", 440, 230, 1.0]]),
    scene("Rabbit and Kite", [["rabbit", 110, 330, 0.92], ["kite", 500, 105, 0.82]]),
    // scene("Bird Cloud", [["bird", 110, 320, 0.95], ["cloud", 430, 125, 1.0], ["sun", 620, 70, 0.48]]),
    // scene("Animal Party", [["cat", 75, 275, 0.82], ["dog", 315, 285, 0.82], ["rabbit", 555, 290, 0.78]]),
    // scene("Pond Day", [["turtle", 120, 375, 0.92], ["fish", 430, 365, 0.82], ["flower", 600, 240, 0.66]])
  ]),
  makeCategory("nature", "Nature", [
    scene("Flower", [["flower", 250, 245, 1.35]]),
    scene("Tree", [["tree", 260, 225, 1.32]]),
    scene("Sun", [["sun", 250, 250, 1.35]]),
    scene("Cloud", [["cloud", 220, 300, 1.42]]),
    scene("Rainbow", [["rainbow", 235, 275, 1.42]]),
    scene("Star", [["star", 255, 255, 1.3]]),
    scene("Moon", [["moon", 260, 235, 1.35]]),
    scene("Sunny Tree", [["tree", 160, 285, 1.0], ["sun", 550, 80, 0.72]]),
    scene("Cloudy Sun", [["sun", 145, 105, 0.78], ["cloud", 345, 240, 1.1]]),
    // scene("Rainbow Clouds", [["rainbow", 230, 205, 1.2], ["cloud", 80, 520, 0.75], ["cloud", 520, 520, 0.75]]),
    // scene("Flower Field", [["flower", 70, 320, 0.78], ["flower", 300, 280, 0.85], ["flower", 530, 330, 0.78]]),
    // scene("Night Sky", [["moon", 140, 125, 0.88], ["star", 430, 110, 0.5], ["star", 600, 260, 0.42], ["cloud", 260, 490, 0.85]]),
    scene("Two Trees", [["tree", 100, 285, 0.96], ["tree", 440, 250, 1.1]]),
    scene("Sun and Flowers", [["sun", 510, 70, 0.72], ["flower", 100, 330, 0.72], ["flower", 300, 300, 0.8], ["flower", 510, 330, 0.72]]),
    scene("Moon and Cloud", [["moon", 155, 115, 0.92], ["cloud", 390, 310, 1.0], ["star", 575, 110, 0.42]]),
    scene("Garden Path", [["tree", 95, 220, 0.95], ["flower", 380, 335, 0.74], ["flower", 545, 350, 0.68], ["sun", 570, 85, 0.58]]),
    scene("Big Rainbow", [["rainbow", 150, 190, 1.7]]),
    // scene("Cloud Trio", [["cloud", 60, 210, 0.82], ["cloud", 300, 150, 0.95], ["cloud", 520, 290, 0.78]]),
    // scene("Star Garden", [["star", 120, 100, 0.55], ["star", 520, 140, 0.45], ["flower", 185, 345, 0.84], ["flower", 455, 335, 0.82]]),
    // scene("Nature Picnic", [["tree", 80, 250, 1.0], ["rainbow", 350, 140, 0.85], ["flower", 550, 360, 0.7], ["sun", 620, 70, 0.52]])
  ]),
  makeCategory("vehicles", "Vehicles", [
    scene("Car", [["car", 240, 300, 1.32]]),
    scene("Bus", [["bus", 235, 285, 1.35]]),
    scene("Rocket", [["rocket", 250, 230, 1.4]]),
    scene("Airplane", [["airplane", 230, 300, 1.38]]),
    scene("Boat", [["boat", 245, 270, 1.35]]),
    scene("Train", [["train", 230, 295, 1.38]]),
    scene("Truck", [["truck", 228, 295, 1.32]]),
    scene("Car and Sun", [["car", 110, 360, 0.98], ["sun", 555, 95, 0.7]]),
    scene("Bus Stop", [["bus", 90, 330, 1.0], ["tree", 520, 260, 0.82]]),
    // scene("Rocket Stars", [["rocket", 120, 220, 1.02], ["star", 455, 120, 0.46], ["moon", 565, 255, 0.55]]),
    // scene("Airplane Cloud", [["airplane", 100, 315, 0.98], ["cloud", 500, 130, 0.82]]),
    scene("Boat and Fish", [["boat", 110, 280, 1.0], ["fish", 490, 455, 0.76]]),
    // scene("Train and Tree", [["train", 90, 365, 0.98], ["tree", 550, 230, 0.82]]),
    // scene("Two Cars", [["car", 70, 340, 0.86], ["car", 430, 390, 0.86]]),
    scene("Rocket Launch", [["rocket", 285, 125, 1.08], ["cloud", 130, 575, 0.72], ["cloud", 470, 585, 0.72]]),
    scene("Harbor Day", [["boat", 95, 320, 0.92], ["sun", 570, 85, 0.58], ["cloud", 420, 205, 0.7]]),
    scene("Airport", [["airplane", 80, 210, 0.86], ["bus", 420, 410, 0.78]]),
    // scene("Train Ride", [["train", 80, 330, 0.92], ["cloud", 470, 105, 0.78], ["sun", 640, 80, 0.48]]),
    // scene("Car House", [["car", 95, 420, 0.86], ["house", 445, 240, 0.92]]),
    // scene("Boat Rainbow", [["boat", 100, 390, 0.86], ["rainbow", 365, 150, 0.86]]),
    // scene("Vehicle Parade", [["car", 40, 420, 0.72], ["bus", 305, 400, 0.72], ["train", 555, 405, 0.72]])
  ]),
  makeCategory("food", "Food", [
    scene("Apple", [["apple", 250, 250, 1.35]]),
    scene("Cake", [["cake", 250, 250, 1.35]]),
    scene("Ice Cream", [["icecream", 250, 250, 1.35]]),
    scene("Pizza", [["pizza", 250, 250, 1.35]]),
    scene("Cupcake", [["cupcake", 250, 250, 1.35]]),
    scene("Apple and Cake", [["apple", 105, 260, 1.0], ["cake", 455, 265, 0.98]]),
    // scene("Ice Cream Party", [["icecream", 70, 280, 0.92], ["icecream", 330, 250, 0.98], ["icecream", 560, 300, 0.84]]),
    // scene("Pizza Slice Duo", [["pizza", 110, 240, 1.0], ["pizza", 455, 300, 0.88]]),
    scene("Cupcake Gift", [["cupcake", 125, 260, 1.0], ["gift", 475, 310, 0.86]]),
    scene("Birthday Snack", [["cake", 95, 260, 0.95], ["cupcake", 395, 300, 0.8], ["gift", 580, 330, 0.7]]),
    // scene("Fruit Star", [["apple", 145, 300, 0.92], ["star", 510, 145, 0.64]]),
    // scene("Dessert Table", [["cake", 60, 315, 0.8], ["cupcake", 320, 325, 0.74], ["icecream", 540, 300, 0.78]]),
    // scene("Picnic Food", [["apple", 80, 320, 0.8], ["pizza", 310, 315, 0.8], ["cupcake", 535, 320, 0.7]]),
    // scene("Cake and Balloons", [["cake", 230, 350, 0.9], ["ball", 80, 95, 0.55], ["ball", 570, 120, 0.5]]),
    scene("Sweet Cloud", [["icecream", 120, 310, 0.9], ["cloud", 455, 130, 0.85]]),
    scene("Apple Tree", [["tree", 125, 220, 1.0], ["apple", 520, 330, 0.75]]),
    // scene("Pizza Picnic", [["pizza", 95, 325, 0.88], ["cloud", 450, 120, 0.75], ["sun", 610, 75, 0.5]]),
    // scene("Cupcake Rainbow", [["cupcake", 115, 345, 0.88], ["rainbow", 380, 155, 0.86]]),
    // scene("Snack Friends", [["apple", 75, 330, 0.74], ["icecream", 300, 315, 0.76], ["pizza", 520, 330, 0.74]]),
    // scene("Party Treats", [["cake", 70, 305, 0.78], ["cupcake", 300, 315, 0.72], ["icecream", 510, 300, 0.72], ["gift", 620, 430, 0.5]])
  ]),
  makeCategory("fun", "Fun", [
    scene("House", [["house", 250, 250, 1.35]]),
    scene("Kite", [["kite", 250, 230, 1.35]]),
    scene("Ball", [["ball", 250, 250, 1.35]]),
    scene("Gift", [["gift", 250, 250, 1.35]]),
    scene("Robot", [["robot", 250, 250, 1.35]]),
    scene("Crown", [["crown", 250, 250, 1.35]]),
    // scene("House Garden", [["house", 110, 270, 1.0], ["flower", 485, 340, 0.72], ["tree", 570, 220, 0.78]]),
    scene("Kite and Sun", [["kite", 120, 120, 0.9], ["sun", 560, 90, 0.66]]),
    scene("Ball and Gift", [["ball", 120, 320, 0.9], ["gift", 470, 310, 0.9]]),
    scene("Robot Star", [["robot", 105, 260, 1.0], ["star", 520, 115, 0.62]]),
    scene("Crown Castle", [["crown", 320, 95, 0.8], ["house", 255, 315, 0.95]]),
    // scene("Gift Party", [["gift", 90, 330, 0.82], ["gift", 330, 300, 0.9], ["gift", 560, 350, 0.74]]),
    // scene("Play Day", [["ball", 80, 350, 0.72], ["kite", 345, 100, 0.78], ["cloud", 520, 260, 0.72]]),
    // scene("Robot House", [["robot", 95, 295, 0.88], ["house", 445, 260, 0.92]]),
    // scene("Royal Gift", [["crown", 115, 170, 0.86], ["gift", 455, 330, 0.9]]),
    // scene("Sunny Home", [["house", 110, 320, 0.95], ["sun", 560, 80, 0.62], ["cloud", 435, 220, 0.68]]),
    // scene("Kite Garden", [["kite", 100, 80, 0.78], ["flower", 420, 330, 0.74], ["flower", 565, 360, 0.66]]),
    // scene("Robot Parade", [["robot", 65, 300, 0.78], ["robot", 325, 280, 0.86], ["robot", 565, 310, 0.72]]),
    // scene("Toy Box", [["ball", 70, 330, 0.68], ["gift", 300, 315, 0.72], ["robot", 520, 285, 0.72]]),
    // scene("Dream Room", [["house", 80, 345, 0.78], ["moon", 430, 100, 0.58], ["star", 590, 150, 0.42], ["gift", 520, 405, 0.58]])
  ])
];

const canvas = document.querySelector("#colorCanvas");
const ctx = canvas.getContext("2d");
const paintCanvas = document.createElement("canvas");
const paintCtx = paintCanvas.getContext("2d");
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d");
const pictureList = document.querySelector("#pictureList");
const palette = document.querySelector("#palette");
const brushSize = document.querySelector("#brushSize");
const brushValue = document.querySelector("#brushValue");
const allPictures = categories.flatMap((category) => category.pictures);

let activePicture = allPictures[0].id;
let activeColor = colors[0];
let activeBrush = Number(brushSize.value);
let drawing = false;
let baseImage = new Image();
let maskImage = new Image();
let maskReady = false;
let undoStack = [];

paintCanvas.width = canvas.width;
paintCanvas.height = canvas.height;
maskCanvas.width = canvas.width;
maskCanvas.height = canvas.height;



function getCurrentPicture() {
  return allPictures.find((picture) => picture.id === activePicture);
}

function renderPictures() {
  pictureList.innerHTML = "";
  allPictures.forEach((picture) => {
    const button = document.createElement("button");
    button.className = "picture-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(picture.id === activePicture));
    button.innerHTML = `<div class="picture-thumb" aria-hidden="true">${picture.svg}</div><span>${picture.name}</span>`;
    button.addEventListener("click", () => {
      activePicture = picture.id;
      undoStack = [];
      renderPictures();
      loadPicture();
    });
    pictureList.append(button);
  });
}

function renderPalette() {
  palette.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "color-swatch";
    button.type = "button";
    button.style.background = color;
    button.setAttribute("aria-label", color === "#ffffff" ? "Use eraser" : `Choose ${color}`);
    button.setAttribute("aria-pressed", String(color === activeColor));
    button.addEventListener("click", () => {
      activeColor = color;
      renderPalette();
    });
    palette.append(button);
  });
}



function snapshot() {
  undoStack.push(paintCtx.getImageData(0, 0, paintCanvas.width, paintCanvas.height));
  if (undoStack.length > 18) {
    undoStack.shift();
  }
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(paintCanvas, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
}

function clearPaint() {
  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function applyPaintMask() {
  if (!maskReady) {
    return;
  }

  paintCtx.save();
  paintCtx.globalCompositeOperation = "destination-in";
  paintCtx.drawImage(maskCanvas, 0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.restore();
}

function loadPicture() {
  const picture = getCurrentPicture();
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(picture.svg)}`;
  const maskUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(picture.mask)}`;
  let loadedImages = 0;

  function finishLoad() {
    loadedImages += 1;
    if (loadedImages < 2) {
      return;
    }

    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.drawImage(maskImage, 0, 0, maskCanvas.width, maskCanvas.height);
    maskReady = true;
    clearPaint();
    drawScene();
  }

  maskReady = false;
  baseImage = new Image();
  maskImage = new Image();
  baseImage.onload = finishLoad;
  maskImage.onload = finishLoad;
  baseImage.src = svgUrl;
  maskImage.src = maskUrl;
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

function startDrawing(event) {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  snapshot();
  drawing = true;
  const point = getCanvasPoint(event);
  paintPoint(point.x, point.y);
  paintCtx.beginPath();
  paintCtx.moveTo(point.x, point.y);
}

function continueDrawing(event) {
  if (!drawing) {
    return;
  }
  event.preventDefault();
  const point = getCanvasPoint(event);
  paintCtx.lineTo(point.x, point.y);
  paintCtx.strokeStyle = activeColor;
  paintCtx.lineWidth = activeBrush;
  paintCtx.lineCap = "round";
  paintCtx.lineJoin = "round";
  paintCtx.globalCompositeOperation = activeColor === "#ffffff" ? "destination-out" : "source-over";
  paintCtx.stroke();
  paintCtx.globalCompositeOperation = "source-over";
  applyPaintMask();
  drawScene();
}

function stopDrawing() {
  drawing = false;
  paintCtx.closePath();
}

function paintPoint(x, y) {
  paintCtx.fillStyle = activeColor;
  paintCtx.globalCompositeOperation = activeColor === "#ffffff" ? "destination-out" : "source-over";
  paintCtx.beginPath();
  paintCtx.arc(x, y, activeBrush / 2, 0, Math.PI * 2);
  paintCtx.fill();
  paintCtx.globalCompositeOperation = "source-over";
  applyPaintMask();
  drawScene();
}

brushSize.addEventListener("input", () => {
  activeBrush = Number(brushSize.value);
  if (brushValue) {
    brushValue.textContent = activeBrush;
  }
});



canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", continueDrawing);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);

renderPictures();
renderPalette();
loadPicture();
