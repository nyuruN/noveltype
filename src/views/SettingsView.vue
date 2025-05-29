<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
import { deleteDB, isStoragePersistant, persist } from '@/lib/db';
import { useLibraryStore } from '@/stores/library';
import { usePromptStore } from '@/stores/prompt';
import { statsDisplayOptions, stopOnErrorOptions, useSettingsStore } from '@/stores/settings';
import { useTypingStore } from '@/stores/typing';
import { storeToRefs } from 'pinia';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { onMounted, ref } from 'vue';

let { typing } = storeToRefs(useSettingsStore())
let isPersistant = ref(false)

onMounted(async () => {
    isPersistant.value = await isStoragePersistant()
    console.log('Storage persistance status: ' + isPersistant.value)
})

async function deleteProgramData() {
    let confirm = await usePromptStore().openPrompt('Confirm Action', 'This will erase all site data!', true)

    if (confirm) {
        deleteDB()
        useLibraryStore().$reset()
        useSettingsStore().$reset()
        useTypingStore().$reset()
    }
}
async function acceptPersistantToggle(persistant: boolean) {
    return persistant ? (await persist()) : false
}
</script>

<template>
    <h1>Settings</h1>

    <div class="settings-container flex-col" style="gap: 1rem;">
        <div class="option-container flex-col">
            <h3 style="margin: 0;">Typing</h3>
            <div class="option">
                <div class="option-texts">
                    <div>Freedom mode</div>
                    <span>Allows you to edit all previously typed words</span>
                </div>
                <ToggleSwitch v-model="typing.freedomMode"></ToggleSwitch>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div>Stop on error</div>
                    <span>Prevents you from skipping incorrect elements</span>
                </div>
                <ButtonGroup v-model="typing.stopOnError" :options="stopOnErrorOptions" use-default="">
                </ButtonGroup>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div>Paragraph statistic display</div>
                    <span>Displays a trailing statistic indicator at the end of a typed paragraph</span>
                </div>
                <ButtonGroup v-model="typing.statsDisplay" :options="statsDisplayOptions" use-default="">
                </ButtonGroup>
            </div>
        </div>

        <div class="option-container flex-col danger">
            <h3 style="margin: 0;">Important</h3>
            <div class="option">
                <div class="option-texts">
                    <div style="margin-left: -0.1rem;">
                        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                        Persistant storage
                    </div>
                    <span>Makes data persistant under storage pressure (check browser implementation for details)</span>
                </div>
                <ToggleSwitch v-model="isPersistant" :accept="acceptPersistantToggle"></ToggleSwitch>
            </div>
            <div class="option">
                <div class="option-texts">
                    <div style="margin-left: -0.1rem;">
                        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                        Delete all site data
                    </div>
                    <span>Deletes your stored books and settings</span>
                </div>
                <div class="button danger" @click="deleteProgramData">
                    <font-awesome-icon :icon="['fas', 'trash']" fixed-width />
                </div>
            </div>
        </div>
    </div>

    <Prompt />
</template>

<style scoped>
.option-texts {
    flex-grow: 1;
}

.option-texts>*:first-child {
    font-weight: bold;
}

.option-texts>*:not(:first-child) {
    color: var(--text);
}

.option {
    display: flex;
    align-items: center;
}

.option-container {
    background-color: var(--primary-dark);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    gap: 1.2rem;
}

.option-container.danger {
    border: 2px solid var(--no);
}

.button {
    user-select: none;
    padding: 0.6rem 0.7rem;
    border-radius: 8px;
    background-color: var(--primary-darker);
}

.button:hover {
    cursor: pointer;
    background-color: var(--primary-light);
}

.button.danger {
    background-color: var(--no);
    color: var(--primary-dark)
}

.button.danger:hover {
    background-color: var(--no-light);
}
</style>
