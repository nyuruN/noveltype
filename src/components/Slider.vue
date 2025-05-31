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
        background-color: var(--ui-slider-bg);
    }

    .slider::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        color: var(--ui-slider-bg);
    }

    .slider::-webkit-slider-thumb {
        width: 1.0rem;
        height: 1.0rem;
        -webkit-appearance: none;
        cursor: ew-resize;
        background: var(--ui-slider-thumb);
        box-shadow: -340px 0 0 330px var(--ui-slider-active), inset 0 0 0 2px var(--ui-slider-active);
        border-radius: 50%;
        position: relative;
    }
}

.slider::-moz-range-progress {
    background-color: var(--ui-slider-active);
}

.slider::-moz-range-track {
    color: var(--ui-slider-bg);
}
</style>