declare function WorkerTask<K, T>(callback: (data: K) => void): {
    PostMessage: (...arg: K[]) => Promise<T>;
};

export { WorkerTask as default };
