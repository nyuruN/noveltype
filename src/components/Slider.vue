<script setup lang="ts">
const props = defineProps<{ min: number, max: number, step: number }>()
const model = defineModel()
</script>

<template>
    <input type="range" :min="props.min" :max="props.max" :step="props.step" v-model="model" class="slider" />
</template>

<style>
.slider {
    appearance: none;
    -webkit-appearance: none;
    outline: 0;
    border: 0;
    border-radius: 1rem;
    max-width: 100%;
    width: 12rem;
    height: 1rem;

    margin: 12px 0 0;
}

/* Webkit */
@media screen and (-webkit-min-device-pixel-ratio:0) {
    .slider {
        overflow: hidden;
        background-color: #ddd;
    }

    .slider::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        color: #444;
    }

    .slider::-webkit-slider-thumb {
        width: 1.1rem;
        height: 1.1rem;
        -webkit-appearance: none;
        cursor: ew-resize;
        background: #fff;
        box-shadow: -340px 0 0 330px var(--accent), inset 0 0 0 2px var(--accent);
        border-radius: 50%;
        position: relative;
    }
}

.slider::-moz-range-progress {
    background-color: var(--accent);
}

.slider::-moz-range-track {
    color: #ddd;
}
</style>