<template>
  <div id="file-tree">
    <a-tree
    show-icon
    :tree-data = [sharedData.fileTree.root]
    :replace-fields="{
        title: 'name',
        key: 'key',
      }"
    @select="onSelect"
    >
      <a-icon slot="switcherIcon" type="down"/>
      <a-icon slot="file" type="file"/>
      <a-icon slot="file-unsaved" type="file" :style="{ color: 'var(--c-unsaved)' }"/>
      <a-icon slot="directory" type="folder" theme="filled"/>
      <a-icon slot="directory-unsaved" type="folder" theme="filled" :style="{ color: 'var(--c-unsaved)' }"/>
    </a-tree>
  </div>
</template>

<script>
export default {
  name: "FileTree",
  props: ['sharedData', 'onSelect'],
};
</script>

<style>
.ant-tree.ant-tree-show-line li span.ant-tree-switcher{
  color: var(--c-text);
  background-color: transparent;
}
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected{
  background-color: var(--c-selected-background) !important;
}
.ant-tree li .ant-tree-node-content-wrapper:hover{
  background-color: var(--c-button-background) !important;
}
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected:hover{
  background-color: var(--c-selected-background) !important;
}
</style>
