<template>
  <div id="editor">
    <a-textarea id="editor-textarea" v-model="text" @change="contentChange"></a-textarea>
  </div>
</template>

<script>
import * as assert from "assert";

export default {
  props: ['sharedData'],
  data() {
    return {
      text: 'initial text',
    }
  },
  methods: {
    reloadContent() {
      assert(this.sharedData.selectedFile !== null && this.sharedData.selectedFile.kind === 'file',
        'reloading content from non-file target'
      );
      this.text = this.sharedData.selectedFile.content;
    },
    storeContent() {
      assert(this.sharedData.selectedFile !== null && this.sharedData.selectedFile.kind === 'file',
          'storing content from non-file target'
      );
      this.sharedData.selectedFile.content = this.text;
    },
    SyncSaved() {
      if (this.sharedData.selectedFile === null || this.sharedData.selectedFile.kind !== 'file') {
        return;
      }
      this.storeContent();
      this.sharedData.selectedFile.Saved();
    },
    contentChange() {
      if(this.sharedData.settings.liveSavedSync) {
        this.SyncSaved();
      }
    },
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