<template>
  <div id="start-panel">
    <a-row :gutter="100" align="middle" style="display:inline-block; width: 900px">
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">
          <a-button @click="importFolder" class="start-btn">
            <label>Import folder</label>
            <p>Load all files<br>in the folder</p>
          </a-button>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">
          <a-button @click="openFolder" class="start-btn">
            <label>Select folder</label>
            <p>Don't load files<br>in the folder</p>
          </a-button>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">
          <a-button @click="storeLater" class="start-btn">
            <label>Store files later</label>
            <p class="slight">(Coming Soon)<br> - </p>
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {GetDir, FileTree} from "../lib/files";
import {WorkspaceIndex} from "../lib/invertedIndex";

export default {
  name: 'StartPanel',
  props: ['startEdit', 'sharedData'],
  methods: {
    importFolder(){
      this.sharedData.index = new WorkspaceIndex(this.$message);
      GetDir((dir)=>{
        this.sharedData.fileTree = new FileTree(dir, this.sharedData.index);
        this.sharedData.fileTree.Scan().then(()=>{
          this.startEdit();
        });
      });
    },
    openFolder(){
      this.sharedData.index = new WorkspaceIndex(this.$message);
      GetDir((dir)=>{
        this.sharedData.fileTree = new FileTree(dir, this.sharedData.index);
        this.startEdit();
      });
    },
    storeLater() {
      this.$message.warning('Feature coming soon', 1);
    }
  },
}
</script>

<style scoped>
#start-panel{
  text-align: center;
  line-height: 60vh;
  height: 100%;
  margin: 10px auto;
}
.start-btn{
  height: 200px !important;
  width: 200px !important;
  background: var(--c-button-background) !important;
}
</style>