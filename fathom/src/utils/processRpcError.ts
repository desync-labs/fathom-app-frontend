export function processRpcError(e: any) {
  let error = e.toString();
  if (error.indexOf('Internal JSON-RPC error.') > -1) {
    error = error.replace('\n', '').replace('Error: ', '').replace('Internal JSON-RPC error.', '');
    return JSON.parse(error);
  } else {
    return e;
  }
}