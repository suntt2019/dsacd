<template>
  <div id="editor">
    <textarea id="editor-textarea" v-model="text" @change="contentChange" @click="updateSelection"></textarea>
  </div>
</template>

<script>
import * as assert from "assert";

export default {
  props: ['sharedData', 'textChange'],
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
    StoreContent() {
      assert(this.sharedData.selectedFile !== null && this.sharedData.selectedFile.kind === 'file',
          'storing content from non-file target'
      );
      this.sharedData.selectedFile.content = this.text;
    },
    SyncSaved() {
      if (this.sharedData.selectedFile === null || this.sharedData.selectedFile.kind !== 'file') {
        return;
      }
      this.StoreContent();
      this.sharedData.selectedFile.Saved();
    },
    contentChange() {
      if(this.sharedData.settings.liveSavedSync) {
        this.SyncSaved();
      }
      this.textChange();
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
        this.SetLastSelected(this.lastSelection[0], this.lastSelection[0] + str.length);
      }, 1);
    },
    SetLastSelected(start, end) {
      // console.log('set last selected:', start, end);
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
  font-family: "Microsoft Yahei",sans-serif;
  font-size: 18px;
}
::selection {
  color: var(--c-selected-text);
  background: var(--c-selected-text-background);
}
</style>