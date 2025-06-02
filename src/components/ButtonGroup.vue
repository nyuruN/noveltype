<script setup lang="ts">
let props = defineProps<{
    options: readonly string[],
    useDefault?: string,
}>()

let model = defineModel()
</script>

<template>
    <div class="button-group">
        <template v-for="option in props.options">
            <button class="group-button" @click="model = (model === option) ? undefined : option"
                :class="{ active: model === option }">
                {{ option }}
            </button>
        </template>
        <button class="group-button" @click="model = undefined" v-if="props.useDefault !== undefined"
            :class="{ active: model === undefined }">
            {{ props.useDefault }}
        </button>
    </div>
</template>

<style scoped>
.button-group {
    display: flex;
    border-radius: 8px;
    width: 12rem;
    align-items: stretch;
    overflow: clip;
    user-select: none;
}

.group-button {
    min-width: 2rem;
    padding: 0.3rem;
    flex-grow: 1;
    font-weight: bold;
    font-size: 0.9rem;
    background-color: var(--ui-button-bg);
    color: var(--ui-button-text);
    border: none;
}

.group-button:hover {
    background-color: var(--ui-button-hover);
    cursor: pointer;
}

.group-button.active {
    background-color: var(--ui-button-active-bg);
    color: var(--ui-button-active-text);
}
</style>