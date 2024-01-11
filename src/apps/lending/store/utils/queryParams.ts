export const setQueryParameter = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set(key, value);
    const newRelativePathQuery =
      window.location.pathname + "?" + urlSearchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
};

export const getQueryParameter = (key: string) => {
  if (typeof window !== "undefined" && "URLSearchParams" in window) {
    const proxy = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    });
    return (proxy as unknown as { [key: string]: string })[key];
  }
  return;
};

export const getAllQueryParameters = () => {
  if (typeof window !== "undefined" && "URLSearchParams" in window) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
  }
  return;
};
