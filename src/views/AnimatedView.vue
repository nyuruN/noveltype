<script setup lang="ts">
import ToggleSwitch from '@/components/widgets/ToggleSwitch.vue';
import { useAnimatedStore } from '@/stores/animated';
import { storeToRefs } from 'pinia';

const { enabled } = storeToRefs(useAnimatedStore()) 
</script>

<template>
    <h1>Animated Backgrounds</h1>

    <div class="content-container flex-col" style="gap: 1rem">
        <h2>General</h2>

        <div class="flex">
            <div class="content-texts grow align-center">
                <div>Enable animated background</div>
                <span>Animates the background using real time shaders</span>
            </div>
            <ToggleSwitch v-model="enabled"></ToggleSwitch>
        </div>
    </div>
</template>

<style scoped></style>