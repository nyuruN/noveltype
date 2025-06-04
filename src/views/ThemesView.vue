<script setup lang="ts">
import ThemePreview from '@/components/ThemePreview.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import Slider from '@/components/Slider.vue';
import { hslString } from '@/lib/color';
import { useThemeStore, Themes } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { theme, savedThemes, opacity, blur } = storeToRefs(useThemeStore())

let preview = ref({ ...theme.value })

function applyTheme() {
    let newTheme = {
        ...preview.value
    }
    theme.value = newTheme
}
function themeAction() {
    let idx = savedThemes.value.findIndex(t => t.name == preview.value.name)

    if (idx != -1) {
        console.log(savedThemes.value.splice(idx, 1))
    } else if (preview.value.name) {
        savedThemes.value.push({ ...preview.value })
    }
}

let isFavorite = computed(() => savedThemes.value.find(t => t.name == preview.value.name))
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
            <div class="grow">
                <div id="preview-options" class="flex-col" style="width: 16rem;">
                    <div class="flex" style="gap: 0.5rem">
                        <input type="text" class="text-input button grow" name="theme-name" placeholder="Theme Name"
                            style="overflow: auto" v-model="preview.name" onfocus="this.select()" />
                        <button class="button icon-btn" @click="themeAction" :class="{ active: isFavorite }">
                            <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'star']" fixed-width />
                        </button>
                    </div>

                    <ColorPicker v-model="preview.primaryColor" :reset-color="theme.primaryColor" label="Primary Color">
                    </ColorPicker>
                    <ColorPicker v-model="preview.accentColor" :reset-color="theme.accentColor" label="Accent Color">
                    </ColorPicker>
                    <ColorPicker v-model="preview.textColor" :reset-color="theme.textColor" label="Text Color">
                    </ColorPicker>
                    <ColorPicker v-model="preview.textDimmedColor" :reset-color="theme.textDimmedColor"
                        label="Text Dimmed Color" style="width: auto;"></ColorPicker>

                    <button class="button" style="width: auto;" @click="applyTheme">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="content-container">
        <h2 style="margin: 0.5rem 0 1rem;">Color Presets</h2>

        <template v-if="savedThemes.length">
            <h2 style="margin: 0.5rem 0 1rem; font-size: 1.25rem">
                <font-awesome-icon :icon="['fas', 'star']" fixed-width />
                Favourites
            </h2>
            <div class="flex" style="gap: 1rem; flex-wrap: wrap;">
                <template v-for="(theme) in savedThemes">
                    <button style="cursor: pointer;" class="button preset-button"
                        :style="{ backgroundColor: hslString(theme.primaryColor), color: hslString(theme.accentColor) }"
                        @click="preview = { ...theme }">
                        <span>{{ theme.name }}</span>
                    </button>
                </template>
            </div>

            <div class="divider"></div>
        </template>

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
.icon-btn:hover,
.icon-btn.active {
    color: var(--accent)
}

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
