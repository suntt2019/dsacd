import { Multipane, MultipaneResizer } from 'vue-multipane/src/index.js';
import Editor from './components/Editor.vue';
import StartPanel from "./components/StartPanel";
import FileTree from "./components/FileTree";
import FileButtons from './components/FileButtons';
import './style/App.css';

export default {
    mounted() {
        // this.editor = this.$refs.editor;
    },
    data() {
        return {
            showing_sidebar : null,
            showing_editor_bar: "start",
            sidebars: {
                "files": {
                    width: "20%",
                    min_width: "200px",
                    max_width: "50%",
                    component: null,
                },
                "encode_decode": {
                    width: "20%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "search_replace": {
                    width: "30%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "search_plus": {
                    width: "40%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "frequency": {
                    width: "50%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
            },
            menu_keys: [],
            sharedData: {
                fileTree: { // empty tree
                    root: {
                        name: 'Empty tree',
                    }
                },
                selectedFile: {
                    content: 'Default file content',
                    Saved() {}
                },
            },
            title: 'DSACD',
        };
    },
    methods: {
        menuSwitch(key) {
            const sidebar_container = document.getElementById('sidebar-container');
            if(this.showing_sidebar !== null) { // showing before
                this.sidebars[this.showing_sidebar].width = sidebar_container.style.width;
            }
            if(this.menu_keys.length === 1 && this.showing_sidebar === key) { // close
                this.showing_sidebar = null;
            } else {  // open / change
                sidebar_container.style.width = this.sidebars[key].width;
                sidebar_container.style.minWidth = this.sidebars[key].min_width;
                sidebar_container.style.maxWidth = this.sidebars[key].max_width;
                this.showing_sidebar = key;
            }
            // update menu_keys to consist with showing_sidebar
            if(this.showing_sidebar === null) {
                this.menu_keys = [];
            } else {
                this.menu_keys = [this.showing_sidebar];
            }
        },
        menuClick(e) {
            if(this.showing_editor_bar === 'editor') {
                this.menuSwitch(e.key);
            }
        },
        menuClose() {
            if(this.showing_sidebar !== null) {
                this.menuSwitch(this.showing_sidebar);
            }
        },
        switchEditorBar(key) {
            this.showing_editor_bar = key;
        },
        startEdit() {
            this.switchEditorBar("editor");
        },
        reloadWorkspace() {
            this.switchEditorBar("start");
            this.menuClose();
        },
        fileOnSelect(key, e) {
            this.$refs.editor.storeContent();
            this.sharedData.selectedFile = e.node.dataRef;
            // this.title = '(loading) ' + 'DSACD - ' + this.sharedData.selectedFile.name + ' (loading)';
            this.sharedData.selectedFile.Load().then(()=>{
                this.$forceUpdate()
                this.$refs.editor.reloadContent();
                this.title = 'DSACD - ' + this.sharedData.selectedFile.title;
            })
        },
    },
    components: {
        Multipane,
        MultipaneResizer,
        Editor,
        StartPanel,
        FileTree,
        FileButtons,
    },
};
