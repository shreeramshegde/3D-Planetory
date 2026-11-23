import * as THREE from 'three';
import { GLSL_NOISE } from './glslNoise';

export const LavaCrustShader = {
  uniforms: {
    uTime: { value: 0 },
    uCrustColor: { value: new THREE.Color('#141014') },
    uMagmaCore: { value: new THREE.Color('#FF4500') },
    uMagmaHot: { value: new THREE.Color('#FFAA33') },
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
    uniform vec3 uCrustColor;
    uniform vec3 uMagmaCore;
    uniform vec3 uMagmaHot;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    ${GLSL_NOISE}

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Procedural tectonic fissures using sharp noise gradient
      vec3 p = vWorldPosition * 0.9;
      float tectonicNoise = fbm3(p + vec3(uTime * 0.02, 0.0, 0.0));
      float crackPattern = abs(snoise(p * 2.2 + tectonicNoise * 0.8));

      // Thresholding creates distinct continental plates vs fissure trenches
      float magmaIntensity = 1.0 - smoothstep(0.0, 0.22, crackPattern);

      // Magma pulse and convection surge
      float surge = sin(uTime * 1.5 + tectonicNoise * 6.0) * 0.3 + 0.7;
      magmaIntensity *= surge;

      vec3 magmaColor = mix(uMagmaCore, uMagmaHot, smoothstep(0.4, 1.0, magmaIntensity));

      // Sun lighting for cold crust plates
      vec3 lightDir = normalize(-vWorldPosition);
      float diffuse = max(0.06, dot(normal, lightDir));

      vec3 surfaceColor = mix(uCrustColor * diffuse, magmaColor * 1.6, magmaIntensity);

      // Subtle atmospheric rim
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
      surfaceColor += uMagmaCore * fresnel * 0.3;

      gl_FragColor = vec4(surfaceColor, 1.0);
    }
  `,
};
