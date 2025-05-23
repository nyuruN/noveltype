<script setup lang="ts">
import Prompt, { openPrompt } from '@/components/Prompt.vue';
import { deleteDB } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { useTypingStore } from '@/stores/typing';
import { storeToRefs } from 'pinia';

let { typingSettings } = storeToRefs(useTypingStore())

async function deleteProgramData() {
    let confirm = await openPrompt('Confirm Action', 'This will erase all program data!', true)

    if (confirm) {
        deleteDB()
        useLibraryStore().$reset()
        useTypingStore().$reset()
    }
}
</script>

<template>
    <h1>Settings</h1>

    <div class="settings-container">
        <div class="option-container" style="margin-bottom: 0.5rem;">
            <div class="option-text">
                <div style="margin-left: 0.5rem; font-weight: bold;">Stop on error</div>
                <div style="margin-left: 0.5rem">You cannot proceed util you have input the correct key</div>
            </div>
            <div class="toggle-switch" :class="{ enabled: typingSettings.stopOnError }"
                @click="typingSettings.stopOnError = !typingSettings.stopOnError">
            </div>
        </div>

        <div class="danger-container">
            <div class="danger-button" @click="deleteProgramData">
                <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                <div style="display: inline; margin-left: 0.5rem">Delete all program data</div>
            </div>
        </div>
    </div>

    <Prompt />
</template>

<style scoped lang="scss">
$toggleScale: 0.4;
$toggleWidth: 200px * $toggleScale;
$toggleHeight: 100px * $toggleScale;
$togglePadding: 5px * $toggleScale;

.toggle-switch {
    cursor: pointer;
    width: $toggleWidth;
    height: $toggleHeight;
    background: grey;
    display: block;
    border-radius: $toggleHeight;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        top: $togglePadding;
        left: $togglePadding;
        width: $toggleHeight - $togglePadding * 2;
        height: $toggleHeight - $togglePadding * 2;
        background: #fff;
        border-radius: $toggleHeight - $togglePadding * 2;
        transition: 0.3s;
    }

    &:active:after {
        width: $toggleHeight * 1.3;
    }
}

.enabled.toggle-switch {
    background: #bada55;

    &:after {
        left: calc(100% - $togglePadding);
        transform: translateX(-100%);
    }
}

.option-text {
    flex-grow: 1;
}

.option-container {
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    display: flex;
    align-items: center;
}

.danger-button {
    user-select: none;
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    border-color: #ff6161;
    border-width: 2px;
    border-style: solid;
}

.danger-button:hover {
    background-color: #3b3b3b;
    cursor: pointer;
}
</style>
