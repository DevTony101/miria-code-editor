import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./assets/styles/global.css";

const app = createApp(App);

app.use(VueSweetalert2);

import highlight from "./directives/highlight";
app.directive("highlight", highlight);

const components = import.meta.glob('./components/base/Base*.vue', { eager: true });
for (const path in components) {
  const componentConfig: any = components[path];
  const componentName = upperFirst(
    camelCase(
      path.split('/').pop()!.replace(/\.\w+$/, '')
    )
  );
  app.component(componentName, componentConfig.default || componentConfig);
}

app.use(router);
app.use(store);
app.mount("#app");
