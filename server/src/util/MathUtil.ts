export function random(num: number) {
    return Math.floor(Math.random() * num);
}

export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = random(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}