<template>
  <v-card tile hover height="54" :color="color">
    <v-card-text class="pa-0">
      <div class="layout row ma-0">
        <div
          style="text-align:center; height=100%;"
          :class="color"
          class="sm4 xs4 flex text-sm-center white--text display-1 my-auto"
        >{{ title }}</div>
        <div class="sm8 caption xs8 flex text-sm-center py-3 white--text">{{ subTitle }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subTitle: String,
    color: String
  }
};
</script>
