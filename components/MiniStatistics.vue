<template>
  <v-card tile hover :color="color">
    <v-card-text class="pa-0">
      <v-container class="pa-0">
        <div class="layout row ma-0">
          <div class="sm4 xs4 flex text-sm-center py-3 white--text" :class="color">
            <div class="headline">{{ title }}</div>
          </div>
          <div class="sm8 xs8 flex text-sm-center py-3 white--text">
            <div class="caption">{{ subTitle }}</div>
          </div>
        </div>
      </v-container>
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
