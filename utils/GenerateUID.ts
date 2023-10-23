function generateUID() {
    const timestamp = new Date().getTime().toString(16); // Current timestamp in hexadecimal
    const randomPart = Math.random().toString(16).substr(2, 4); // Random 4-digit hexadecimal
    const uid = timestamp + randomPart;
    return uid;
}

export default generateUID