<script setup lang="ts">
import { type Color, hexToHsl, hslToHex } from '@/lib/color';
import { ref, watch } from 'vue';

let props = defineProps<{ label: string, resetColor: Color }>()
let color = defineModel<Color>({ required: true })

let inputValue = ref(hslToHex(props.resetColor))

let isOwnEvent = false
watch(color, (val) => {
    if (!isOwnEvent) {
        inputValue.value = hslToHex(val)
    }
    isOwnEvent = false
})

function reset() {
    color.value = { ...props.resetColor }
    inputValue.value = hslToHex(props.resetColor)
}
function refresh() {
    color.value = hexToHsl(inputValue.value)
    isOwnEvent = true
}

let inputText = ref('')
function userInput() {
    // Test for valid hex color
    if (/^#(?:[0-9a-fA-F]{3,4}){1,2}$/.exec(inputText.value)) {
        color.value = hexToHsl(inputText.value)
    }

    inputText.value = ''
}
</script>

<template>
    <div class="flex relative" style="align-items: stretch; gap: .5rem;">
        <input type="color" class="color-input" v-model="inputValue" @input="refresh" />
        <input type="text" class="button text-input" :name="props.label" :placeholder="inputValue" v-model="inputText"
            @change="userInput" onfocus="this.select()" />
        <button class="button icon-btn" @click="reset">
            <font-awesome-icon :icon="['fas', 'rotate-left']" fixed-width />
        </button>
        <span class="label">{{ props.label }}</span>
    </div>
</template>

<style scoped>
.color-input:focus,
.color-input:hover {
    border-color: var(--ui-border-active);
}

.color-input {
    background-color: var(--ui-button-bg);
    aspect-ratio: 1 / 1;
    height: 2.5rem;
    width: auto;
    border: none;
    border-radius: 4px;
    border: 1px solid var(--ui-border);
    padding: 0.1rem;
    cursor: pointer;

    transition: var(--ui-border-transition);
}

.label {
    position: absolute;
    left: 104%;
    align-self: center;
    overflow: hidden;
    text-wrap: nowrap;
}

.text-input {
    min-width: 0;
    /* padding: 0.5rem; */
}

.text-input::placeholder {
    outline: none;
    color: var(--ui-button-text);
}

.text-input:focus {
    color: var(--text);
}
</style>
