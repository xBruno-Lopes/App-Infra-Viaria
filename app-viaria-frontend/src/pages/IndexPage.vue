<template>
  <div ref="mapDiv" style="width: 100%; height: 92vh"></div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { useComponentStore } from "../stores/component-store";
import { RequestFactory } from "src/requests/RequestFactory";

const defeitosRequest = RequestFactory.get("defeitos");
const dataStore = useComponentStore();

export default {
  name: "App",
  setup() {
    const G_API_KEY = process.env.G_API_KEY;
    const loader = new Loader({
      apiKey: G_API_KEY,
      libraries: ["places", "visualization"],
    });
    const mapDiv = ref(null);
    let map = ref(null);
    let defeitos = ref(null);
    // let filters = ref({
    //   cidade: "Fortaleza, CE",
    //   rodovia: "CE - 040",
    //   defeito: "Rachadura",
    // });

    let myWayPoints = [];
    let markers = [];

    async function fecthData(filters) {
      if (filters.rodovia !== "Selecione" || filters.defeito !== "Selecione") {
        dataStore.nenhumFiltroSelecionado = false;
        await defeitosRequest.findByCidadeAndRodovia(filters).then((res) => {
          const data = res.data.data;
          defeitos.value = data.map((e) => {
            return {
              endereco: e.attributes.endereco,
              lat: e.attributes.latitude,
              long: e.attributes.longitude,
              classe: e.attributes.classe,
              date: e.attributes.dataDeColeta,
              image: e.attributes.imagem.data[0].attributes.url,
            };
          });
        });
        myWayPoints = [];
        await defeitos.value.map((element) => {
          if (element.classe !== "no_defect") {
            myWayPoints.push({
              location: {
                lat: element.lat,
                lng: element.long,
              },
              stopover: false,
              classe: element.classe,
              endereco: element.endereco,
              dataDeColeta: element.date,
              image: element.image,
            });
          }
        });
      } else {
        clearMarks();
        myWayPoints = [];
        dataStore.nenhumFiltroSelecionado = true;
        dataStore.markerClasse = null;
      }
    }

    async function putMarker(endereco, defeito, mapa) {
      // map.value.setCenter(new google.maps.LatLng(center.lat, center.lng));

      var pinColorYellow = "#FFFF00";
      var pinColorRed = "#FF0000";
      var pinColorOrange = "#FFA500";

      // Pick your pin (hole or no hole)
      var pinSVGHole =
        "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
      var labelOriginFilled = new google.maps.Point(12, 9);

      var markerImageYellow = {
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 2,
        fillColor: pinColorYellow,
        strokeWeight: 2,
        strokeColor: "black",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      var markerImageOrange = {
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 2,
        fillColor: pinColorOrange,
        strokeWeight: 2,
        strokeColor: "black",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      var markerImageRed = {
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 2,
        fillColor: pinColorRed,
        strokeWeight: 2,
        strokeColor: "black",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      await fecthData({ rodovia: endereco, defeito: defeito });
      let index = Math.floor(myWayPoints.length / 2);
      let center;
      if (myWayPoints.length !== 0) {
        center = myWayPoints[index].location;

        map.value.setCenter(new google.maps.LatLng(center));
        map.value.setZoom(13);
      }

      myWayPoints.forEach((element) => {
        let icon =
          element.classe === "patche"
            ? markerImageYellow
            : element.classe === "crack"
            ? markerImageOrange
            : markerImageRed;

        let marker = new google.maps.Marker({
          position: element.location,
          map: mapa,
          draggable: false,
          icon: icon,
        });

        marker.addListener("click", () => {
          dataStore.markerDrawerControl();
          dataStore.fecthMarkerData(
            element.classe,
            element.dataDeColeta,
            element.endereco,
            element.image,
            element.location
          );
        });

        markers.push(marker);
      });
    }

    function clearMarks() {
      markers.forEach((m) => {
        m.setMap(null);
      });
      markers = [];
    }

    function iniMap() {
      map.value = new google.maps.Map(mapDiv.value, {
        center: {
          lat: -5.181303,
          lng: -39.581477,
        },
        zoom: 13,
      });

      watch(
        () => dataStore.getCidade,
        () => {
          clearMarks();
          dataStore.rodovia = "Selecione";
          dataStore.defeito = "Selecione";
          putMarker(dataStore.rodovia, dataStore.defeito, map.value);
        }
      );

      watch(
        () => dataStore.getRodovia,
        () => {
          clearMarks();
          putMarker(dataStore.rodovia, dataStore.defeito, map.value);
        }
      );

      watch(
        () => dataStore.getDefeito,
        () => {
          clearMarks();
          putMarker(dataStore.rodovia, dataStore.defeito, map.value);
        }
      );
    }

    onMounted(async () => {
      await loader.load();
      await fecthData({
        rodovia: dataStore.dados.endereco,
        defeito: dataStore.dados.defeito,
      });
      iniMap();
      putMarker(dataStore.dados.endereco, dataStore.dados.defeito, map.value);
    });

    return { mapDiv, clearMarks };
  },
};
</script>
