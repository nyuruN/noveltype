<script setup lang="ts">
import Slider from '@/components/widgets/Slider.vue';
import ToggleSwitch from '@/components/widgets/ToggleSwitch.vue';
import { useAnimatedStore } from '@/stores/animated';
import SHADERS, { type Shader } from '@/lib/shaders';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useCacheStore } from '@/stores/cacheStore';

const { enabled, renderFps, renderScale, currentShader } = storeToRefs(useAnimatedStore())

function getCover(shader: Shader) {
    return useCacheStore().shaderCovers.get(shader.name)
}

onMounted(() => {
    useCacheStore().loadShaderCovers()
})
</script>

<template>
    <h1>Animated Backgrounds</h1>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2>General</h2>

        <div class="flex align-center">
            <div class="content-texts grow">
                <div>Enable animated background</div>
                <span>Animates the background using real time shaders</span>
            </div>
            <ToggleSwitch v-model="enabled"></ToggleSwitch>
        </div>
        <div class="flex align-center">
            <div class="content-texts grow">
                <div>Render scale</div>
                <span>Renders the output image at a fraction of viewport size</span>
            </div>
            <span style="margin-right: .5rem;">{{ (renderScale * 100).toFixed(0) }}%</span>
            <Slider :min="0.05" :max="1" :step="0.01" v-model="renderScale" />
        </div>
        <div class="flex align-center">
            <div class="content-texts">
                <div>Render fps</div>
                <span>Limits the frame(s) per second of the shader</span>
            </div>
            <span style="margin-right: .5rem;">{{ (renderFps * 1).toFixed(0) }}fps</span>
            <Slider :min="5" :max="60" :step="1" v-model="renderFps" />
        </div>
    </div>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2 style="margin-bottom: -0.5rem;">Presets</h2>
        <div class="cards flex">
            <div class="card relative" @click="currentShader = { ...shader };" v-for="shader in SHADERS"
                :class="{ selected: currentShader.name == shader.name }">
                <div class="card-check">
                    <font-awesome-icon :icon="['fas', 'check']" fixed-width />
                </div>
                <div class="card-image-container relative">
                    <template v-if="getCover(shader)">
                        <img class="card-image" :src="getCover(shader)"></img>
                    </template>
                    <div class="card-image-fallback" v-else>
                        <font-awesome-icon :icon="['fas', 'brush']" fixed-width class="absolute-center" />
                    </div>
                </div>
                <div class="card-text">{{ shader.name }}</div>
                <a class="card-text" target="_blank" :href="shader.link" style="color: var(--text)">{{ shader.author }}</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-check {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.4rem 0.5rem;
    font-size: 1.3rem;
    border-radius: 8px;
    z-index: 1;
    visibility: hidden;
    color: var(--accent);
    color: var(--ui-card-more-text);
    background-color: var(--ui-card-more-bg);
}

.card.selected .card-check {
    visibility: inherit;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.card-image-fallback {
    background-color: hsl(0 0 55);
    width: 100%;
    height: 100%;
}

.card-image-container {
    color: hsl(0 0 90);
    height: 80%;
    border-radius: 8px;
    font-size: 8rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
}

.card-text {
    text-align: center;
    display: inline-block;
    text-decoration: none;
    width: 100%;
}

a.card-text:hover {
    text-decoration: underline;
}


.card {
    height: 16rem;
    width: 14rem;
    padding: 0.5rem;
    background-color: var(--ui-card);
    color: var(--text-dimmed);
    border: none;
    border-radius: 8px;
    overflow: hidden;

    transition: var(--ui-bg-transition);
}

.card:hover {
    background-color: var(--ui-card-hover);
    cursor: pointer;
}

.cards {
    flex-wrap: wrap;
    gap: 1rem;
}
</style>