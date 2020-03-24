<template>
  <v-container>
    <Map />
  </v-container>
</template>

<script>
import Map from "@/components/Map";
export default {
  components: { Map },
  data() {
    return {
      mapStyle: "height: 100 vh"
    };
  }
};
</script>

<style></style>
