<template>
  <div>
    <a-space :size="10">
      <a-icon type="file-add" :style="{ fontSize: '24px' }" @click="createFile"/>
      <a-icon type="file" :style="{ fontSize: '24px' }" @click="loadFile"/>
      <a-icon type="save" :style="{ fontSize: '24px' }" @click="saveFile"/>
      <a-icon type="appstore" :style="{ fontSize: '24px' }" @click="saveFiles"/>
      <a-icon type="sync" :style="{ fontSize: '24px' }" @click="syncFilesSaved"/>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "FileButtons",
  props: ['sharedData'],
  methods: {
    createFile() {

    },
    loadFile() {

    },
    saveFile() {

    },
    saveFiles() {

    },
    syncFilesSaved() {

    }
  }
}
</script>

<style scoped>

</style>