interface YtsrResponse {
    type: string,
    title: string,
    link: string,
    thumbnail: string,
    author: {
        name: string,
        ref: string,
        verified: boolean,
    },
    description: string,
    views: number,
    duration: string,
    uploaded_at: string,
}

export default YtsrResponse;
