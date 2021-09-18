<template>
  <div id="dummy-editor-bar">
    <div>
      <div>Nothing Selected</div>
      <p>Select a file in the file sidebar to start editing.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DummyEditorBar"
}
</script>

<style scoped>
#dummy-editor-bar {
  width: 100%;
  height: 90vh;
  background: var(--editor-bar-background);
  padding: 5px 10px;
  line-height: 90vh;
  text-align:center;
  font-size: 90px;
  color: var(--c-button-background);
}
#dummy-editor-bar > div {
  display: inline-block;
  line-height: 100px;
}
#dummy-editor-bar  p {
  display: inline-block;
  font-size: 30px;
}
</style>