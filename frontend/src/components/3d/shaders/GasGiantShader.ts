import * as THREE from 'three';
import { GLSL_NOISE } from './glslNoise';

export const GasGiantShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#38BDF8') },
    uColorB: { value: new THREE.Color('#0369A1') },
    uColorC: { value: new THREE.Color('#082F49') },
    uAtmosphereRim: { value: new THREE.Color('#7DD3FC') },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uAtmosphereRim;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    ${GLSL_NOISE}

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Latitudinal jet stream banding (horizontal bands)
      float lat = vWorldPosition.y * 1.8;
      // Differential zonal rotation (jet streams moving in alternating directions based on latitude)
      float jetDirection = sin(lat * 3.14159);
      float jetShift = jetDirection * uTime * 0.18;

      vec3 samplePos = vec3(vWorldPosition.x + jetShift, vWorldPosition.y, vWorldPosition.z) * 0.7;

      // Domain-warped FBM creates swirling storm eddies
      float warp = domainWarpFbm(samplePos, uTime * 0.15);

      // Latitudinal band oscillation
      float band = sin(lat * 8.0 + warp * 4.0) * 0.5 + 0.5;

      // Color mapping across cloud decks
      vec3 cloudDeck = mix(uColorC, uColorB, band);
      cloudDeck = mix(cloudDeck, uColorA, smoothstep(0.4, 0.85, warp));

      // Directional light from central sun (at origin)
      vec3 lightDir = normalize(-vWorldPosition);
      float diffuse = max(0.08, dot(normal, lightDir));

      // Atmosphere Fresnel rim
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.8);

      vec3 finalColor = cloudDeck * diffuse + uAtmosphereRim * fresnel * 0.45;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
