<template>
  <div id="app">
<!--    <a-button type="primary" @click="toggleSidebar">Button></a-button>-->
<!--    <div>-->
<!--      <a-input-number id="inputNumber" v-model="value" :min="1" :max="10" @change="onChange" />-->
<!--      当前值：{{ value }}-->
<!--    </div>-->
    <a-layout>

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
        <a-layout-content>
          <multipane class="major-panel" layout="vertical">
            <div id="sidebar-container" class="pane" v-show="showing_sidebar !== null" :style="{ minWidth: '10%', width: '30%', maxWidth: '50%'}">
              sidebar
            </div>
            <multipane-resizer v-show="showing_sidebar !== null"></multipane-resizer>
            <div id="editor-container" class="pane" :style="{ flexGrow: 1 }">
              <div v-show="showing_editor_bar === 'dummy'">(dummy editor bar)</div>
              <div v-show="showing_editor_bar === 'start'" style="text-align: center; line-height: 60vh; height: 100%; margin: 10px auto">
                <a-row :gutter="100" align="middle" style="display:inline-block; width: 900px">
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-button @click="startEdit" class="start-btn">
                        <label>Import folder</label>
                        <p>Load all files<br>in the folder</p>
                      </a-button>
                    </div>
                  </a-col>
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-button @click="startEdit" class="start-btn">
                        <label>Select folder</label>
                        <p>Don't load files<br>in the folder</p>
                      </a-button>
                    </div>
                  </a-col>
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-button @click="startEdit" class="start-btn">
                        <label>Store files later</label>
                        <p class="warn">May lost data<br>before saving</p>
                      </a-button>
                    </div>
                  </a-col>
                </a-row>
              </div>
              <div v-show="showing_editor_bar === 'editor'"> <textarea id="editor"> editor </textarea> </div>
            </div>
          </multipane>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <div id="footer">
      ©2021-2021 sun123t2.com All rights reserved.
    </div>
  </div>
</template>

<script src="./App.js"></script>
