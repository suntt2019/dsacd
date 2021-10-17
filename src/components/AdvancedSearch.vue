<template>
  <div>
    <a-input class="as-input" v-model="target" placeholder="Type search target here">
<!--      <a-icon slot="prefix" type="search" style="color: var(&#45;&#45;c-selected-background); margin: 10px"/>-->
    </a-input>
    <div>
      Show
      <a-input class="as-input width-limited" v-model="filesCount"></a-input>
      files, with
      <a-input class="as-input width-limited" v-model="resultsPerFile"></a-input>
      words each file.
      (-1 means unlimited)
    </div>
    <a-row type="flex" justify="end">
      <a-space :size="10">
        <div>Got {{this.resultList.length}} files.</div>
        <a-button @click="toggleRW" size="small" :class="this.relatedWords ? 'active' : ''">
          Related words: {{ this.relatedWords ? 'On' : 'Off' }}
        </a-button>
        <a-button @click="search">Search</a-button>
      </a-space>
    </a-row>
    <div>
      <div
          v-for="file in slice(this.resultList, filesCount)"
          v-bind:key="file.value.file.hash"
          class="result-item"
      >
        File <label class="word">{{file.value.file.name}}</label> (weight=<label class="statistics">{{file.value.count.toFixed(2)}}</label>)
        <div>
          <div
              v-for="point in slice(file.value.points, resultsPerFile)"
              v-bind:key="point.point"
              class="result-item child"
              @click="highlightText(file.value.file, point.point, point.word.length)"
          >
            <label>{{ getLowerText(file.value.file, point.point) }}</label>
            <label id="find-highlight-label">{{ point.word }}</label>
            <label>{{ getUpperText(file.value.file, point.point + point.word.length) }}</label>
<!--            (Position={{ point }})-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {GetLowerText, GetUpperText} from "../js/text";
import {ConvertExpression, CalculateSet} from "../js/advancedSearch";
import {Slice} from "../js/utils";

export default {
  name: "AdvancedSearch",
  props: ['sharedData', 'setLastSelected', 'checkoutFile'],
  data() {
    return {
      filesCount: -1,
      resultsPerFile: -1,
      target: '',
      lastTarget: '',
      relatedWords: false,
      resultList: [],
    }
  },
  methods: {
    toggleRW() {
      this.relatedWords = !this.relatedWords;
    },
    search() {
      this.lastTarget = this.target;
      try {
        let postfix = ConvertExpression(this.target);
        this.resultList = CalculateSet(postfix, this.sharedData.index);
      } catch (e) {
        this.$message.error(`Invalid expression "${this.target}".`, 0.5);
        return;
      }
      this.$message.success(`Finish advanced search, got ${this.resultList.length} results.`, 0.5);
    },
    getLowerText(file, point) {
      return GetLowerText(file.content, point);
    },
    getUpperText(file, pointAfterWord) {
      return GetUpperText(file.content, pointAfterWord);
    },
    highlightText(fileNode, point, length) {
      if(this.sharedData.selectedFile === null || this.sharedData.selectedFile.key !== fileNode.key) {
        this.checkoutFile(false, fileNode);
      }
      setTimeout( ()=>{
        this.setLastSelected(point, point + length);
      }, 1);
    },
    slice(array, count) {
      return Slice(array, count);
    }
  }
}
</script>

<style>

.as-input {
  background: var(--editor-bar-background) !important;
  border: none !important;
  margin: 5px !important;
}

.width-limited {
  width: 50px !important;
}

.active {
  color: var(--c-selected-text) !important;
  background-color: var(--c-selected-background) !important;
}

</style>