// Code from https://github.com/NGnius/PowerTools/blob/dev/src/python.ts
import { ServerAPI } from "decky-frontend-lib";

var server: ServerAPI | undefined = undefined;

export function setServer(s: ServerAPI) {
  server = s;
}

export function resolve(promise: Promise<any>, setter: any) {
  (async function () {
    let data = await promise;
    if (data.success) {
      console.debug("Got resolved", data, "promise", promise);
      setter(data.result);
    } else {
      console.warn("Resolve failed:", data, "promise", promise);
    }
  })();
}

export function execute(promise: Promise<any>) {
  (async function () {
    let data = await promise;
    if (data.success) {
      console.debug("Got executed", data, "promise", promise);
    } else {
      console.warn("Execute failed:", data, "promise", promise);
    }
  })();
}

export async function getSetting<TSetting>(key: string, Default: TSetting) {
  let res = await server!.callPluginMethod<{ key: string; default: TSetting }, TSetting>("getSetting", { key: key, default: Default });

  if (res.success) {
    return res.result;
  }

  console.warn("getSetting failed", key, "response", res);
  return Default;
}

export async function setSetting(key: string, value: any) {
  let res = await server!.callPluginMethod<{ key: string; value: any }, string>("setSetting", { key: key, value: value });

  if (res.success) {
    return true;
  }

  console.warn("setSetting failed", key, "response", res);
  return false;
}

export async function commit() {
  let res = await server!.callPluginMethod<{}, string>("commit", {});

  if (res.success) {
    return true;
  }

  console.warn("commit failed", res);
  return false;
}

export async function read() {
  let res = await server!.callPluginMethod<{}, string>("read", {});

  if (res.success) {
    return true;
  }

  console.warn("read failed", res);
  return false;
}
