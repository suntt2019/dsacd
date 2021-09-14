<template>
  <div id="app">
    <a-layout>
<!--header-->
      <a-layout-header id="header">
        <a-tooltip placement="right" v-if="showing_editor_bar === 'editor'">
          <template slot="title">
            <span>Click here to reopen a folder.<br>(After saving the operating folder)</span>
          </template>
          <a-icon id="reload-button" :style="{fontSize: '20px'}" type="folder-open" @click="reloadWorkspace"/>
        </a-tooltip>
        <div id="header-title">
          <label>DSACD</label>
        </div>
      </a-layout-header>
<!--menu-->
      <a-layout>
        <a-layout-sider width = 64 >
          <div style="width: 64px">
            <a-tooltip placement="right">
              <template slot="title" v-if="showing_editor_bar !== 'editor'">
                <span>Sidebar is disabled <br> before opening folder.</span>
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
                <a-menu-item key="encode-decode" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="barcode" />
                </a-menu-item>
                <a-menu-item key="search-replace" @click="menuClick">
                  <a-icon :style="{fontSize: '30px'}" type="search" />
                </a-menu-item>
                <a-menu-item key="search+" @click="menuClick">
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
            <div id="sidebar-container" class="pane" v-show="showing_sidebar !== null" :style="{ minWidth: '10%', width: '30%', maxWidth: '50%'}">
              sidebar
            </div>

            <multipane-resizer v-show="showing_sidebar !== null"></multipane-resizer>

<!--editor-bar-->
            <div id="editor-container" class="pane" :style="{ flexGrow: 1 }">
              <div v-show="showing_editor_bar === 'dummy'">(dummy editor bar)</div>
              <div v-show="showing_editor_bar === 'start'"> <StartPanel :start-edit="startEdit"></StartPanel> </div>
              <div v-show="showing_editor_bar === 'editor'"> <Editor></Editor> </div>
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
