declare function WorkerTask<T>(callback: (data: any) => Promise<T>): {
    PostMessage: (...arg: any[]) => Promise<T>;
};

export { WorkerTask as default };
