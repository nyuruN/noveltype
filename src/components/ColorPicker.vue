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
    <div class="flex" style="align-items: stretch; gap: .5rem;">
        <input type="color" class="color-input" v-model="inputValue" @input="refresh" />
        <input type="text" class="text-input button" :name="props.label" :placeholder="inputValue" style="overflow: auto"
            v-model="inputText" @change="userInput" onfocus="this.select()" />
        <button class="button" style="width: auto; padding: 0.5rem;" @click="reset">
            <font-awesome-icon :icon="['fas', 'rotate-left']" fixed-width />
        </button>
        <span style="align-self: center; overflow: hidden; text-wrap: nowrap;">{{ props.label }}</span>
    </div>
</template>

<style scoped>
.text-input::placeholder {
    color: var(--ui-button-text);
}

.text-input:focus {
    outline-style: solid;
    outline-width: 1px;
    outline-color: var(--ui-border-active);
    outline-offset: -2px;
    color: var(--text);
}

.color-input:focus {
    outline-style: solid;
    outline-width: 1px;
    outline-color: var(--ui-border-active);
    outline-offset: -2px;
}

.color-input:hover {
    background-color: var(--ui-button-hover);
}

.color-input {
    background-color: var(--ui-button-bg);
    aspect-ratio: 1 / 1;
    height: 38px;
    width: auto;
    border: none;
    border-radius: 4px;
    padding: 0.1rem;
    cursor: pointer;
}

.button {
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.2em;
    border-radius: 4px;
    width: 10rem;
    cursor: pointer;
    background-color: var(--ui-button-bg);
    color: var(--ui-button-text);
}

.button:hover {
    background-color: var(--ui-button-hover);
}
</style>