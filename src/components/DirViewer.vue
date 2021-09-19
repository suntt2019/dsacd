<template>
  <div id="div-viewer">
    <div>
      <div>Directory Viewer</div>
      <a-space :size="10">
        <p><a-divider type="vertical" /></p>
        <p v-for="n in names" v-bind:key="n">{{ n }} <a-divider type="vertical" /> </p>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  name: "DirViewer",
  props: ['showing', 'selected'],
  computed: {
    names: function () {
      if(this.selected === undefined || this.selected === null) {
        return;
      }
      let names = [];
      for(let c in this.selected.children) {
        names.push(this.selected.children[c].name);
      }
      if(names.length > 5) {
        names = names.slice(0, 5);
        names.push('...');
      }
      return names;
    }
  }
}
</script>

<style scoped>
#div-viewer {
  width: 100%;
  height: 90vh;
  background: var(--editor-bar-background);
  padding: 5px 10px;
  line-height: 90vh;
  text-align:center;
  font-size: 90px;
  color: var(--c-button-background);
}
#div-viewer > div {
  display: inline-block;
  line-height: 100px;
}
#div-viewer p {
  display: inline-block;
  font-size: 30px;
}
#div-viewer .ant-divider-vertical{
  font-size: 30px !important;
}
</style>