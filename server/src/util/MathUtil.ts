export function random(num: number) {
    return Math.floor(Math.random() * num);
}

export function shuffleArray(array: number[]): number[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = random(i + 1);
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}