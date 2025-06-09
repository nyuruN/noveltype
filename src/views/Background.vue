<script setup lang="ts">
import { ShaderToy } from '@/lib/shadertoy';
import { useAnimatedStore } from '@/stores/animated';
import { storeToRefs } from 'pinia';
import * as THREE from 'three'
import { onMounted, watch } from 'vue';

const { enabled, renderScale, renderFps, uniforms, currentShader } = storeToRefs(useAnimatedStore())

let renderer = undefined as undefined | THREE.WebGLRenderer
let shaderToy = new ShaderToy(currentShader.value)

let previousCanvasSize = [0, 0]
let previousRenderScale = renderScale.value

function animate(time: number) {
    // On disable
    if (!enabled.value) return
    setTimeout(() => requestAnimationFrame(animate), 1000 / renderFps.value);
    // Shouldn't happen?
    if (!renderer) return

    const canvas = renderer.domElement
    {
        if (canvas.clientWidth !== previousCanvasSize[0]
            || canvas.clientHeight !== previousCanvasSize[1]
            || renderScale.value !== previousRenderScale) {
            renderer.setSize(canvas.clientWidth * renderScale.value, canvas.clientHeight * renderScale.value, false);
            console.log('resize')
        }
        previousCanvasSize = [canvas.clientWidth, canvas.clientHeight]
        previousRenderScale = renderScale.value;
    }

    uniforms.value.iResolution.value.set(canvas.width, canvas.height, 1)
    uniforms.value.iTime.value = time * 0.001 // in seconds

    shaderToy.render(renderer)
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
watch(currentShader, ne => {
    shaderToy = new ShaderToy(ne)
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