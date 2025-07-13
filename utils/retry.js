const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const callWithRetry = async (fn, depth = 0) => {
	try {
        console.log(`try #${depth}`);
		return await fn();
	}catch(e) {
		if (depth > 1) {
			throw e;
		}
        console.log(`wait #${2 ** depth * 1000}`);
		await wait(2 ** depth * 1000);
	
		return callWithRetry(fn, depth + 1);
	}
}
