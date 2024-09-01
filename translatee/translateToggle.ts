/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findAncestorWithClassPattern, findDescendantWithClassPattern } from "./DOMFinder";
import { settings } from "./settings";
// thinking about including a event.key keycode polyfill, but since its even deprecated Ill probably just ignore IE once again
let isAltPressed: boolean = false;
let isShiftPressed: boolean = false;
let isSymbol1Pressed: boolean = false;
let isSymbol2Pressed: boolean = false;
let isAPressed: boolean = false;
let isTPressed: boolean = false;
export default function translateToggle() {
    let simulating: boolean = false;

    document.addEventListener("keydown", function (event) {
        if (simulating || settings.store.translateToggle === "disabled") return;

        const criticalKeyPressed = setKeysAndReturn(event.key, true);

        if ((criticalKeyPressed || event.key === "Enter") && isTranslateToggleActive() && isMessageBoxFocused()) {
            if (event.key === "Enter") {
                event.preventDefault();

                simulating = true;
                simulateCleanEnterOnTextarea();
                simulating = false;
            }
            settings.store.autoTranslate = true;
        }
    });

    document.addEventListener("keyup", function (event) {
        if (simulating || settings.store.translateToggle === "disabled") return;

        const criticalKeyReleased = setKeysAndReturn(event.key, false);
        if (criticalKeyReleased && !isTranslateToggleActive()) settings.store.autoTranslate = false;
    });


    function isTranslateToggleActive(): boolean {
        switch (settings.store.translateToggle) {
            case "altshift1":
                return isAltPressed && isShiftPressed && isSymbol1Pressed;
            case "altshift2":
                return isAltPressed && isShiftPressed && isSymbol2Pressed;
            case "altshiftA":
                return isAltPressed && isShiftPressed && isAPressed;
            case "altshiftT":
                return isAltPressed && isShiftPressed && isTPressed;
            case "altshift": // needs to be at the end using it this way
                return isAltPressed && isShiftPressed;
            default:
                return false;
        }
    }

}

export function simulateCleanEnterOnTextarea() {

    const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        charCode: 0,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        repeat: false,
        location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
    });



    const textArea = getMessageBox();
    if (textArea) textArea.dispatchEvent(enterEvent);
}

export function isMessageBoxFocused(): boolean | null {
    const textArea = getMessageBox();
    if (!textArea) return null;
    return document.activeElement === textArea;
}

export function getMessageBox(): HTMLElement | null { // the one where the translate button is in as well ...
    const translateBtn = document.querySelector(".vc-trans-chat-button");
    if (!translateBtn) return null;
    let targetElm = findAncestorWithClassPattern(translateBtn as HTMLElement, "buttons");
    if (!targetElm) return null;
    targetElm = targetElm.parentElement!; // should exist if targetElement not null
    targetElm = findDescendantWithClassPattern(targetElm, "textArea"); // for less recursive search
    if (!targetElm) return null;
    targetElm = findDescendantWithClassPattern(targetElm, "markup");
    if (!targetElm) return null;
    return targetElm;
}


function setKeysAndReturn(eventKey: string, bool: boolean): boolean { // updates state on key up and down and return whether or not a "critical" key was even pressed
    switch (eventKey) {
        case "Alt":
            isAltPressed = bool;
            return true;
        case "Shift":
            isShiftPressed = bool;
            return true;
        case "*":
            isSymbol1Pressed = bool;
            return true;
        case "'":
            isSymbol2Pressed = bool;
            return true;
        case "A":
            isAPressed = bool;
            return true;
        case "T":
            isTPressed = bool;
            return true;
        default:
            return false;
    }
}
