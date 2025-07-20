export type WithToObject = { toObject?: () => any; _id?: any };

export function toDTO<U>(doc: WithToObject): U {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const { _id, __v, password, updatedAt, ...rest } = obj;
  return {
    id: _id?.toString?.(),
    ...rest,
  } as unknown as U;
}
