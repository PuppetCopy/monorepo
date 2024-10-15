// // Define your custom types
// type Address = `0x${string}`;
// type Hex = `0x${string}`; // Assuming Hex is a hexadecimal string

// // Define the TypeMap
// type TypeMap = {
//   bigint: bigint;
//   number: number;
//   string: string;
//   bytes: Hex;
//   address: Address;
// };

// // Define a helper type to validate the schema
// type ValidSchema<T extends object> = {
//   [K in keyof T]?: {
//     [Key in keyof TypeMap]: TypeMap[Key] extends T[K] ? Key : never;
//   }[keyof TypeMap];
// };

// // Define the createSchema function
// function createSchema<T extends object, M extends ValidSchema<T>>(
//   schema: M
// ): { [K in keyof M]: TypeMap[M[K]] } {
//   return schema as any;
// }


// // Define your source type
// type Increase_t = {
//   readonly account: string;
//   readonly transactionHash: string;
//   readonly sizeInUsd: bigint;
//   readonly count: number;
// };

// // Use createSchema to create a typed schema
// const schema = createSchema<Increase_t>({
//   account: 'address',
//   sizeInUsd: 'bigint',
//   count: 'number',
// });

// // The type of schema is:
// type SchemaType = {
//   account: Address;
//   sizeInUsd: bigint;
//   count: number;
// };