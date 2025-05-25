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
            <div class="group-button" @click="model = (model === option) ? undefined : option"
                :class="{ active: model === option }">
                {{ option }}
            </div>
        </template>
        <div class="group-button" @click="model = undefined" v-if="props.useDefault !== undefined"
            :class="{ active: model === undefined, none: props.useDefault === '' }">
            {{ props.useDefault }}
        </div>
    </div>
</template>

<style scoped>
.button-group {
    display: flex;
    background-color: #3b3b3b;
    border-radius: 8px;
    overflow: clip;
    user-select: none;
}

.group-button {
    min-width: 3rem;
    padding: 0.7rem;
    font-weight: bold;
    font-size: 0.9rem;
}

.group-button.none {
    min-width: 0;
    width: 0;
}

.group-button:hover {
    background-color: #555555;
    cursor: pointer;
}

.group-button.active {
    background-color: #98c058;
}

.group-button.active:hover {
    background-color: #a8d461;
}

.group-button:not(:last-child) {
    border-right: 2px solid #4b4b4b;
}
</style>