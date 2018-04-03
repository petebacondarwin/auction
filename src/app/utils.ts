import { DocumentChangeAction } from 'angularfire2/firestore';

export function withId<T>(changes: DocumentChangeAction[]): T[] {
  return changes.map(change => ({
    id: change.payload.doc.id,
    ...change.payload.doc.data()
  } as any));
}


export function pick(obj: object, props: string[]) {
  const result = {};
  props.forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
}