export { }

declare global {
  const CHAT: KVNamespace;

  interface sendMsg {
    Content: string,
    User: string,
    Type: string,
    TimeStamp: number
  }
}