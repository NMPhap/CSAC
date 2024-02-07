import { isString } from "util";

export const compareDates = (d1: string, d2: string) => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
};


function stringToSlug(str: string) {
  // remove accents
  var from =
    "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđĐùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ";
  var to =
    "aaaaaaaaaaaaaaaaaeeeeeeeeeeedDuuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(from[i], to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
}
export function search(list: any[] | undefined, field: string, param: any): any[] {
  const result: any[] = [];
  if ( !list || list.length == 0) return [];
  const t = list.forEach((element) => {
    const data = element[field as keyof (typeof list)[0]];
    if (
      (isString(data) &&
        stringToSlug(data.toString().toLowerCase()).includes(
          stringToSlug(param.toString().toLowerCase())
        )) ||
      stringToSlug(data.toString().toLowerCase()) ==
        stringToSlug(param.toString().toLowerCase())
    )
      result.push(element);
    console.log();
  });
  return result;
}