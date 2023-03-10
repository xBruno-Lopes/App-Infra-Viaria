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
    let view = "marks";

    let myWayPoints = [];
    let markers = [];
    let heatmaps = [];

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
              quantidade: e.attributes.quantidade,
              date: e.attributes.dataDeColeta,
              image: e.attributes.imagem.data.attributes.url,
            };
          });
        });
        myWayPoints = [];
        await defeitos.value.forEach((element) => {
          if (element.classe !== "no_defect") {
            myWayPoints.push({
              location: {
                lat: element.lat,
                lng: element.long,
              },
              stopover: false,
              classe: element.classe,
              quantidade: element.quantidade,
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

    async function putMarker(endereco, defeito, dataInicial, dataFinal, mapa) {
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

      await fecthData({
        rodovia: endereco,
        defeito: defeito,
        periodoInicial: dataInicial,
        periodoFinal: dataFinal,
      });
      let index = Math.floor(myWayPoints.length / 2);
      let center;
      if (myWayPoints.length !== 0) {
        center = myWayPoints[index].location;
        console.log(center);
        map.value.setCenter(new google.maps.LatLng(center));
        map.value.setZoom(16);
      } else {
        alert("Nenhum Resultado Encontrado!");
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

    function clearHeatMaps() {
      heatmaps.forEach((h) => {
        h.setMap(null);
      });
      heatmaps = [];
    }

    function viewHeatMap() {
      clearMarks();
      const gradient1 = ["rgba(0, 255, 0, 0)", "rgba(0, 255, 0, 1)"];
      const gradient2 = ["rgba(255, 255, 0, 0)", "rgba(255, 255, 0, 1)"];
      const gradient3 = ["rgba(255, 0, 0, 0)", "rgba(255, 0, 0, 1)"];

      let heatmap1 = new google.maps.visualization.HeatmapLayer({
        data: myWayPoints
          .filter((e) => e.quantidade <= 1)
          .map((e) => {
            return {
              location: new google.maps.LatLng(e.location.lat, e.location.lng),
              weight: 2,
            };
          }),
        map: map.value,
        gradient: gradient1,
        dissipating: true,
        opacity: 1,
        radius: 10,
      });
      let heatmap2 = new google.maps.visualization.HeatmapLayer({
        data: myWayPoints
          .filter((e) => e.quantidade > 1 && e.quantidade <= 3)
          .map((e) => {
            return {
              location: new google.maps.LatLng(e.location.lat, e.location.lng),
              weight: 4,
            };
          }),
        map: map.value,
        gradient: gradient2,
        dissipating: true,
        opacity: 1,
        radius: 20,
      });
      let heatmap3 = new google.maps.visualization.HeatmapLayer({
        data: myWayPoints
          .filter((e) => e.quantidade >= 4)
          .map((e) => {
            return {
              location: new google.maps.LatLng(e.location.lat, e.location.lng),
              weight: 6,
            };
          }),
        map: map.value,
        gradient: gradient3,
        dissipating: true,
        opacity: 1,
        radius: 10,
      });

      heatmaps.push(heatmap1);
      heatmaps.push(heatmap2);
      heatmaps.push(heatmap3);
    }

    function iniMap() {
      map.value = new google.maps.Map(mapDiv.value, {
        center: {
          lat: -5.181303,
          lng: -39.581477,
        },
        zoom: 16,
      });

      map.value.addListener("zoom_changed", () => {
        if (map.value.getZoom() < 16) {
          if (view === "marks") {
            view = "heatmaps";
            clearMarks();
            viewHeatMap();
          }
        }
        if (map.value.getZoom() >= 17) {
          if (view === "heatmaps") {
            view = "marks";
            clearHeatMaps();
            putMarker(
              dataStore.rodovia,
              dataStore.defeito,
              dataStore.periodoInicial,
              dataStore.periodoFinal,
              map.value
            );
          }
        }
      });

      watch(
        () => dataStore.getRodovia,
        () => {
          clearMarks();
          putMarker(
            dataStore.rodovia,
            dataStore.defeito,
            dataStore.periodoInicial,
            dataStore.periodoFinal,
            map.value
          );
        }
      );

      watch(
        () => dataStore.getDefeito,
        () => {
          clearMarks();
          putMarker(
            dataStore.rodovia,
            dataStore.defeito,
            dataStore.periodoInicial,
            dataStore.periodoFinal,
            map.value
          );
        }
      );
      watch(
        () => dataStore.getPeriodoInicial,
        () => {
          clearMarks();
          putMarker(
            dataStore.rodovia,
            dataStore.defeito,
            dataStore.periodoInicial,
            dataStore.periodoFinal,
            map.value
          );
        }
      );
      watch(
        () => dataStore.getPeriodoFinal,
        () => {
          clearMarks();
          putMarker(
            dataStore.rodovia,
            dataStore.defeito,
            dataStore.periodoInicial,
            dataStore.periodoFinal,
            map.value
          );
        }
      );
    }

    onMounted(async () => {
      await loader.load();
      await fecthData({
        rodovia: dataStore.rodovia,
        defeito: dataStore.defeito,
        periodoInicial: dataStore.periodoInicial,
        periodoFinal: dataStore.periodoFinal,
      });
      iniMap();
      putMarker(
        dataStore.rodovia,
        dataStore.defeito,
        dataStore.periodoInicial,
        dataStore.periodoFinal,
        map.value
      );
    });

    return { mapDiv, clearMarks };
  },
};
</script>
