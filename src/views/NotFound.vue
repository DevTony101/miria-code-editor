<template>
  <div>
    <img v-bind:src="source" alt="404" />
    <h1>
      It appears that the {{ resource }} that you are looking for is nowhere to
      be found!
    </h1>
  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: "NotFound",
    mounted() {
      this.fetchImage();
    },
    props: {
      resource: {
        type: String,
        required: true,
      },
    },
    data: function () {
      return {
        source: "",
      };
    },
    methods: {
      fetchImage: function () {
        let accentColor = getComputedStyle(document.body)
          .getPropertyValue("--color-accent")
          .substr(3);
        console.log("Thanks to blairlee227 for the image!");
        this.source = `https://illustatus.herokuapp.com/?title=&fill=%23${accentColor}`;
      },
    },
    computed: mapState(["theme"]),
    watch: {
      // eslint-disable-next-line no-unused-vars
      theme: function (value, oldValue) {
        this.fetchImage();
      },
    },
  };
</script>

<style scoped>
  div {
    width: 80%;
    margin: auto;
  }

  h1 {
    text-align: center;
  }
</style>
