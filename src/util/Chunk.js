export default function Chunk(arr, len) {
    let chunks = [], i = 0, n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}
