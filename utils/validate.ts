export type ValidateCallback = () => boolean;
export type ValidateTuple = [callback: ValidateCallback, message: string];

export const validateCallbacks = (callbacks: ValidateTuple[]) => {
    for (let i = 0; i < callbacks.length; i++) {
        const [callback, message] = callbacks[i];

        if (!callback()) {
            return message;
        }
    }
    return "";
};
/**
 * const errorMessage = validateCallbacks([
 *  [() => x === y, message]
 * ]);
 */
