import * as THREE from 'three';
import { GLSL_NOISE } from './glslNoise';

export const SunShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#FFF6DE') },
    uColorMid: { value: new THREE.Color('#FF7A18') },
    uColorRim: { value: new THREE.Color('#8C2000') },
    uLimbCoeffs: { value: new THREE.Vector2(0.42, 0.38) }, // u and v in I(mu) = 1 - u(1-mu) - v(1-mu)^2
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorRim;
    uniform vec2 uLimbCoeffs;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    ${GLSL_NOISE}

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // mu = cos(theta) = N . V
      float mu = max(0.0, dot(normal, viewDir));

      // Physical Solar Limb Darkening: I(mu) / I(1) = 1 - u*(1 - mu) - v*(1 - mu)^2
      float oneMinusMu = 1.0 - mu;
      float limbDarkening = 1.0 - uLimbCoeffs.x * oneMinusMu - uLimbCoeffs.y * (oneMinusMu * oneMinusMu);
      limbDarkening = clamp(limbDarkening, 0.12, 1.0);

      // Convection granulation cells moving over time
      vec3 p = vWorldPosition * 0.45;
      float granules = domainWarpFbm(p, uTime * 0.4);
      float cellNoise = fbm3(p * 2.5 + vec3(uTime * 0.08, 0.0, uTime * 0.05));

      // Layered solar emission
      float heat = clamp(0.55 + 0.45 * granules + 0.2 * cellNoise, 0.0, 1.0);

      // Color gradient from rim to mid to core
      vec3 surfaceColor = mix(uColorRim, uColorMid, smoothstep(0.15, 0.7, heat));
      surfaceColor = mix(surfaceColor, uColorCore, smoothstep(0.65, 1.0, heat));

      // Apply limb darkening
      vec3 finalColor = surfaceColor * limbDarkening;

      // Subtle coronal edge flare
      float rimFlare = pow(1.0 - mu, 3.2);
      finalColor += uColorMid * rimFlare * 0.6;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
