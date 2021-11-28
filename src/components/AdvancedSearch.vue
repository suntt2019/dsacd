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
      <br>
      Use
      <a-input class="as-input width-limited" v-model="synonymCount"></a-input>
      synonyms each word.
      (-1 means unlimited)
    </div>
    <a-row type="flex" justify="end">
      <a-space :size="10">
        <div>Got {{this.resultList.length}} files.</div>
<!--        <a-button @click="toggleRW" size="small" :class="this.relatedWords ? 'active' : ''">-->
<!--          Related words: {{ this.relatedWords ? 'On' : 'Off' }}-->
<!--        </a-button>-->
        <a-button @click="search">Search</a-button>
      </a-space>
    </a-row>
    Words and synonyms (with IDF):
    <div>
      <div
          v-for="operand in this.operands"
          v-bind:key="operand.word"
          class="result-item word-item"
      >
        {{operand.word}}:
        <a-tag
            v-for="synonym in operand.synonyms"
            v-bind:key="synonym.synonym"
            class="result-item child synonym-tag"
        >
          <label>{{synonym.synonym}}</label>
          (<label class="statistics">{{synonym.IDF.toFixed(2)}}</label>)
        </a-tag>
      </div>
    </div>
    Search results:
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
import {GetLowerText, GetUpperText} from "../lib/text";
import {ConvertExpression, CalculateSet, GetOperands, InfixToPostfix, AddSynonyms} from "../lib/advancedSearch";
import {Slice} from "../lib/utils";
import {LoadSynonyms} from "../lib/synonym";

export default {
  name: "AdvancedSearch",
  props: ['sharedData', 'setLastSelected', 'checkoutFile'],
  data() {
    return {
      filesCount: -1,
      resultsPerFile: -1,
      synonymCount: 2,
      target: '',
      lastTarget: '',
      relatedWords: false,
      resultList: [],
      operands: [],
    }
  },
  mounted() {
    this.loadSynonyms();
  },
  methods: {
    loadSynonyms() {
      this.$message.loading({content:`Loading synonyms...`, key:'synonym', duration: 0.2});
      LoadSynonyms(()=>{
        this.$message.success({content: 'Loaded synonyms', key:'synonym', duration: 0.2});
      });
    },
    toggleRW() {
      this.relatedWords = !this.relatedWords;
    },
    search() {
      this.lastTarget = this.target;
      // try {
        let infix = ConvertExpression(this.target);
        console.log('infix:', infix);
        this.operands = GetOperands(infix, this.synonymCount, this.sharedData.index);
        console.log('operands:', this.operands);
        infix = AddSynonyms(infix, this.synonymCount);
        console.log('infix(with synonyms):', infix);
        let postfix = InfixToPostfix(infix);
        console.log('postfix:', postfix);
        this.resultList = CalculateSet(postfix, this.sharedData.index);
      // } catch (e) {
      //   this.$message.error(`Invalid expression "${this.target}".`, 0.5);
        // return;
      // }
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

.word-item{
  padding: 10px;
}

.synonym-tag {
  margin: 3px !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>