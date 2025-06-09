<script setup lang="ts">
import { useAnimatedStore } from '@/stores/animated';
import { storeToRefs } from 'pinia';
import * as THREE from 'three'
import { onMounted, ref, watch } from 'vue';

const { enabled } = storeToRefs(useAnimatedStore())
const renderScale = ref(0.1);
const renderFps = ref(24);

let uniforms = {
    iMouse: { value: new THREE.Vector4(0) },
    iResolution: { value: new THREE.Vector3(0, 0, 0) },
    iTime: { value: 0 },
}
const mat = new THREE.ShaderMaterial({
    fragmentShader: `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
        ` + `
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
    ` + `
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`,
    uniforms,
})

let renderer = undefined as undefined | THREE.WebGLRenderer

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1)

const quadGeo = new THREE.PlaneGeometry(2, 2)
const quad = new THREE.Mesh(quadGeo, mat)

camera.position.z = 1;

scene.add(quad)

let previousCanvasSize = [0, 0]
function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const needResize = canvas.clientWidth !== previousCanvasSize[0] || canvas.clientHeight !== previousCanvasSize[1];
    previousCanvasSize = [canvas.clientWidth, canvas.clientHeight]

    if (needResize) {
        console.log('resize')
        renderer.setSize(canvas.clientWidth * renderScale.value, canvas.clientHeight * renderScale.value, false);
    }
    return needResize;
}

function animate(time: number) {
    console.log('render')
    if (!enabled.value || !renderer) return

    setTimeout(() => requestAnimationFrame(animate), 1000 / renderFps.value);

    const canvas = renderer.domElement
    resizeRendererToDisplaySize(renderer)

    uniforms.iResolution.value.set(canvas.width, canvas.height, 1)
    uniforms.iTime.value = time * 0.001 // in seconds

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
        <!-- <div id="bg"></div> -->
        <canvas id="c" v-show="enabled"></canvas>
    </div>
</template>

<style scoped>
/* #bg, */
#c {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>