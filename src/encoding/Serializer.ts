/**
 * Serializer class to serialize and deserialize data to and from ssz format.
 * @example
 * import { Serializer } from 'niljs';
 *
 * const serializer = new Serializer();
 * const data = { key: 'value' };
 *
 * const serializedData = serializer.serialize(data);
 * const deserializedData = serializer.deserialize(serializedData);
 */
class Serializer {
  public serialize(data: unknown): string {
    return JSON.stringify(data);
  }

  public deserialize(data: string): unknown {
    return JSON.parse(data);
  }
}

// user should have schema out of the box and be able to provide custom.
export { Serializer };

// this class is needed only to accept schema once
