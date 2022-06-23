import Vue from "vue";
import VpNav from "../src/index.js";
import App from "./App.vue";

Vue.use(VpNav);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
