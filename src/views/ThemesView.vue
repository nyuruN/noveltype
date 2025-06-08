<script setup lang="ts">
import ThemePreview from '@/components/widgets/ThemePreview.vue';
import ColorPicker from '@/components/widgets/ColorPicker.vue';
import Slider from '@/components/widgets/Slider.vue';
import Dropdown from '@/components/widgets/Dropdown.vue';
import { hslString } from '@/lib/color';
import { useThemeStore, Themes, imageLayoutOptions } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { theme, savedThemes, opacity, blur, imageLayout, imageUrl } = storeToRefs(useThemeStore())

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
let urlInputBuffer = imageUrl.value?.slice()
</script>

<template>
    <h1>Themes</h1>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2>General</h2>

        <div class="flex align-center">
            <div class="content-texts">
                <div>Image Url</div>
                <span>Loads an image as the backdrop of the website</span>
            </div>
            <div class="flex" style="gap: 0.5rem; width: 24rem;">
                <input type="text" class="text-input button grow" name="imageUrl" placeholder="Paste image URL here"
                    v-model="urlInputBuffer" onfocus="this.select()" />
                <button class="button icon-btn" @click="imageUrl = urlInputBuffer">
                    <font-awesome-icon :icon="['fas', 'floppy-disk']" fixed-width />
                </button>
            </div>
        </div>
        <div class="flex align-center">
            <div class="content-texts">
                <div>Image layout</div>
                <span>Determines how the image is layed out</span>
            </div>
            <Dropdown v-model="imageLayout" :options="imageLayoutOptions" />
        </div>
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
        <h2 style="margin-bottom: 1rem;">Color Preview</h2>
        <div id="preview-container" class="flex" style="height: 20rem; align-items: stretch;">
            <ThemePreview v-model="preview" />
            <div class="grow">
                <div id="preview-options" class="flex-col" style="width: 16rem;">
                    <div class="flex" style="gap: 0.5rem">
                        <input type="text" class="text-input button grow" name="theme-name" placeholder="Theme Name"
                            v-model="preview.name" onfocus="this.select()" />
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
        <h2 style="margin-bottom: 1rem;">Color Presets</h2>

        <template v-if="savedThemes.length">
            <h3 style="margin-bottom: 1rem;">
                <font-awesome-icon :icon="['fas', 'star']" fixed-width />
                Favourites
            </h3>
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
