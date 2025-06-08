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
    border: 0;
    border-radius: 1rem;
    border: 1px solid var(--ui-border);
    max-width: 100%;
    width: 12rem;
    height: 1.1rem;

    transition: var(--ui-border-transition);
}

.slider:hover,
.slider:focus-visible {
    outline: none;
    border-color: var(--ui-border-active);
    cursor: pointer;
}

/* Webkit */
@media screen and (-webkit-min-device-pixel-ratio:0) {

    /* This is picked up by Firefox */
    .slider {
        overflow: hidden;
        background-color: var(--ui-slider-bg);
    }

    .slider::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        color: var(--ui-slider-bg);
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1.0rem;
        height: 1.0rem;
        cursor: ew-resize;
        background: var(--ui-slider-thumb);
        box-shadow: -340px 0 0 330px var(--ui-slider-active), inset 0 0 0 1px var(--ui-slider-active);
        border-radius: 50%;
        position: relative;
    }
}

.slider::-moz-range-progress {
    background-color: var(--ui-slider-active);
    height: 1.0rem;
}

.slider::-moz-range-thumb {
    background-color: var(--ui-slider-thumb);
    border-radius: 1rem;
    border: 1px solid var(--ui-slider-active);
}
</style>
