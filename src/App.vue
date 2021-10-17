<template>
  <div id="app">
    <a-layout>
<!--header-->
      <a-layout-header id="header">
        <a-tooltip placement="right" v-if="showing_editor_bar !== 'start'">
          <template slot="title">
            <span>Click here to reopen a folder.<br>(After saving the operating folder)</span>
          </template>
          <a-icon id="reload-button" :style="{fontSize: '20px'}" type="left-circle" @click="checkReopen"/>
          <a-modal
            v-model="showUnsavedConfirm"
            title="Abort unsaved Changes?"
          >
            There are some unsaved changes, are you sure you want to reopen another folder without saving them?
            <template slot="footer">
              <a-button key="save" @click="()=>{this.$refs.fileButtons.saveFiles(); reloadWorkspace();this.showUnsavedConfirm = false;}">
                Save all
              </a-button>
              <a-button key="notSave" @click="()=>{reloadWorkspace();this.showUnsavedConfirm = false;}">
                Don't save
              </a-button>
              <a-button key="cancel" @click="()=>{this.showUnsavedConfirm = false;}">
                Cancel
              </a-button>
            </template>
          </a-modal>
        </a-tooltip>
        <div id="header-title">
          <label>{{title}}</label>
        </div>
      </a-layout-header>
<!--menu-->
      <a-layout>
        <a-layout-sider width = 64 >
          <div style="width: 64px">
            <a-tooltip placement="right">
              <template slot="title" v-if="showing_editor_bar === 'start'">
                <span>Sidebar is disabled <br> please open a folder first.</span>
              </template>
              <a-menu id="menu"
                  :default-selected-keys="[]"
                  :selected-keys="menu_keys"
                  :inlineCollapsed="true"
                  mode="inline"
                  theme="dark"
              >
                <a-menu-item key="files" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="file" />
                </a-menu-item>
                <a-menu-item key="encode_decode" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="barcode" />
                </a-menu-item>
                <a-menu-item key="search_replace" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="search" />
                </a-menu-item>
                <a-menu-item key="search_plus" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="file-search" />
                </a-menu-item>
                <a-menu-item key="frequency" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="bar-chart" />
                </a-menu-item>
              </a-menu>
            </a-tooltip>
          </div>
        </a-layout-sider>
<!--major-panel-->
        <a-layout-content>
          <multipane class="major-panel" layout="vertical">
<!--sidebar-->
            <div id="sidebar-container" class="pane" v-show="showing_sidebar !== null" :style="{ minWidth: '10%', width: '30%', maxWidth: '50%', overflow: 'auto'}">
              <div v-show="showing_sidebar === 'files'">
                <FileButtons ref="fileButtons" :shared-data="sharedData" :editorSyncSaved="editorSyncSaved"></FileButtons>
                <a-divider />
                <FileTree :shared-data="sharedData" :checkout-file="checkoutFile"></FileTree>
              </div>
              <div v-show="showing_sidebar === 'encode_decode'">
                <EncodingPanel :get-selected="editorGetSelected" :set-selected="editorSetSelected"></EncodingPanel>
              </div>
              <div v-show="showing_sidebar === 'search_replace'">
                <FindAndReplace ref="findAndReplace" :shared-data="sharedData" :store-content="editorStoreContent" :reload-content="editorReloadContent" :set-last-selected="editorSetLastSelected"></FindAndReplace>
              </div>
              <div v-show="showing_sidebar === 'search_plus'">
                <AdvancedSearch :shared-data="sharedData" :set-last-selected="editorSetLastSelected" :checkout-file="checkoutFile"></AdvancedSearch>
              </div>
              <div v-show="showing_sidebar === 'frequency'">
                <Frequency :shared-data="sharedData" :set-last-selected="editorSetLastSelected" :checkout-file="checkoutFile"></Frequency>
              </div>
            </div>
            <multipane-resizer v-show="showing_sidebar !== null"></multipane-resizer>

<!--editor-bar-->
            <div id="editor-container" class="pane" :style="{ flexGrow: 1 }">
              <div v-show="showing_editor_bar === 'dummy'"> <DummyEditorBar></DummyEditorBar> </div>
              <div v-show="showing_editor_bar === 'start'"> <StartPanel :start-edit="startEdit" :shared-data="sharedData"></StartPanel> </div>
              <div v-show="showing_editor_bar === 'editor'"> <Editor ref="editor" :shared-data="sharedData" :text-change="editorTextChange"></Editor> </div>
              <div v-show="showing_editor_bar === 'dirViewer'"> <DirViewer :selected="sharedData.selectedFile"></DirViewer> </div>
            </div>
          </multipane>
        </a-layout-content>
      </a-layout>
    </a-layout>
<!--footer-->
    <div id="footer">
      ©2021-2021 sun123t2.com All rights reserved.
    </div>
  </div>
</template>

<script src="./App.js"></script>
