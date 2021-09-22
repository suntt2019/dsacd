<template>
  <div>
    <a-space direction="vertical" style="width:100%">
      Content
      <a-textarea id="content-textarea" v-model="content" :autoSize="{minRows:4, maxRows:4}"></a-textarea>
      <a-row type="flex" justify="end">

        <a-tooltip placement="bottom">
          <a-button @click="load">&lt;=Load=</a-button>
          <template slot="title">
            <div style="text-align: center">
              <span>Load text from the editor</span>
              <br>
              <span>content &lt;-- editor</span>
            </div>
          </template>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <a-button @click="store">=Store=&gt;</a-button>
          <template slot="title">
            <div style="text-align: center">
              <span>Store text to the editor</span>
              <br>
              <span>content --&gt; editor</span>
            </div>
          </template>
        </a-tooltip>
      </a-row>
      Code
      <a-textarea id="code-textarea" v-model="code" :autoSize="{minRows:4, maxRows:4}" @change="codeChange"></a-textarea>
      Code+base64
      <a-textarea id="base64-textarea" v-model="base64" :autoSize="{minRows:4, maxRows:4}" @change="base64Change"></a-textarea>
      CodingMap
      <a-textarea id="map-textarea" v-model="codingMap" :autoSize="{minRows:4, maxRows:4}"></a-textarea>
    </a-space>
    <a-divider/>
    <a-space direction="vertical" style="width:100%; text-align: center">
      <a-space>
        <a-button size="large" @click="encode">Encode</a-button>
        <a-button size="large" @click="decode">Decode</a-button>
      </a-space>
      <a-button size="large" @click="revealHuffmanTree">Reveal huffman tree</a-button>
      <a-modal
          :width="'1400px'"
          v-model="showHuffmanTree"
          title="Huffman Tree"
          @ok="()=>{this.showHuffmanTree = false;}"
          :cancel-button-props="{ style: {display: 'none'} }"
      >
        <div id="mountNode"></div>
      </a-modal>
    </a-space>
  </div>
</template>

<script>
import {BuildTree, ImportTree, Encode, Decode} from '../js/huffman';
import {ZeroOneStringToArr, ArrToZeroOneString, base64} from '../js/base64';
import {RevealGraph} from "../js/graph";

export default {
  name: "EncodingPanel",
  props: ['getSelected', 'setSelected'],
  data() {
    return {
      content: 'content',
      code: 'Initial code',
      base64: 'base64',
      codingMap: 'codingMap',
      tree: null,
      showHuffmanTree: false,
    }
  },
  methods: {
    load() {
      this.content = this.getSelected();
    },
    store() {
      this.setSelected(this.content);
    },
    encode() {
      if(this.content === '') {
        this.$message.error('Content is empty', 0.2);
        return;
      }
      this.tree = BuildTree(this.content);
      this.codingMap = this.tree.CodingMapString();
      this.code = Encode(this.content, this.tree);
      this.codeToBase64(this.code);
      this.$message.success('Encoding succeed!', 0.2);
    },
    decode() {
      this.tree = ImportTree(this.codingMap);
      if(this.tree === null) {
        this.$message.error('Invalid coding map', 0.2);
        return;
      }
      this.content = Decode(this.code, this.tree);
      this.$message.success('Decoding succeed!', 0.2);
    },
    revealHuffmanTree() {
      this.showHuffmanTree = true;
      console.log(this.tree.GetHeight());
      let data = this.tree.ToGraphData();
      console.log(this.tree);
      console.log(data);
      setTimeout(()=>{
        document.getElementById('mountNode').innerHTML = '';
        // data = {
        //   // 点集
        //   nodes: [
        //     {
        //       id: 'node1',
        //       x: 100,
        //       y: 300,
        //     },
        //     {
        //       id: 'node2',
        //       x: 300,
        //       y: 200,
        //     },
        //   ],
        //   // 边集
        //   edges: [
        //     // 表示一条从 node1 节点连接到 node2 节点的边
        //     {
        //       source: 'node1',
        //       target: 'node2',
        //     },
        //   ],
        // };
        RevealGraph(data);
      }, 1);
    },
    codeToBase64(code) {
      let arr = ZeroOneStringToArr(code);
      if(arr === null) {
        this.base64 = 'Invalid Code';
      } else {
        this.base64 = base64.Encode(arr);
      }
    },
    base64ToCode(b64) {
      let arr = base64.Decode(b64);
      if(arr === null) {
        this.code = 'Invalid Base64 code';
      } else {
        let code = ArrToZeroOneString(arr)
        if(code === null) {
          this.code = 'Invalid Base64 code';
        } else {
          this.code = code;
        }
      }
    },
    codeChange() {
      this.codeToBase64(this.code);
    },
    base64Change() {
      this.base64ToCode(this.base64);
    }
  }
}
</script>

<style>

textarea {
  width: 100%;
  background: var(--editor-bar-background) !important;
  border: none;
  padding: 5px 10px;
}
.ant-message-notice-content {
  background-color: var(--c-common-background) !important;
}
</style>
