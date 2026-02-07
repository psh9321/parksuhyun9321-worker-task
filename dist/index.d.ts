declare function WorkerTask(callback: (data: any) => void): {
    PostMessage: <T>(...arg: any[]) => Promise<T>;
};

export { WorkerTask as default };
