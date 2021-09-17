<template>
  <div id="editor">
    <textarea id="editor-textarea" v-model="text"></textarea>
  </div>
</template>

<script>
export default {
  props: ['sharedData'],
  data() {
    return {
      text: 'initial text',
    }
  },
  methods: {
    reloadContent() {
      if(this.sharedData.selectedFile === null) {
        throw(new Error('Try to reload content from null selected file'));
      }
      this.text = this.sharedData.selectedFile.content;
    },
    storeContent() {
      this.sharedData.selectedFile.content = this.text;
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