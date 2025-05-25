<script setup lang="ts">
import Prompt from '@/components/Prompt.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
import { deleteDB, isStoragePersistant, persist,  } from '@/lib/db';
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
    let confirm = await usePromptStore().openPrompt('Confirm Action', 'This will erase all program data!', true)

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

    <div class="settings-container">
        <div class="option">
            <div class="option-texts">
                <div>Freedom mode</div>
                <div v-if="typing.freedomMode">You may edit all previous words in a paragraph</div>
                <div v-else>You may only edit incorrect previous words</div>
            </div>
            <ToggleSwitch v-model="typing.freedomMode"></ToggleSwitch>
        </div>

        <div class="option">
            <div class="option-texts">
                <div>Stop on error</div>
                <div v-if="typing.stopOnError === 'Letter'">You cannot proceed util you have
                    input the correct key</div>
                <div v-else-if="typing.stopOnError === 'Word'">You cannot proceed util the
                    correct word is typed</div>
                <div v-else>Words can be skipped by pressing space</div>
            </div>
            <ButtonGroup v-model="typing.stopOnError" :options="stopOnErrorOptions">
            </ButtonGroup>
        </div>

        <div class="option">
            <div class="option-texts">
                <div>Paragraph statistic display</div>
                <div v-if="typing.statsDisplay === 'RAW'">Your raw WPM will be shown at the
                    end of a typed paragraph</div>
                <div v-else-if="typing.statsDisplay === 'WPM'">Your net WPM will be shown at
                    the end of a typed paragraph</div>
                <div v-else-if="typing.statsDisplay === 'ACC'">Your accuracy will be shown
                    at the end of a typed paragraph</div>
                <div v-else>Statistic display will be hidden</div>
            </div>
            <ButtonGroup v-model="typing.statsDisplay" :options="statsDisplayOptions">
            </ButtonGroup>
        </div>

        <div class="option danger">
            <div class="option-texts">
                <div style="margin-left: -0.1rem;">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                    Persistant storage
                </div>
                <div v-if="isPersistant">Data will be persisted under storage pressure</div>
                <div v-else>Data won't be persisted under storage pressure (check browser implementation)</div>
            </div>
            <ToggleSwitch v-model="isPersistant" :accept="acceptPersistantToggle"></ToggleSwitch>
        </div>
        <div class="option danger">
            <div class="option-texts">
                <div style="margin-left: -0.1rem;">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" fixed-width />
                    Delete all site data
                </div>
                <div>
                    Deletes your store book files and settings
                </div>
            </div>
            <div class="button danger" @click="deleteProgramData">
                <font-awesome-icon :icon="['fas', 'trash']" fixed-width />
            </div>
        </div>
    </div>

    <Prompt />
</template>

<style scoped>
.option-texts {
    flex-grow: 1;
    margin-left: 0.5rem;
}

.option-texts>*:first-child {
    font-weight: bold;
}

.option {
    padding: 1rem;
    background-color: #474747;
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.option.danger {
    border-radius: 8px;
    border-color: #ff6161;
    border-width: 2px;
    border-style: solid;
}

.button {
    user-select: none;
    padding: 0.6rem 0.7rem;
    border-radius: 8px;
    background-color: #3b3b3b;
}

.button:hover {
    cursor: pointer;
    background-color: #5a5a5a;
}

.button.danger {
    background-color: #d66060;
}

.button.danger:hover {
    background-color: #f06969;
}
</style>
