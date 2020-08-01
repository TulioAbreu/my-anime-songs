export interface ProgressCallbacks {
    onStart: () => void,
    onProgress: () => void,
    onFinish: () => void,
}
