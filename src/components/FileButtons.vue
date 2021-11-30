<template>
  <div>
    <a-space :size="10">
      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span><b>Create file</b><br>Create a new file.</span>
        </template>
        <a-icon type="file-add" :style="{ fontSize: '24px' }" @click="CreateFile"/>
      </a-tooltip>

      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span><b>Import file</b><br>Open an existing file and <br>import it into the opened folder.</span>
        </template>
        <a-icon type="file" :style="{ fontSize: '24px' }" @click="LoadFile"/>
      </a-tooltip>

      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span><b>Save file</b><br>Save the currently opened file.</span>
        </template>
        <a-icon type="save" :style="{ fontSize: '24px' }" @click="SaveFile"/>
      </a-tooltip>

<!--      Improvement: set the button gray when "this.sharedData.selectedFile!==null && this.sharedData.selectedFile.kind === 'file' && !this.sharedData.selectedFile.saved"-->
      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span><b>Save all</b><br>Save all the files.</span>
        </template>
        <a-icon type="appstore" :style="{ fontSize: '24px' }" @click="saveFiles"/>
      </a-tooltip>
<!--      Improvement: set the button gray when "this.sharedData.fileTree.root.unsavedChildren.size !== 0"-->

      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span><b>Load all</b><br>Load and index all the files.</span>
        </template>
        <a-icon type="database" :style="{ fontSize: '24px' }" @click="LoadFiles"/>
      </a-tooltip>

      <a-tooltip placement="bottomLeft" v-if="!sharedData.settings.liveSavedSync">
        <template slot="title">
          <span><b>Sync saved</b><br>Sync saved information<br>for all the files.</span>
        </template>
        <a-icon type="sync" :style="{ fontSize: '24px' }" @click="syncFilesSaved"/>
      </a-tooltip>
    </a-space>
    <a-modal v-model="showInputModal" title="New file" @ok="nameInputOK">
      <a-input id="name-input" v-model="nameInput" allow-clear placeholder="New file name" />
      <a-alert v-show="showDuplicateError" type="error" :show-icon="false" message="Duplicate file name" banner />
    </a-modal>
  </div>
</template>

<script>
import {FileNode} from "../lib/files";
import * as assert from "assert";

export default {
  name: "FileButtons",
  props: ['sharedData', 'editorSyncSaved'],
  data() {
    return{
      showInputModal: false,
      nameInput: '',
      showDuplicateError: false,
    }
  },
  methods: {
    getSelectedDirectory() {
      let result;
      if (this.sharedData.selectedFile === null) {
        result = this.sharedData.fileTree.root;
      } else if (this.sharedData.selectedFile.kind === 'directory') {
        result = this.sharedData.selectedFile;
      } else if (this.sharedData.selectedFile.kind === 'file') {
        result = this.sharedData.selectedFile.parent;
      }
      return result
    },
    async createFile(dir, name, content) {
      let handler = await dir.handler.getFileHandle(name, {create: true});
      return new FileNode(name, dir, handler, this.sharedData.index, content);
    },
    validName(dir, name) {
      for (let i in dir.children) {
        if(name === dir.children[i].name) {
          this.showDuplicateError = true;
          return false;
        }
      }
      return true;
    },
    CreateFile() {
      this.showDuplicateError = false;
      this.nameInput = '';
      this.showInputModal = true;
    },
    async nameInputOK() {
      let dir = this.getSelectedDirectory();
      if(!this.validName(dir, this.nameInput)) {
        return;
      }
      this.showInputModal = false;
      await this.createFile(dir, this.nameInput);
    },
    async LoadFile() {
      let dir = this.getSelectedDirectory();
      let selectedFiles = await window.showOpenFilePicker({multiple: false});
      let externalFileHandle = selectedFiles[0];
      let externalFile = await externalFileHandle.getFile();
      if(!this.validName(dir, externalFile.name)) {
        return;
      }
      let text = await externalFile.text();
      await this.createFile(dir, externalFile.name, text);
    },
    SaveFile() {
      assert(this.sharedData.selectedFile !== null && this.sharedData.selectedFile.kind === 'file',
        `Invalid file saving target(this.sharedData.selectedFile), sharedData: ${this.sharedData}`
      );
      this.sharedData.selectedFile.Saved();
      if(!this.sharedData.selectedFile.saved) {
        this.sharedData.selectedFile.Save();
      }
    },
    saveFiles() {
      if(this.sharedData.selectedFile !== null && this.sharedData.selectedFile.kind === 'file') {
        this.sharedData.selectedFile.Saved();
      }
      this.sharedData.fileTree.SaveAll();
    },
    syncFilesSaved() {
      this.editorSyncSaved();
    },
    LoadFiles() {
      this.sharedData.fileTree.LoadAll();
    }

  }
}
</script>

<style>
.ant-modal-body, .ant-modal-header, .ant-modal-footer {
  background: var(--c-common-background) !important;
  border: none !important;
}
.ant-btn {
  background-color: var(--c-button-background) !important;
}
#name-input {
  background: var(--c-text-area-background);
}
.ant-input-clear-icon {
  color: var(--c-button-background) !important;
}
.ant-alert-error{
  background-color: var(--c-error) !important;
}
</style>