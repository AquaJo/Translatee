/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export default class BinaryOperations {
    static isBinary(str: string): boolean {
        return /^[01\s]+$/.test(str);
    }
    static stringToBinary(str: string): string {
        return str.split("")
            .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
    }

    static binaryToString(binaryStr: string): string {
        // Split the binary string by spaces to get each 8-bit binary chunk
        const binaryChunks = binaryStr.split(" ");

        // Convert each 8-bit binary chunk to a character
        const result = binaryChunks
            .map(bin => String.fromCharCode(parseInt(bin, 2)))
            .join("");

        return result;
    }
}
