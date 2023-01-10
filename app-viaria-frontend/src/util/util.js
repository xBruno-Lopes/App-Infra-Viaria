export const formatarData = (data) => {
    
    let d = data.split("-")
    return d[2].substr(0,2)+"/"+d[1]+"/"+d[0];

}

export const traduzDefeito = (defeito) => {

    let dic = {
        crack: "Rachadura",
        patche: "Remendo",
        pothole: "Panela"
    }

    return dic[defeito];

}