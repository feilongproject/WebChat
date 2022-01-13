export async function MsgSend(type: string, user: string, content: string): Promise<Response> {
    console.log(`\nsending...\ntype:${type}\nuser${user}\ncontent:${content}`)

    const d = new Date()
    const timestamp = d.getTime()

    var sendMsg: sendMsg = {
        Content: content,
        User: user,
        Type: type,
        TimeStamp: timestamp
    }

    console.log(`\nput to KV:\nname: ${timestamp}\ncontent:${sendMsg}`)


    await CHAT.put(timestamp.toString(), JSON.stringify(sendMsg))

    return new Response(JSON.stringify(sendMsg), {
        headers: { "Content-Type": "application/json;charset=utf-8" },
    })

}

