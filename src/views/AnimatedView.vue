<script setup lang="ts">
import Slider from '@/components/widgets/Slider.vue';
import ToggleSwitch from '@/components/widgets/ToggleSwitch.vue';
import { useAnimatedStore } from '@/stores/animated';
import { storeToRefs } from 'pinia';

const { enabled, renderFps, renderScale } = storeToRefs(useAnimatedStore()) 
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
            <span style="margin-right: .5rem;">{{ renderScale * 100 }}%</span>
            <Slider :min="0.05" :max="1" :step="0.01" v-model="renderScale" />
        </div>
        <div class="flex">
            <div class="content-texts">
                <div>Render fps</div>
                <span>Limits the frame(s) per second of the shader</span>
            </div>
            <span style="margin-right: .5rem;">{{ renderFps }}fps</span>
            <Slider :min="5" :max="60" :step="1" v-model="renderFps" />
        </div>
    </div>
</template>

<style scoped></style>