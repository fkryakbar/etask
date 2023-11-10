export default async function addDelay(time: number) {
    await new Promise(resolve => setTimeout(resolve, time));
}