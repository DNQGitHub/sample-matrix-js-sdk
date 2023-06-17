/**
 * Giúp code ngắn hơn và loại bỏ try/catch khi gọi hàm
 *
 * @param func: hàm cần gọi
 * @param args : args của hàm
 * @returns : Mảng 2 phần tử,
 * [0]: là kết quả của hàm
 * [1]: là lỗi khi có error
 */

export function resolveFunction<T>(
    func: Function,
    args: Array<any>
): [T | null, any] {
    try {
        const result = func.apply(func, args);

        return [result, null];
    } catch (error) {
        return [null, error];
    }
}

/**
 * Giúp code ngắn hơn và loại bỏ try/catch khi execute promise
 *
 * @param promise: promise
 * @returns : Mảng 2 phần tử,
 * [0]: là kết quả của promise
 * [1]: là lỗi khi có error
 */

export async function resolvePromise<T>(
    promise: Promise<T>
): Promise<[T | null, any]> {
    try {
        const result = await promise;

        return [result, null];
    } catch (error) {
        return [null, error];
    }
}

export async function wait(miliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, miliseconds);
    });
}
