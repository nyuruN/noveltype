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
        <input type="text" id="color-text" class="text-input button" :placeholder="inputValue" style="overflow: auto"
            v-model="inputText" @change="userInput" onfocus="this.select()" />
        <button class="button" style="width: auto; padding: 0.5rem;" @click="reset">
            <font-awesome-icon :icon="['fas', 'rotate-left']" fixed-width />
        </button>
        <span style="align-self: center; overflow: hidden; text-wrap: nowrap;">{{ props.label }}</span>
    </div>
</template>

<style scoped>
.text-input::placeholder {
    color: var(--text-dimmed);
}

.text-input:focus {
    outline-style: solid;
    outline-width: 1px;
    outline-color: var(--accent);
    outline-offset: -1px;
    color: var(--text);
}

.color-input:focus {
    outline-style: solid;
    outline-width: 1px;
    outline-color: var(--accent);
    outline-offset: -1px;
}

.color-input {
    background-color: var(--primary-dark);
    border: none;
    border-radius: 4px;
    min-width: 2.35rem;
    height: auto;
    padding: 0.1rem;
    cursor: pointer;
}

.button {
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.2em;
    border-radius: 4px;
    width: 16rem;
    cursor: pointer;
    background-color: var(--primary-dark);
    color: var(--text-dimmed);
}

.button:hover {
    background-color: var(--primary-light);
}
</style>