

async function Main(request) {
    console.log(request)
    const url = new URL(request.url)
    console.log(url)

    const { pathname } = url
    console.log(`pathname: ${pathname} ; href: ${url.href}`)


    var returnMsg
    if(pathname.startsWith("/send")) {
        returnMsg=await MsgSend(url.searchParams.get("msg"),url.searchParams.get("user"))
        return Response.redirect(url.origin, 302)
    }else if(pathname.startsWith("/rece")) {
        returnMsg=await MsgRece(await request.text(),url)
    }else{
        returnMsg=await readPage()
    }

    return new Response(returnMsg, {
        headers: { "Content-Type": "text/html;charset=utf-8" },
    })
}

async function readPage(){
    var page=`
    <html>
      <head>
        <link rel="icon" type="image/x-icon" href="//cdn.jsdelivr.net/gh/feilongproject/bili-downloader/favicon.ico">
        <style type="text/css">
            .msg-myself{
                background-color: #0af;
                margin: 5px 5px 5px 30%;
            }
            .msg-another{
                background-color: #0af;
                margin: 5px 30% 5px 5px;
            }
            .msg-undefined{
                background-color: #0af;
                margin: 5px 30% 5px 5px;
            }
            hr{
                margin: 0px 0px 0px 0px;
            }

        </style>
      </head>
      <body>`
    list = await WEBCHAT.list()
    console.log(list.keys)

    for(i=list.keys.length-1;i>=0;i--){
        key=parseInt(list.keys[i].name)
        key=await WEBCHAT.get(key)

        console.log(key)
        key =JSON.parse(key)

        var date = new Date(list.keys[i].name * 1000 + 8 * 3600 * 1000)

        var dateStrD =date.getFullYear()+ "-" +(date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)))+ "-" +(date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()))
        var dateStrT =(date.getHours() > 9 ? date.getHours() : ("0" + date.getHours()))+ ":" +(date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()))+ ':' +(date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()))
    //console.log(dateStrD + " " + dateStrT)

        page+=`
        <div class="msg-${key.MsgUserType}">
          <span>
            ${key.UserName}  |  Time:${dateStrD+ " " +dateStrT}<hr>
            Content:<br>
            ${key.Content}
          </span>
        </div>`
    }

    page+=`
    <form action="/send" method="get">
        <input type="text" id="user" required placeholder="名称" name="user">
        <input type="text" id="msg" required placeholder="等待发送" name="msg">
        <input type="submit" value="发送" />
    </form>
`
    //console.log(page)
    return page
}

async function MsgSend(msgInfo,userName){
    console.log(`send msg:${msgInfo},userName:${userName}`)

    if(!msgInfo)return "error: msg empty"


    res={
        Content:msgInfo,
        MsgUserType:undefined,
        UserName:userName
    }
    
    console.log(`returnMsg: ${JSON.stringify(res)}`)


    const d=new Date()
    await WEBCHAT.put(parseInt(d.getTime()/1000), JSON.stringify(res))

    return JSON.stringify(res)

}



addEventListener("fetch", (event) => {
  console.clear()
  event.respondWith(
    Main(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});
