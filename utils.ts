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

export function loadingFiler(container: HTMLElement | null) {
  //document: The current HTMl, usage: Create new HTML => Loading Div with spinner
  //container: The HTML element to put the loading inside,
  if (!container) container = document.body!;

  var div = document.createElement("div");
  div.className = "loadingFilter";
  div.style.backgroundColor = "black";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.opacity = "0.2";
  div.style.position = "fixed";
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignContent = "center";
  div.style.flexWrap = "wrap";
  var spinner = document.createElement("div");
  spinner.className = "spinner-border";
  spinner.style.color = "white";
  div.appendChild(spinner);
  container.appendChild(div);
}
export function removeLoadingFilter(container: HTMLElement | null) {
  if (!container) container = document.body!;
  var temp = container.getElementsByClassName("loadingFilter");
  if (temp.length == 0) return;
  container.removeChild(temp[0]);
}