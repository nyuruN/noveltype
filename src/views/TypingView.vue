
<script setup lang="ts">
import Typer from '@/components/Typer.vue'
import Menu from '@/components/Menu.vue'
</script>

<template>
  <div id="typer-container">
    <Menu />
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
}

#typer-container>* {
  width: 80rem;
  max-width: 85vw;
}
</style>
