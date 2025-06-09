<script setup lang="ts">
import { useAnimatedStore } from '@/stores/animated';
import { storeToRefs } from 'pinia';
import * as THREE from 'three'
import { onMounted, watch } from 'vue';

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
const SHADERTOY_SHADER = `
// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
 
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    // col = vec3(step(0.5, length(uv - vec2(0.5))));
 
    // Output to screen
    fragColor = vec4(col,1.0);
}
` as const;

const { enabled, renderScale, renderFps, uniforms } = storeToRefs(useAnimatedStore())

let renderer = undefined as undefined | THREE.WebGLRenderer

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1)
camera.position.z = 1;

const quadGeo = new THREE.PlaneGeometry(2, 2)
const quadMat = new THREE.ShaderMaterial({
    fragmentShader: UNIFORM_DEFS + SHADERTOY_SHADER + GLSL_MAIN,
    uniforms: uniforms.value,
})
const quad = new THREE.Mesh(quadGeo, quadMat)

scene.add(quad)

let previousCanvasSize = [0, 0]
let previousRenderScale = renderScale.value
function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const needResize = canvas.clientWidth !== previousCanvasSize[0] || canvas.clientHeight !== previousCanvasSize[1] || renderScale.value !== previousRenderScale;
    previousCanvasSize = [canvas.clientWidth, canvas.clientHeight]
    previousRenderScale = renderScale.value;

    if (needResize) {
        renderer.setSize(canvas.clientWidth * renderScale.value, canvas.clientHeight * renderScale.value, false);
    }
    return needResize;
}

function animate(time: number) {
    if (!enabled.value) return
    setTimeout(() => requestAnimationFrame(animate), 1000 / renderFps.value);
    if (!renderer) return

    const canvas = renderer.domElement
    resizeRendererToDisplaySize(renderer)

    uniforms.value.iResolution.value.set(canvas.width, canvas.height, 1)
    uniforms.value.iTime.value = time * 0.001 // in seconds

    renderer.render(scene, camera)
}

onMounted(() => {
    const canvas = document.getElementById('c') as HTMLCanvasElement
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        // antialias: false,
    })

    if (enabled.value) animate(0)
})

watch(enabled, ne => {
    if (ne) animate(0)
})
</script>

<template>
    <div>
        <canvas id="c" v-show="enabled" />
    </div>
</template>

<style scoped>
#c {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>