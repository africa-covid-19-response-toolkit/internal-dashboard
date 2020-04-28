import Vue from "vue";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import GmapCluster from 'vue2-google-maps/dist/components/cluster';
import "leaflet/dist/leaflet.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component('GmapCluster', GmapCluster);
