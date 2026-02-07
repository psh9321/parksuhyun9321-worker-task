// index.ts
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
export {
  WorkerTask
};
