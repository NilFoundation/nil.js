/**
 * Interface for Serializer class.
 * Serializer class is used to serialize and deserialize data to and from ssz format.
 */
abstract class ISerializer {
  abstract serialize(data: unknown): Uint8Array;
  abstract deserialize(data: Uint8Array): unknown;
}

export { ISerializer };
