<script setup lang="ts">
import Typer from '@/components/Typer.vue'
import Menu from '@/components/Menu.vue'
</script>

<template>
  <div id="typer-container">
    <Menu style="margin-top: 3rem; margin-bottom: 3rem;" />
    <Typer />
    <div style="min-height: 6rem"></div>
  </div>
</template>

<style>
#typer-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  overflow-y: scroll;
  scrollbar-width: thin;
  background-color: var(--typing-bg);
}

#typer-container>* {
  width: 80rem;
  max-width: 90%;
}
</style>
