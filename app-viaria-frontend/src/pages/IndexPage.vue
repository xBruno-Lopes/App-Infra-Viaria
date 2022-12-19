<template>
  <div ref="mapDiv" style="width: 100%; height: 92vh"></div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { useComponentStore } from "../stores/component-store";
import { RequestFactory } from "src/requests/RequestFactory";

const defeitosRequest = RequestFactory.get("defeitos");
const G_API_KEY = "AIzaSyB-cZpKsO8sWCfu0_KUiFrG8brl-RfxRqQ";
const dataStore = useComponentStore();

export default {
  name: "App",
  setup() {
    const loader = new Loader({ apiKey: G_API_KEY });
    const mapDiv = ref(null);
    let map = ref(null);
    let defeitos = ref(null);

    let myWayPoints = [];
    const ce368Banabuiu = { lat: -5.303956, lng: -38.858884 };
    const ce266Banabuiu = { lat: -5.303868, lng: -38.914725 };
    const ce265Quixada = { lat: -4.987478, lng: -39.029285 };
    const ce060Quixada = { lat: -4.946391, lng: -39.033091 };
    const ce025Fortaleza = { lat: -3.807639, lng: -38.461156 };
    const ce040Fortaleza = {
      lat: -3.9041116666666666,
      lng: -38.399253333333334,
    };

    async function fecthData() {
      await defeitosRequest.findAll().then((res) => {
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

      await defeitos.value.map((element) => {
        if (element.classe !== "sem-defeitos") {
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
    }

    function putMarker(endereco, mapa, markerYellow, makerBlue, center) {
      map.value.setCenter(new google.maps.LatLng(center.lat, center.lng));
      myWayPoints.forEach((element) => {
        if (element.endereco === endereco) {
          if (element.classe === "crack") {
            let marker = new google.maps.Marker({
              position: element.location,
              map: mapa,
              draggable: false,
              icon: markerYellow,
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
          } else {
            let marker = new google.maps.Marker({
              position: element.location,
              map: mapa,
              draggable: false,
              icon: makerBlue,
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
          }
        }
      });
    }

    function iniMap() {
      map.value = new google.maps.Map(mapDiv.value, {
        center: {
          lat: -5.30389,
          lng: -38.914779,
        },
        zoom: 17,
      });

      // const directionRenderer = new google.maps.DirectionsRenderer({
      //   draggable: false,
      //   suppressMarkers: true,
      // });

      // const directionService = new google.maps.DirectionsService();

      // directionRenderer.setMap(map.value);
      // directionService
      //   .route({
      //     origin: {
      //       lat: -3.8987483333333333,
      //       lng: -38.402195,
      //     },
      //     destination: {
      //       lat: -3.8987483333333333,
      //       lng: -38.402195,
      //     },
      //     travelMode: google.maps.TravelMode.DRIVING,
      //   })
      //   .then((response) => {
      //     directionRenderer.setDirections(response);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      var pinColorY = "#FFFF00";
      var pinColorB = "#0000FF";

      // Pick your pin (hole or no hole)
      var pinSVGHole =
        "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
      var labelOriginFilled = new google.maps.Point(12, 9);

      var markerImageYellow = {
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 2,
        fillColor: pinColorY,
        strokeWeight: 2,
        strokeColor: "black",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      var markerImageBlue = {
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(12, 17),
        fillOpacity: 2,
        fillColor: pinColorB,
        strokeWeight: 2,
        strokeColor: "black",
        scale: 1.5,
        labelOrigin: labelOriginFilled,
      };

      watch(
        () => dataStore.getCEBnb,
        () => {
          if (dataStore.getCEBnb === "CE-368") {
            putMarker(
              dataStore.ceBanabuiu,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce368Banabuiu
            );
          } else {
            putMarker(
              dataStore.ceBanabuiu,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce266Banabuiu
            );
          }
        }
      );
      watch(
        () => dataStore.getCEQui,
        () => {
          if (dataStore.getCEQui === "CE-060") {
            putMarker(
              dataStore.ceQuixada,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce060Quixada
            );
          } else {
            putMarker(
              dataStore.ceQuixada,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce265Quixada
            );
          }
        }
      );

      watch(
        () => dataStore.getCEFor,
        () => {
          if (dataStore.getCEFor === "CE-025") {
            putMarker(
              dataStore.ceFortaleza,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce025Fortaleza
            );
          } else {
            putMarker(
              dataStore.ceFortaleza,
              map.value,
              markerImageYellow,
              markerImageBlue,
              ce040Fortaleza
            );
          }
        }
      );
    }

    onMounted(async () => {
      await loader.load();
      await fecthData();
      iniMap();
    });

    return { mapDiv };
  },
};
</script>
