export function paramsErrorMessage(param: string): string {
  return `Missing request params: ${param}`;
}

export function bodyErrorMessage(body: string): string {
  return `Missing ${body} in body request`;
}
