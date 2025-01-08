// src/index.ts
export const greet = (name: string): string => `Hello, ${name}!`;

if (require.main === module) {
  const name = process.argv[2] || "World";
  console.log(greet(name));
}