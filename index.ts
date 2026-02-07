export function WorkerTask(callback: (data: any) => void) {
    function PostMessage<T>(...arg : any[]): Promise<T> {

        const param = arg.length === 1 && !Array.isArray(arg[0]) && typeof arg[0] === "object" ? arg[0] : arg

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
                    `,
                ],
                {
                    type: "application/javascript",
                },
            );

            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);

            worker.onmessage = (e) => {
                if (e.data?.__error) {
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
