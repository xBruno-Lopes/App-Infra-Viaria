export function ParseDMS(input) {
  let parts = input.split(/[^\d\w]+/);
  let data = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);

  return data;
}

function ConvertDMSToDD(degrees, minutes, seconds, miSeconds) {
  let dd =
    Number(degrees) +
    Number(minutes) / 60 +
    (Number(seconds) + Number(miSeconds) / 100) / 6000;

  return dd * -1;
}
