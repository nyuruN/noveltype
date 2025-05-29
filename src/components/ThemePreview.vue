<script setup lang="ts">
import { darken, hslString } from '@/lib/color';
import { useThemeStore, type Theme } from '@/stores/theme';
import { computed } from 'vue';

const themeStore = useThemeStore()
let preview = defineModel<Theme>({ required: true })

function applyTheme() {
    if (themeStore.theme.name != preview.value.name) {
        themeStore.theme = preview.value
    }
}

const text = computed(() => ({
    color: hslString(preview.value.textColor)
}))
const textDimmed = computed(() => ({
    color: hslString(preview.value.textDimmedColor)
}))
</script>

<template>
    <div id="preview-container" class="flex">
        <div id="preview" class="grow relative" :style="{ backgroundColor: hslString(preview.primaryColor) }">
            <div id="preview-menu" class="flex"
                :style="{ backgroundColor: hslString(darken(preview.primaryColor, 0.2)), color: hslString(preview.textDimmedColor) }">
                <font-awesome-icon :icon="['fas', 'home']" fixed-width />
                <font-awesome-icon :icon="['fas', 'bars']" fixed-width />
                <span class="grow" style="text-align: center;">{{ preview.name }}</span>
                <font-awesome-icon :icon="['fas', 'caret-left']" fixed-width />
                <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
            </div>
            <div id="preview-paragraph" class="flex">
                <div :style="text">Lorem</div>
                <div :style="text">ipsum</div>
                <div :style="text">dolor</div>
                <div :style="text">sit</div>
                <div :style="text">amet</div>
                <div :style="text">consectetur</div>
                <div :style="text">adipisicing</div>
                <div :style="text">elit.</div>
                <div :style="textDimmed">
                    <div id="preview-caret" :style="{ backgroundColor: hslString(preview.accentColor) }"></div>
                    Repellat
                </div>
                <div :style="textDimmed">pariatur</div>
                <div :style="textDimmed">cupiditate</div>
                <div :style="textDimmed">autem</div>
                <div :style="textDimmed">rem?</div>

                <div :style="{ color: hslString(darken(preview.primaryColor, 0.1)) }">
                    <font-awesome-icon :icon="['fas', 'turn-down']" class="fa-rotate-90" transform="down-5 right-2" />
                </div>
            </div>
        </div>
        <div id="preview-options" class="grow">
            <button class="button" @click="applyTheme">
                Apply
            </button>
        </div>
    </div>
</template>

<style scoped>
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

.button:hover {
    background-color: var(--primary-light);
}

#preview-container {
    gap: 1rem;
    overflow: hidden;
}

#preview {
    height: 20rem;
    max-width: 50%;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#preview-menu {
    position: absolute;
    top: 10%;
    border-radius: 8px;
    width: 60%;
    padding: 0.3rem;
    align-items: center;
    gap: 0.3rem;
}

#preview-paragraph {
    width: 80%;
    flex-wrap: wrap;
    font-size: 1.5rem;
    gap: 0.5em;
}

#preview-caret {
    position: absolute;
    height: 1.25em;
    width: 0.1em;
    border-radius: 0.1em;
    z-index: 1;
}
</style>
