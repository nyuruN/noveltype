<script setup lang="ts">
import Slider from '@/components/widgets/Slider.vue';
import ToggleSwitch from '@/components/widgets/ToggleSwitch.vue';
import { useAnimatedStore, SHADERS } from '@/stores/animated';
import { storeToRefs } from 'pinia';

const { enabled, renderFps, renderScale, currentShader } = storeToRefs(useAnimatedStore()) 
</script>

<template>
    <h1>Animated Backgrounds</h1>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2>General</h2>

        <div class="flex">
            <div class="content-texts grow align-center">
                <div>Enable animated background</div>
                <span>Animates the background using real time shaders</span>
            </div>
            <ToggleSwitch v-model="enabled"></ToggleSwitch>
        </div>
        <div class="flex">
            <div class="content-texts grow align-center">
                <div>Render scale</div>
                <span>Renders the output image at a fraction of viewport size</span>
            </div>
            <span style="margin-right: .5rem;">{{ (renderScale * 100).toFixed(0) }}%</span>
            <Slider :min="0.05" :max="1" :step="0.01" v-model="renderScale" />
        </div>
        <div class="flex">
            <div class="content-texts">
                <div>Render fps</div>
                <span>Limits the frame(s) per second of the shader</span>
            </div>
            <span style="margin-right: .5rem;">{{ renderFps.toFixed(0) }}fps</span>
            <Slider :min="5" :max="60" :step="1" v-model="renderFps" />
        </div>
    </div>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2 style="margin-bottom: -0.5rem;">Presets</h2>
        <div class="cards flex">
            <div class="card relative" @click="currentShader = { ...shader };" v-for="shader in SHADERS">
                <div class="card-image relative">
                    <font-awesome-icon :icon="['fas', 'brush']" fixed-width class="absolute-center" />
                </div>
                <div class="card-text">{{ shader.name }}</div>
                <div class="card-text" style="color: var(--text)">{{ shader.author }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-image {
    background-color: hsl(0 0 55);
    color: hsl(0 0 90);
    height: 80%;
    border-radius: 8px;
    font-size: 8rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
}

.card-text {
    text-align: center;
    width: 100%;
}

.card {
    height: 16rem;
    width: 14rem;
    padding: 0.5rem;
    background-color: var(--ui-card);
    color: var(--text-dimmed);
    border: none;
    border-radius: 12px;
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