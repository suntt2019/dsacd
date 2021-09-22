<template>
  <div id="editor">
    <textarea id="editor-textarea" v-model="text" @change="contentChange" @click="updateSelection"></textarea>
  </div>
</template>

<script>
import * as assert from "assert";

export default {
  props: ['sharedData'],
  data() {
    return {
      text: 'initial text',
      lastSelection: [0,0],
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
    GetSelected() {
      return this.text.substring(this.lastSelection[0], this.lastSelection[1]);
    },
    SetSelected(str) {
      this.updateSelection();
      this.text = this.text.substring(0, this.lastSelection[0])
          + str
          + this.text.substring(this.lastSelection[1]);
      setTimeout(()=>{
        this.setLastSelected(this.lastSelection[0], this.lastSelection[0] + str.length);
      }, 1);
    },
    setLastSelected(start, end) {
      let textarea = document.getElementById("editor-textarea");
      textarea.focus();
      textarea.setSelectionRange(start, end);
    },
    updateSelection() {
      let textarea = document.getElementById("editor-textarea");
      this.lastSelection = [textarea.selectionStart, textarea.selectionEnd];
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
  font-family: monospace;
}
</style>