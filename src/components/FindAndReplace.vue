<template>
  <div>
    <a-tabs id="input-bar" default-active-key="find" @change="tabChange" tab-position="left">
      <a-tab-pane key="find" tab="Find">
        <a-input v-model="find.target" class="find-replace-input" id="find-target-input">
          <a-icon slot="prefix" type="search" style="color: var(--c-selected-background); margin: 10px"/>
        </a-input>
        <a-row type="flex" justify="end">
          <a-tooltip placement="bottom">
            <a-button @click="findSelectPrevious">∧</a-button>
            <template slot="title">
              <div style="text-align: center">
                Previous
              </div>
            </template>
          </a-tooltip>
          <a-tooltip placement="bottom">
            <a-button @click="findSelectNext">∨</a-button>
            <template slot="title">
              <div style="text-align: center">
                Next
              </div>
            </template>
          </a-tooltip>
          <a-button @click="Find">Find</a-button>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="replace" tab="Replace">
        <a-input v-model="replace.source" class="find-replace-input" id="replace-source-input" @change="ReplaceNeedRefresh">
          <a-icon slot="prefix" type="search" style="color: var(--c-selected-background); margin: 10px"/>
        </a-input>
        <a-input v-model="replace.target" class="find-replace-input" id="replace-target-input" @change="replaceUpdateTarget">
          <a-icon slot="prefix" type="search" style="color: var(--c-selected-background); margin: 10px"/>
        </a-input>
        <a-row type="flex" justify="end">
          <a-tooltip placement="bottom" v-show="replace.matched">
            <a-button @click="replaceSelectPrevious">∧</a-button>
            <template slot="title">
              <div style="text-align: center">
                Previous
              </div>
            </template>
          </a-tooltip>
          <a-tooltip placement="bottom" v-show="replace.matched">
            <a-button @click="replaceSelectNext">∨</a-button>
            <template slot="title">
              <div style="text-align: center">
                Next
              </div>
            </template>
          </a-tooltip>
          <a-button v-show="!replace.matched" @click="replaceMatch">Match</a-button>
          <a-button v-show="replace.matched" @click="Replace">Replace</a-button>
          <a-button v-show="replace.matched" @click="replaceAll">Replace All</a-button>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <div v-if="find.showPoints && tab === 'find'">
      <div
          v-for="i in range(find.points.length)"
          v-bind:key="i"
          class="result-item"
          :class="find.selected === i ? 'selected' : ''"
          @click="findItemClick(i);"
      >
        <label>{{ getLowerText(find.points[i]) }}</label>
        <label id="find-highlight-label">{{sharedData.selectedFile.content.substr(find.points[i], findLastData.target.length)}}</label>
        <label>{{getUpperText(find.points[i] + findLastData.target.length)}}</label>
      </div>
    </div>
    <div v-if="replace.showPoints && tab === 'replace'">
      <div
          v-for="i in range(replace.points.length)"
          v-bind:key="i"
          class="result-item"
          :class="replace.selected === i ? 'selected' : ''"
          @click="replaceItemClick(i);"
      >
        <label>{{ getLowerText(replace.points[i]) }}</label>
        <label id="replace-source-label">{{sharedData.selectedFile.content.substr(replace.points[i], replaceLastData.source.length)}}</label>
        <label id="replace-target-label">{{replace.target}}</label>
        <label>{{getUpperText(replace.points[i] + replaceLastData.source.length)}}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { FindAll, Replacer } from '../js/KMP';

export default {
  name: "FindAndReplace",
  props: ['sharedData', 'storeContent', 'reloadContent', 'setLastSelected'],
  data() {
    return {
      tab: 'find',
      find: {
        showPoints: false,
        target: '',
        points: [],
        selected: 0,
      },
      replace: {
        showPoints: false,
        replacer: new Replacer('','',''),
        source: '',
        target: '',
        points: [],
        selected: 0,
        matched: false,
      },
      findLastData: {
        target: '',
      },
      replaceLastData: {
        source: '',
      },
    }
  },
  methods: {
    tabChange(tab) {
      this.tab = tab;
    },
    range(length) {
      let ret = [];
      for (let i = 0; i < length; i++) {
        ret.push(i);
      }
      return ret;
    },
    Find() {
      if (this.sharedData.selectedFile === null) {
        this.$message.error('No file selected', 0.2);
        return;
      }
      if (this.find.target === '') {
        this.$message.error('Cannot find empty string', 0.2);
        return;
      }
      this.findLastData = {
        target: this.find.target,
      }
      this.find.points = FindAll(this.sharedData.selectedFile.content, this.find.target);
      this.find.selected = 0;
      this.find.showPoints = true;
      if (this.find.points.length === 0) {
        this.$message.warn('Nothing found', 0.2);
      } else {
        this.$message.success('Find completed', 0.2);
      }
    },
    findSelectPrevious() {
      if (this.find.selected > 0) {
        this.find.selected--;
      }
      this.findHighLight();
    },
    findSelectNext() {
      if (this.find.selected < this.find.points.length - 1) {
        this.find.selected++;
      }
      this.findHighLight();
    },
    findHighLight() {
      this.setLastSelected(this.find.points[this.find.selected], this.find.points[this.find.selected] + this.findLastData.target.length);
    },
    getLowerText(point) {
      let lower = point;
      let spaceCount = 0;
      while (lower > 0 && lower > point - 10 && spaceCount < 2) {
        if (this.sharedData.selectedFile.content[lower] === ' ') {
          spaceCount++;
        }
        lower--;
      }
      return this.sharedData.selectedFile.content.substring(lower, point);
    },
    getUpperText(pointAfterWord) {
      let upper = pointAfterWord;
      let spaceCount = 0;
      while (upper < this.sharedData.selectedFile.content.length && upper < pointAfterWord + 10 && spaceCount < 3) {
        if (this.sharedData.selectedFile.content[upper] === ' ') {
          spaceCount++;
        }
        upper++;
      }
      return this.sharedData.selectedFile.content.substring(pointAfterWord, upper);
    },
    findItemClick(i) {
      this.find.selected = i;
      this.findHighLight();
    },
    ReplaceNeedRefresh() {
      this.replace.matched = false;
      this.replace.showPoints = false;
    },
    replaceMatch() {
      if (this.sharedData.selectedFile === null) {
        this.$message.error('No file selected', 0.2);
        return;
      }
      if (this.replace.source === '') {
        this.$message.error('Cannot match empty string', 0.2);
        return;
      }
      this.replaceLastData = {
        source: this.replace.source,
      }
      this.replace.replacer = new Replacer(this.sharedData.selectedFile.content, this.replace.source, this.replace.target);
      this.replace.showPoints = true;
      this.replace.points = this.replace.replacer.GetPoints();
      if (this.replace.points.length === 0) {
        this.$message.warn('Nothing matched', 0.2);
      } else {
        this.$message.success('Match completed', 0.2);
        this.replace.matched = true;
        this.replace.selected = 0;
      }
    },
    replaceUpdateNextPlace() {
      this.replace.replacer.nextReplace = this.replace.points[this.replace.selected];
    },
    replaceSelectPrevious() {
      if (this.replace.selected > 0) {
        this.replace.selected--;
      }
      this.replaceUpdateNextPlace();
      this.replaceHighLight();
    },
    replaceSelectNext() {
      if (this.replace.selected < this.replace.points.length - 1) {
        this.replace.selected++;
      }
      this.replaceUpdateNextPlace();
      this.replaceHighLight();
    },
    replaceHighLight() {
      this.setLastSelected(this.replace.points[this.replace.selected], this.replace.points[this.replace.selected] + this.replaceLastData.source.length);
    },
    replaceItemClick(i) {
      this.replace.selected = i;
      this.replaceUpdateNextPlace();
      this.replaceHighLight();
    },
    replaceUpdateTarget() {
      this.replace.replacer.UpdateTarget(this.replace.target);
    },
    Replace() {
      this.replace.replacer.Replace();
      this.sharedData.selectedFile.content = this.replace.replacer.str;
      this.reloadContent();
      this.replace.points = this.replace.replacer.GetPoints();
      this.replace.selected = this.replaceFindSelected(this.replace.replacer.nextReplace);
      this.replaceHighLight();
    },
    replaceFindSelected(nextPlace) {
      for(let i in this.replace.points) {
        if(this.replace.points[i] === nextPlace) {
          return parseInt(i, 10);
        }
      }
    },
    replaceAll() {
      while(this.replace.replacer.Replace());
      this.sharedData.selectedFile.content = this.replace.replacer.str;
      this.reloadContent();
      this.replace.points = this.replace.replacer.GetPoints();
      this.replace.selected = 0;
    }
  }
}
</script>

<style>
#find-target-input, #replace-source-input, #replace-target-input {
  background: var(--editor-bar-background);
  border: none;
  margin: 10px;
}

div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-left-content {
  border: none !important;
}

div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-left-content {
  padding-right: 20px;
}

#input-bar > div.ant-tabs-bar.ant-tabs-left-bar {
  margin-left: -25px;
  height: 90px;
}
#point-hint-label {
  color: var(--c-warn);
}
#find-highlight-label {
  font-weight: bold;
  background: var(--c-found-background);
  color: var(--c-found-text);
}
#replace-source-label {
  font-weight: bold;
  background: var(--c-removed-text-background);
  color: var(--c-found-text);
  text-decoration: line-through;
}
#replace-target-label {
  font-weight: bold;
  background: var(--c-added-text-background);
  color: var(--c-found-text);
}
.result-item {
  background: var(--c-item-background);
  border: 1px solid var(--c-border);
  margin: 5px;
  padding: 5px 10px;
}
.selected {
  background: var(--c-selected-background);
}
</style>