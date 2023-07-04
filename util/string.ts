export function urlToLink(str: string): string {
  const re = /^(f|ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/g;

  return str.replace(re, (website) => {
    return "<a href='" + website + "' target='_blank'>" + website + '</a>';
  });
}
