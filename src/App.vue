<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"

  //   mounted() {
  //     window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
  //     window.addEventListener("unload", e => this.unloadHandler(e));
  //   },
  //   destroyed() {
  //     window.removeEventListener("beforeunload", e =>
  //       this.beforeunloadHandler(e)
  //     );
  //     window.removeEventListener("unload", e => this.unloadHandler(e));
  //   },
  //   methods: {
  //     beforeunloadHandler() {
  //       this._beforeUnload_time = new Date().getTime();
  //     },
  //     unloadHandler(e) {
  //       this._gap_time = new Date().getTime() - this._beforeUnload_time;
  //       //判断是窗口关闭还是刷新
  //       if (this._gap_time <= 5) {
  //         localStorage.clear();
  //       }
  //     }
  //   }
};
</script>
<style>
.container {
  padding:40px 20px;
}
</style>
