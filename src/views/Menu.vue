<template>
  <section class="menu-container">
    <h1>Menu</h1>
  </section>
</template>

<script>
export default {
  name: 'Menu',
};
</script>

<style scoped>
  $navbar-height: 96px;

  .menu-container {
    background: #EFEEEE;
    min-height: calc(100vh - $navbar-height);
  }
</style>
