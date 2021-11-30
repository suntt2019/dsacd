<template>
  <div>
    <div>
      Show
      <a-input-number v-model="wordCount" :min="-1"/>
      words,
      <a-input-number v-model="filesPreWord" :min="-1"/>
      file / word,
      <a-input-number v-model="resultsPerFile" :min="-1"/>
      result / file.
      (-1 means unlimited)
    </div>
    <a-row type="flex" justify="end">
      <a-button @click="execute">Get words</a-button>
    </a-row>
    <!--    TODO: use collapse instead of div-->
    <div
        v-for="word in slice(this.words, wordCount)"
        v-bind:key="word.key"
        class="result-item"
    >
      <label class="word">{{ word.key }}</label>
      TF=<label class="statistics">{{ word.value.sum }}</label>
      <div>
        <div
            v-for="file in slice(word.value.files.SortedItems((a, b)=>{return a.value.count<b.value.count}),filesPreWord)"
            v-bind:key="file.value.key"
            class="result-item child"
        >
          File <label class="word">{{file.value.file.name}}</label> (TF=<label class="statistics">{{file.value.count}}</label>)
          <div>
            <div
                v-for="point in slice(file.value.points,resultsPerFile)"
                v-bind:key="point"
                class="result-item child"
                @click="highlightText(file.value.file, point, word.key.length)"
            >
              <label>{{ getLowerText(file.value.file, point) }}</label>
              <label id="find-highlight-label">{{ word.key }}</label>
              <label>{{ getUpperText(file.value.file, point + word.key.length) }}</label>
              (Position={{ point }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {GetLowerText, GetUpperText} from "../lib/text";
import {Slice} from "../lib/utils";

export default {
  name: "Frequency",
  props: ['sharedData', 'setLastSelected', 'checkoutFile'],
  data() {
    return {
      wordCount: 5,
      filesPreWord: 3,
      resultsPerFile: 3,
      words: [],
    }
  },
  methods: {
    execute() {
      this.words = this.sharedData.index.map.SortedItems(function (a, b) {
        return a.value.sum < b.value.sum;
      });
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
.word {
  font-weight: bolder;
}

.statistics {
  color: var(--c-statistics);
}

.child {
  background-color: rgba(0, 0, 0, 0.1);
}

.frequency-input {
  background: var(--editor-bar-background) !important;
  border: none !important;
  margin: 10px !important;
  width: 50px !important;
}
::selection {
  color: var(--c-selected-text) !important;
  background: var(--c-selected-text-background) !important;
}
.ant-input-number {
  border: none !important;
  background: var(--c-text-area-background) !important;
  margin: 10px !important;
  width: 50px !important;
}
.ant-input-number-handler-up, .ant-input-number-handler-down {
  background: var(--c-button-background) !important;
}
.ant-input-number-handler-wrap {
  background: transparent !important;
}

</style>