import Request from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Request.get(`${resource}?populate=imagem`);
  },

  findOne(id) {
    return Request.get(`${resource}/${id}?populate=imagem`);
  },
  findByClasse(classe) {
    console.log(classe);
    let data = classe;
    let defeitos = [];

    data.forEach((element) => {
      if (element === "Rachadura") defeitos.push("crack");
      else if (element === "Remendo") defeitos.push("patch");
      else if (element === "Panela") defeitos.push("pothole");
    });

    return Request.get(
      `${resource}?filters[classe][$contains]=${defeitos.toString()}`
    );
  },

  findByCidadeAndRodovia(filters) {
    let rodovia = filters.rodovia.replace(/[\s -]/g, "");
    let defeito = filters.defeito;
    let dataInicial = "";
    let dataFinal = "";

    if (rodovia === "Selecione") rodovia = "";

    if (defeito === "Selecione") defeito = "";
    else if (defeito === "Rachadura") defeito = "crack";
    else if (defeito === "Remendo") defeito = "patch";
    else if (defeito === "Panela") defeito = "pothole";

    if (filters.periodoInicial !== "" && filters.periodoFinal !== "") {
      var diaIni = filters.periodoInicial.split("/")[0];
      var mesIni = filters.periodoInicial.split("/")[1];
      var anoIni = filters.periodoInicial.split("/")[2];

      let aux =
        anoIni +
        "-" +
        ("0" + mesIni).slice(-2) +
        "-" +
        ("0" + diaIni).slice(-2);

      dataInicial = `&filters[$and][3][dataDeColeta][$gte]=${aux}`;

      var diaFin = filters.periodoFinal.split("/")[0];
      var mesFin = filters.periodoFinal.split("/")[1];
      var anoFin = filters.periodoFinal.split("/")[2];

      let aux2 =
        anoFin +
        "-" +
        ("0" + mesFin).slice(-2) +
        "-" +
        ("0" + diaFin).slice(-2);

      dataFinal = `&filters[$and][4][dataDeColeta][$lte]=${aux2}`;

      return Request.get(
        `${resource}?populate=imagem&filters[$and][1][endereco][$contains]=${rodovia}&filters[$and][2][classe][$contains]=${defeito}` +
          `${dataInicial}` +
          `${dataFinal}`
      );
    }
    if (filters.periodoInicial !== "") {
      var diaIni = filters.periodoInicial.split("/")[0];
      var mesIni = filters.periodoInicial.split("/")[1];
      var anoIni = filters.periodoInicial.split("/")[2];

      let aux =
        anoIni +
        "-" +
        ("0" + mesIni).slice(-2) +
        "-" +
        ("0" + diaIni).slice(-2);
      console.log(aux);
      dataInicial = `&filters[$and][3][dataDeColeta][$gte]=${aux}`;
      return Request.get(
        `${resource}?populate=imagem&filters[$and][1][endereco][$contains]=${rodovia}&filters[$and][2][classe][$contains]=${defeito}` +
          `${dataInicial}`
      );
    }
    if (filters.periodoFinal !== "") {
      var diaFin = filters.periodoFinal.split("/")[0];
      var mesFin = filters.periodoFinal.split("/")[1];
      var anoFin = filters.periodoFinal.split("/")[2];

      let aux =
        anoFin +
        "-" +
        ("0" + mesFin).slice(-2) +
        "-" +
        ("0" + diaFin).slice(-2);
      dataFinal = `&filters[$and][3][dataDeColeta][$lte]=${aux}`;
      return Request.get(
        `${resource}?populate=imagem&filters[$and][1][endereco][$contains]=${rodovia}&filters[$and][2][classe][$contains]=${defeito}` +
          `${dataFinal}`
      );
    }

    return Request.get(
      `${resource}?populate=imagem&filters[$and][1][endereco][$contains]=${rodovia}&filters[$and][2][classe][$contains]=${defeito}`
    );
  },
};
