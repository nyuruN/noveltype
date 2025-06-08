<script setup lang="ts">
import { useTypingStore } from '@/stores/typing';
import { storeToRefs } from 'pinia';

const { showTyper } = storeToRefs(useTypingStore())
</script>

<template>
    <nav id="app-nav" class="nav">
        <div class="nav-items">
            <button class="nav-item" @click="$router.push('/')">
                <font-awesome-icon :icon="['fas', 'book-open']" fixed-width />
                <span style="margin-left: 0.5rem;">Library</span>
            </button>
            <button class="nav-item" @click="$router.push('/themes')">
                <font-awesome-icon :icon="['fas', 'palette']" fixed-width />
                <span style="margin-left: 0.5rem;">Themes</span>
            </button>
            <button class="nav-item" @click="$router.push('/settings')">
                <font-awesome-icon :icon="['fas', 'gear']" fixed-width />
                <span style="margin-left: 0.5rem;">Settings</span>
            </button>
        </div>
        <div class="grow"></div>
        <button class="nav-item" style="font-size: 1.1rem" @click="showTyper = true">
            <font-awesome-icon :icon="['fas', 'keyboard']" fixed-width />
            <span style="margin-left: 0.5rem;">Resume</span>
        </button>
    </nav>
</template>

<style scoped>
.nav-item {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 1.2rem;
    background-color: transparent;
    color: var(--ui-nav-text);
    border: none;
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;

    transition: var(--ui-bg-transition);
}

.nav-item:hover,
.nav-item:focus-visible {
    outline: none;
    background-color: var(--ui-nav-hover);
}

.nav {
    min-width: 10rem;
    padding: 2rem 0.5rem;
    display: flex;
    flex-direction: column;
    background-color: var(--ui-nav-bg);
    border-right: 1px solid var(--ui-border);
    overflow: hidden;

    transition: var(--ui-bg-transition);
}

@media screen and (max-width: 950px) {
    .nav-item span {
        display: none;
    }

    .nav-item {
        width: fit-content;
        padding: 0.8rem 0.6rem;
    }

    .nav {
        min-width: fit-content;
    }
}

#app-nav[data-collapse="true"] .nav-item span {
    display: none;
}

#app-nav[data-collapse="true"] .nav-item {
    width: fit-content;
    padding: 0.8rem 0.6rem;
}

#app-nav[data-collapse="true"] {
    min-width: fit-content;
}
</style>