<template>
  <div id="editor">
    <textarea id="editor-textarea" v-text="text"></textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: 'initial text',
    }
  }
}
</script>

<style scoped>
#editor-textarea {
  width: 100%;
  height: 90vh;
  background: var(--editor-bar-background);
  border: none;
  padding: 5px 10px;
}
</style>