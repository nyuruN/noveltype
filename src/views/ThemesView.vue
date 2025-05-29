<script setup lang="ts">
import { hslString } from '@/lib/color';
import { useThemeStore, Themes } from '@/stores/theme';

const store = useThemeStore()

</script>

<template>
    <h1>Themes</h1>

    <h2>Colors</h2>
    <div class="container flex" style="margin-top: 2rem;">
        <template v-for="(theme) in Themes">
            <button style="cursor: pointer;"
                :style="{ backgroundColor: hslString(theme.primaryColor), color: hslString(theme.accentColor) }"
                @click="store.changeTheme(theme)">
                {{ theme.name }}
            </button>
        </template>
    </div>
</template>

<style scoped>
.container {
    flex-wrap: wrap;
    gap: 1rem;
}

.container>button {
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.2em;
    border-radius: 8px;
    width: 16rem;
}
</style>
