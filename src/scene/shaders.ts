// GLSL shared by the space scene. Kept small so it runs comfortably on phones.

export const noiseGLSL = /* glsl */ `
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
        mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
        mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return v;
}
`;

/* ---------- Nebula: full-screen background ---------- */

export const nebulaVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

export const nebulaFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uStage;
uniform float uAspect;
uniform vec2 uLook;
varying vec2 vUv;
${noiseGLSL}
void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uAspect;
  vec2 p = uv * 1.5 + uLook;
  float z = uStage * 0.32 + uTime * 0.008;

  vec3 q = vec3(p * 1.15, z);
  float n1 = fbm(q);
  float n2 = fbm(q * 1.9 + vec3(n1 * 1.6, n1, 4.0));
  float cloud = smoothstep(0.38, 0.98, n2);

  vec3 base = vec3(0.010, 0.012, 0.030);
  vec3 blue = vec3(0.10, 0.22, 0.62);
  vec3 violet = vec3(0.32, 0.17, 0.58);
  vec3 gold = vec3(0.78, 0.50, 0.20);
  float warm = smoothstep(3.2, 5.4, uStage);
  vec3 tint = mix(blue, violet, smoothstep(0.3, 0.7, n1));
  tint = mix(tint, gold, warm * 0.4 * smoothstep(0.45, 0.8, n1));

  float vign = 1.0 - smoothstep(0.25, 1.15, length(uv));
  vec3 col = base + tint * cloud * (0.30 + 0.30 * vign);

  // Faint galactic band
  float bandY = uv.y + uv.x * 0.28 - 0.05;
  float band = exp(-bandY * bandY * 7.0) * fbm(vec3(p * 3.2, z * 0.6));
  col += vec3(0.30, 0.34, 0.58) * band * 0.16;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---------- Stars ---------- */

export const starVertex = /* glsl */ `
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uTwinkle;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  float tw = mix(1.0, 0.65 + 0.35 * sin(uTime * (0.5 + aSeed * 2.2) + aSeed * 50.0), uTwinkle);
  gl_PointSize = clamp(aSize * uPixelRatio * (70.0 / max(depth, 0.1)), 0.0, 10.0 * uPixelRatio);
  vAlpha = tw * smoothstep(1.0, 8.0, depth) * (1.0 - smoothstep(260.0, 420.0, depth));
  vColor = aColor;
}
`;

export const starFragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

/* ---------- Warp streaks ---------- */

export const streakVertex = /* glsl */ `
attribute float aEnd;
uniform float uStretch;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.z -= aEnd * uStretch;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  vAlpha = (1.0 - aEnd) * smoothstep(2.0, 12.0, depth) * (1.0 - smoothstep(120.0, 220.0, depth));
}
`;

export const streakFragment = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying float vAlpha;
void main() {
  gl_FragColor = vec4(0.72, 0.82, 1.0, vAlpha * uOpacity);
}
`;

/* ---------- Planets ---------- */
// Lighting is done in linear space with a single sun, so planets get a real
// day side, a soft terminator and a dark night side.

export const planetVertex = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vWorldPos;
varying vec2 vUv;
void main() {
  vPos = position;
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const planetFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;        // fallback surface colours until the photo loads
uniform vec3 uDeep;
uniform vec3 uLightPos;     // direction towards the sun
uniform float uTime;
uniform float uHighlight;
uniform float uFade;
uniform float uBandScale;
uniform sampler2D uMap;
uniform float uMapMix;
uniform float uMapMode;     // 1 = Earth: uMap is the night-lights map
uniform sampler2D uDayMap;  // Earth day map (optional)
uniform float uDayMix;
// Ring shadow (Saturn)
uniform float uRing;
uniform vec3 uRingCenter;
uniform vec3 uRingNormal;
uniform float uRingInner;
uniform float uRingOuter;
uniform sampler2D uRingMap;
uniform float uRingMapMix;
varying vec3 vPos;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vWorldPos;
varying vec2 vUv;
${noiseGLSL}
vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec3 n = normalize(vNormalW);
  vec3 p = normalize(vPos);
  vec3 l = normalize(uLightPos);
  float ndl = dot(n, l);

  // Fallback banded surface, replaced by the photo texture once it loads
  float warp = fbm(p * 2.6);
  float bands = fbm(vec3(p.x * 1.4, p.y * uBandScale + warp * 1.8, p.z * 1.4));
  vec3 albedo = toLinear(mix(uDeep, uColor, smoothstep(0.25, 0.85, bands)));
  vec3 emissive = vec3(0.0);

  if (uMapMix > 0.001) {
    vec3 tex = toLinear(texture2D(uMap, vUv).rgb);
    vec3 texAlbedo = tex;
    if (uMapMode > 0.5) {
      vec3 day = toLinear(texture2D(uDayMap, vUv).rgb);
      texAlbedo = mix(albedo, day, uDayMix);
      // City lights only show on the night side
      float night = smoothstep(0.12, -0.2, ndl);
      emissive = tex * night * 2.2 * uMapMix;
    }
    albedo = mix(albedo, texAlbedo, uMapMix);
  }

  // Shadow of Saturn's rings on the planet
  float shadow = 1.0;
  if (uRing > 0.5) {
    float denom = dot(l, uRingNormal);
    if (abs(denom) > 0.0001) {
      float tHit = dot(uRingCenter - vWorldPos, uRingNormal) / denom;
      if (tHit > 0.0) {
        float r = length(vWorldPos + l * tHit - uRingCenter);
        if (r > uRingInner && r < uRingOuter) {
          float rt = (r - uRingInner) / (uRingOuter - uRingInner);
          float a = mix(0.6, texture2D(uRingMap, vec2(rt, 0.5)).a, uRingMapMix);
          shadow = 1.0 - a * 0.8;
        }
      }
    }
  }

  float diff = clamp((ndl + 0.03) / 1.03, 0.0, 1.0);
  vec3 lin = albedo * (diff * 1.25 * shadow + 0.008) + emissive;
  lin *= 1.0 + uHighlight * 0.3;
  gl_FragColor = vec4(pow(lin, vec3(1.0 / 2.2)), uFade);
}
`;

/* ---------- Earth clouds ---------- */

export const cloudFragment = /* glsl */ `
precision mediump float;
uniform sampler2D uMap;
uniform vec3 uLightPos;
uniform float uOpacity;
varying vec3 vNormalW;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vViewDir;
varying vec3 vWorldPos;
void main() {
  float c = smoothstep(0.12, 0.85, texture2D(uMap, vUv).r);
  float diff = clamp((dot(normalize(vNormalW), normalize(uLightPos)) + 0.03) / 1.03, 0.0, 1.0);
  gl_FragColor = vec4(vec3(diff * 1.1), c * uOpacity);
}
`;

/* ---------- Rings ---------- */

export const ringVertex = /* glsl */ `
varying vec2 vLocal;
varying vec3 vWorldPos;
void main() {
  vLocal = position.xy;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const ringFragment = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform float uInner;
uniform float uOuter;
uniform float uOpacity;
uniform sampler2D uMap;
uniform float uMapMix;
uniform vec3 uLightPos;
uniform vec3 uPlanetCenter;
uniform float uPlanetRadius;
varying vec2 vLocal;
varying vec3 vWorldPos;
void main() {
  float r = length(vLocal);
  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  float bands = 0.55 + 0.45 * sin(t * 46.0) * sin(t * 13.0 + 1.3);
  vec3 col = uColor;
  float a = bands * smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.85, 1.0, t)) * 0.6;
  if (uMapMix > 0.001) {
    vec4 tex = texture2D(uMap, vec2(t, 0.5));
    col = mix(col, tex.rgb, uMapMix);
    a = mix(a, tex.a, uMapMix);
  }

  // The planet casts its shadow across the rings
  vec3 l = normalize(uLightPos);
  vec3 oc = vWorldPos - uPlanetCenter;
  float b = dot(oc, l);
  float h = b * b - (dot(oc, oc) - uPlanetRadius * uPlanetRadius);
  float shadow = (b < 0.0 && h > 0.0) ? 0.06 : 1.0;

  vec3 lin = pow(col, vec3(2.2)) * (1.05 * shadow + 0.01);
  gl_FragColor = vec4(pow(lin, vec3(1.0 / 2.2)), a * uOpacity);
}
`;

/* ---------- Core glow (billboard) ---------- */

export const glowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const glowFragment = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uHot;
uniform float uIntensity;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 c = vUv - 0.5;
  float d = length(c);
  float core = exp(-d * d * 260.0);
  float halo = exp(-d * d * 30.0) * 0.4;
  float ang = atan(c.y, c.x);
  float rays = pow(abs(sin(ang * 2.0 + uTime * 0.05)), 40.0) * exp(-d * 7.0) * 0.5;
  rays += pow(abs(cos(ang * 2.0 - uTime * 0.04)), 60.0) * exp(-d * 9.0) * 0.35;
  vec3 col = uHot * core + uColor * (halo + rays);
  float a = (core + halo + rays) * uIntensity;
  gl_FragColor = vec4(col * uIntensity, clamp(a, 0.0, 1.0));
}
`;

/* ---------- Sky (Milky Way) ---------- */

export const skyVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const skyFragment = /* glsl */ `
precision mediump float;
uniform sampler2D uMap;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec3 tex = texture2D(uMap, vUv).rgb;
  gl_FragColor = vec4(tex * vec3(0.85, 0.9, 1.1), uOpacity);
}
`;
