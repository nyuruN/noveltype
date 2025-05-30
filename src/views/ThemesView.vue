<script setup lang="ts">
import ThemePreview from '@/components/ThemePreview.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import { hslString } from '@/lib/color';
import { useThemeStore, Themes } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { theme } = storeToRefs(useThemeStore())

let preview = ref({ ...theme.value })

function applyTheme() {
    let newTheme = {
        ...preview.value
    }
    newTheme.name = 'Custom'
    theme.value = newTheme
}

</script>

<template>
    <h1>Themes</h1>

    <h2>Preview</h2>
    <div id="preview-container" class="flex" style="height: 20rem; align-items: stretch;">
        <ThemePreview v-model="preview" />
        <div id="preview-options" class="grow flex-col">
            <div class="flex-col" style="gap: 0.5rem">
                <ColorPicker v-model="preview.primaryColor" :reset-color="theme.primaryColor" label="Primary Color">
                </ColorPicker>
                <ColorPicker v-model="preview.accentColor" :reset-color="theme.accentColor" label="Accent Color">
                </ColorPicker>
                <ColorPicker v-model="preview.textColor" :reset-color="theme.textColor" label="Text Color">
                </ColorPicker>
                <ColorPicker v-model="preview.textDimmedColor" :reset-color="theme.textDimmedColor"
                    label="Text Dimmed Color"></ColorPicker>
            </div>
            <!-- <input type="range" min="1" max="100" value="50" class="slider" id="myRange"> -->
            <button class="button" @click="applyTheme">
                Apply
            </button>
        </div>
    </div>

    <h2>Color Presets</h2>
    <div class="container flex" style="margin-top: 2rem;">
        <template v-for="(theme) in Themes">
            <button style="cursor: pointer;" class="button"
                :style="{ backgroundColor: hslString(theme.primaryColor), color: hslString(theme.accentColor) }"
                @click="preview = { ...theme }">
                {{ theme.name }}
            </button>
        </template>
    </div>
</template>

<style scoped>
#preview-options {
    gap: 0.5rem;
    height: 100%;
}

#preview-options>.button:hover {
    background-color: var(--primary-light);
}

#preview-container {
    gap: 1rem;
    overflow: hidden;
}

.container {
    flex-wrap: wrap;
    gap: 1rem;
}

.button {
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.2em;
    border-radius: 8px;
    width: 16rem;
    cursor: pointer;
    background-color: var(--primary-dark);
    color: var(--text);
}
</style>
