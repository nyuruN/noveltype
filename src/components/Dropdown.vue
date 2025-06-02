<script setup lang="ts">
import { ref } from 'vue';

let props = defineProps<{
    options: readonly string[],
    default?: string,
}>()

let model = defineModel()

let showDropdown = ref(false)
</script>

<template>
    <div>
        <button class="dropdown-button relative" @click="showDropdown = !showDropdown" :class="{ focus: showDropdown }">
            <span>{{ model ? model : props.default }}</span>

            <div class="dropdown flex-col" v-if="showDropdown" style="z-index: 1;">
                <button class="dropdown-item" v-for="option in props.options" @click="model = option">
                    {{ option }}
                </button>
                <button class="dropdown-item" v-if="props.default" @click="model = undefined">
                    {{ props.default }}
                </button>
            </div>
        </button>
        <div style="position: absolute; top: 0;left: 0;width: 100%;height: 100%;" v-show="showDropdown"
            @click="showDropdown = false"></div>
    </div>
</template>

<style scoped>
.dropdown-item {
    font-size: 1rem;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    border-bottom: 1px solid var(--primary);
    background-color: hsl(from var(--primary-dark) h s l / var(--opacity));
    color: var(--text-dimmed);
}

.dropdown-item:hover {
    cursor: pointer;
    background-color: hsl(from var(--primary) h s l / var(--opacity));
}

.dropdown {
    width: 12rem;
    position: absolute;
    left: 0;
    top: 110%;

    /* This is needed to offset the border width */
    margin: 1px 0 0 -1px;

    border-radius: 4px;
    border: 1px solid var(--ui-border);
    background-color: hsl(from var(--primary-dark) h s l / var(--opacity));
}

.dropdown-button {
    font-size: 1.2rem;
    width: 12rem;
    height: 2rem;
    padding: 0;
    border: none;
    border-radius: 4px;
    border: 1px solid var(--ui-border);
    background-color: hsl(from var(--primary-dark) h s l / var(--opacity));
    color: var(--text-dimmed);

    transition: border 0.1s ease, color 0.1s ease;
}

.dropdown-button:hover,
.dropdown-button.focus {
    cursor: pointer;
    border: 1px solid var(--ui-border-active);
    color: var(--text);
}
</style>