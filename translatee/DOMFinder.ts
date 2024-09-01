/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function findAncestorWithClassPattern(startElement: HTMLElement, targetClass: string): HTMLElement | null { // only upwards search (not even downwards on upper elements)
    let currentElement: HTMLElement | null | Document = startElement;

    // Function to check if any class of the element contains the pattern
    function hasClassContainingPattern(element: HTMLElement, pattern: string): boolean {
        return Array.from(element.classList).some(className => className.includes(pattern));
    }

    // Traverse up the DOM tree until the root element (document) or until a matching element is found
    while (currentElement && currentElement !== document.body) {
        // Check if the current element has a class that contains the pattern
        if (hasClassContainingPattern(currentElement, targetClass)) {
            return currentElement;
        }
        // Move to the parent element
        currentElement = currentElement.parentElement;
    }

    // Return null if no matching element is found
    return null;
}

export function findDescendantWithClassPattern(startElement: HTMLElement, targetClass: string): HTMLElement | null { // only downwards search, recursive
    // Function to check if any class of the element contains the pattern
    function hasClassContainingPattern(element: HTMLElement, pattern: string): boolean {
        return Array.from(element.classList).some(className => className.includes(pattern));
    }

    // Depth-first search (DFS) through the DOM tree starting from the start element
    function searchChildren(element: HTMLElement): HTMLElement | null {
        if (hasClassContainingPattern(element, targetClass)) {
            return element; // Return if the element contains the pattern
        }

        // Iterate over all children of the current element
        for (const child of element.children) {
            const result = searchChildren(child as HTMLElement); // Type assertion to HTMLElement
            if (result) {
                return result; // Return if a matching child is found
            }
        }

        return null; // Return if no matching child is found
    }

    return searchChildren(startElement);
}
