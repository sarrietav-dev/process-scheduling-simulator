export function narrowNumber(number: number | number[]) {
  return typeof number === "number" ? number : number[0];
}
