<template>
  <div>
    <div>
      Show
      <a-input v-model="wordCount" class="frequency-input"></a-input>
      words,
      <a-input v-model="filesPreWord" class="frequency-input"></a-input>
      file / word,
      <a-input v-model="resultsPerFile" class="frequency-input"></a-input>
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
import {GetLowerText, GetUpperText} from "../js/text";
import {Slice} from "../js/utils";

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
</style>