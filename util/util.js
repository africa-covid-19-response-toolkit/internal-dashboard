const toggleFullScreen = () => {
  let doc = window.document;
  let docEl = doc.documentElement;

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
    return true;
  } else {
    cancelFullScreen.call(doc);
    return false;
  }
};

const apiHost = "http://api.covid19.et";
// const apiHost = "https://capi.abren.tech";
// const apiHost = "http://localhost:9017";

const downloadGeoJson = async axios => {
  try {
    const result = await axios.get(
      "/resources/ethiopia_administrative_zones_full.json"
    );
    return result.data && result.data.length > 0 ? result.data : [];
  } catch (err) {
    console.log("cant download geojson... ", err);
  }
};

const downloadGeoJsonMinimized = async axios => {
  try {
    const result = await axios.get(
      "/resources/ethiopia_administrative_zones_full_mimimized.json"
    );
    return result.data && result.data.length > 0 ? result.data : [];
  } catch (err) {
    console.log("cant download geojson... ", err);
  }
};

export default {
  apiHost,
  toggleFullScreen,
  downloadGeoJson,
  downloadGeoJsonMinimized
};
