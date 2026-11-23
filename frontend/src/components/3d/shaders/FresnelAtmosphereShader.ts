import * as THREE from 'three';

export const FresnelAtmosphereShader = {
  uniforms: {
    uColor: { value: new THREE.Color('#38BDF8') },
    uPower: { value: 3.5 },
    uIntensity: { value: 1.2 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uPower;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), uPower);
      gl_FragColor = vec4(uColor, fresnel * uIntensity);
    }
  `,
};
