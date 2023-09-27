type AsyncFunction<Parameters extends unknown[], ReturnType> = (
  ...parameters: Parameters
) => Promise<ReturnType>;

export function logTimeTaken<Parameters extends unknown[], ReturnType>(
  asyncFunction: AsyncFunction<Parameters, ReturnType>,
  prefix = ""
): AsyncFunction<Parameters, ReturnType> {
  const label = `${prefix}Time taken by ${asyncFunction.name}`;
  return async (...parameters: Parameters) => {
    console.time(label);
    const result = await asyncFunction(...parameters);
    console.timeEnd(label);
    return result;
  };
}
