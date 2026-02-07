"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  WorkerTask: () => WorkerTask
});
module.exports = __toCommonJS(index_exports);
function WorkerTask(callback) {
  function PostMessage(...arg) {
    const param = arg.length === 1 && !Array.isArray(arg[0]) && typeof arg[0] === "object" ? arg[0] : arg;
    return new Promise((resolve, reject) => {
      const blob = new Blob(
        [
          `
                        self.onmessage = async (e) => {
                            try {
                                const result = await (${callback.toString()})(e.data);
                                self.postMessage(result);
                            } catch (err) {
                                self.postMessage({ __error: err?.message });
                            }
                        };
                    `
        ],
        {
          type: "application/javascript"
        }
      );
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      worker.onmessage = (e) => {
        var _a;
        if ((_a = e.data) == null ? void 0 : _a.__error) {
          reject(e.data.__error);
        } else {
          resolve(e.data);
        }
        worker.terminate();
        URL.revokeObjectURL(url);
      };
      worker.onerror = (err) => {
        reject(err);
        worker.terminate();
        URL.revokeObjectURL(url);
      };
      worker.postMessage(param);
    });
  }
  return { PostMessage };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkerTask
});
