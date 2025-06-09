import { useAnimatedStore, type Shader } from '@/stores/animated';
import * as THREE from 'three'

const UNIFORM_DEFS = `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
` as const;
const GLSL_MAIN = `
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
` as const;

export class ShaderToy {
    constructor(shader: Shader) {
        this.shader = { ...shader }

        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1)
        this.camera.position.z = 1;

        const quadGeo = new THREE.PlaneGeometry(2, 2)
        const quadMat = new THREE.ShaderMaterial({
            fragmentShader: UNIFORM_DEFS + shader.src + GLSL_MAIN,
            uniforms: useAnimatedStore().uniforms,
        })
        const quad = new THREE.Mesh(quadGeo, quadMat)

        this.scene.add(quad)
    }

    shader: Shader
    scene: THREE.Scene
    camera: THREE.Camera

    render(renderer: THREE.WebGLRenderer) {
        renderer.render(this.scene, this.camera)
    }
}
