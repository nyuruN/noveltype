<script setup lang="ts">
import ThemePreview from '@/components/ThemePreview.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import Slider from '@/components/Slider.vue';
import { hslString } from '@/lib/color';
import { useThemeStore, Themes } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { theme, opacity, blur } = storeToRefs(useThemeStore())

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

    <div class="content-container flex-col" style="gap: 0.5rem">
        <h2 style="margin: 0.5rem 0;">General</h2>
        <div class="flex align-center">
            <div class="content-texts">
                <div>Opacity</div>
                <span>Gives the UI a transparent look</span>
            </div>
            <Slider :min="0" :max="1" :step="0.01" v-model="opacity" />
        </div>
        <div class="flex align-center">
            <div class="content-texts">
                <div>Blur</div>
                <span>Gives the UI a glassy look</span>
            </div>
            <Slider :min="0" :max="64" :step="1" v-model="blur" />
        </div>
    </div>

    <div class="content-container">
        <h2 style="margin: 0.5rem 0 1rem;">Color Preview</h2>
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
                <button class="button" @click="applyTheme" style="width: 16rem;">
                    Apply
                </button>
            </div>
        </div>
    </div>

    <div class="content-container">
        <h2 style="margin: 0.5rem 0 1rem;">Color Presets</h2>
        <div class="flex" style="gap: 1rem; flex-wrap: wrap;">
            <template v-for="(theme) in Themes">
                <button style="cursor: pointer;" class="button preset-button"
                    :style="{ backgroundColor: hslString(theme.primaryColor), color: hslString(theme.accentColor) }"
                    @click="preview = { ...theme }">
                    {{ theme.name }}
                </button>
            </template>
        </div>
    </div>
</template>

<style scoped>
#preview-options {
    gap: 0.5rem;
    height: 100%;
}

#preview-container {
    gap: 1rem;
    overflow: hidden;
}

.preset-button {
    width: 16rem;
    border-radius: 8px;
}
</style>
