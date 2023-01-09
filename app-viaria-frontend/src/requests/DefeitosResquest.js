import Request from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Request.get(`${resource}?populate=imagem`);
  },

  findOne(id) {
    return Request.get(`${resource}/${id}?populate=imagem`);
  },

  findByCidadeAndRodovia(filters){
    let cidade = filters.cidade;
    let rodovia = filters.rodovia;
    let defeito = filters.defeito;

    if(cidade === "Selecione")
      cidade = ""

    if(rodovia === "Selecione")
      rodovia = ""

    if(defeito === "Selecione")
       defeito = ""
    else if(defeito === "Rachadura")
      defeito = "crack"
    else if(defeito === "Remendo")
      defeito = "patche"    
    else if(defeito === "Panela")
      defeito = "pothole"

    return Request.get(`${resource}?filters[$and][0][cidade][$contains]=${cidade}&filters[$and][1][endereco][$contains]=${rodovia}&}&filters[$and][2][classe][$contains]=${defeito}&populate=imagem`);
  }
};
