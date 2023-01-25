export const formatarData = (data) => {
  let d = data.split("-");
  return d[2].substr(0, 2) + "/" + d[1] + "/" + d[0];
};

export const traduzDefeito = (defeito) => {
  let aux = defeito.split(",");
  let defeitos = "";
  aux.forEach((element) => {
    let dic = {
      crack: "Rachadura",
      patch: "Remendo",
      pothole: "Panela",
    };
    defeitos = defeitos + " - " + dic[element];
  });

  return defeitos;
};
