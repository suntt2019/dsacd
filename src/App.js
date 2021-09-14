import { Multipane, MultipaneResizer } from 'vue-multipane';
import Editor from './components/Editor.vue';
import StartPanel from "./components/StartPanel";
import './style/App.css';

// var sent_sidebar_warning = false;


export default {
    data() {
        return {
            showing_sidebar : null,
            showing_editor_bar: "start",
            sidebars: {
                "files": {
                    width: "10%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "encode-decode": {
                    width: "20%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "search-replace": {
                    width: "30%",
                    min_width: "10%",
                    max_width: "50%",
                    component: null,
                },
                "search+": {
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
            // editor_bars: {
            //     "dummy": {
            //         component: null,
            //     },
            //     "start": {
            //         component: null,
            //     },
            //     "editor": {
            //         component: null,
            //     },
            // },
            menu_keys: [],
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
            } // else if(!sent_sidebar_warning) {
            //     this.notification('warning', 'Please config work space first.',
            //         'The sidebar could only display after configuring the work space, please config your work space first.');
            //     sent_sidebar_warning = true;
            //     setTimeout(function () {
            //         console.log('finish timer');
            //         sent_sidebar_warning = false;
            //     }, 5000);
            // }
        },
        menuClose() {
            if(this.showing_sidebar !== null) {
                this.menuSwitch(this.showing_sidebar);
            }
        },
        switchEditorBar(key) {
            this.showing_editor_bar = key;
        },
        startEdit(e) {
            console.log(e);
            this.switchEditorBar("editor");
        },
        reloadWorkspace() {
            this.switchEditorBar("start");
            this.menuClose();
        },
        notification(type, message, description) {
            this.$notification[type]({
                message: message,
                description: description,
                duration: 5,
            });
        }
    },
    components: {
        Multipane,
        MultipaneResizer,
        Editor,
        StartPanel,
    },
};
