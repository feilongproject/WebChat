import { readPage } from './var'


export async function ReadPage(nowUser: string) {
    console.log(`read page user is: ${nowUser}`)
    var page = ""
    var pages = readPage

    var list = await CHAT.list()
    console.log(list.keys)

    if (list.keys.length == 0) {
        page += `<h1>No Msg</h1>`
    } else for (var i = list.keys.length - 1; i >= 0; i--) {

        var key = await CHAT.get(parseInt(list.keys[i].name).toString())

        var MsgInfo: sendMsg = JSON.parse(key ? key : "{}")

        console.log(`${list.keys[i].name}: ${JSON.stringify(MsgInfo)}`)
        var date = new Date(parseInt(list.keys[i].name) + 8 * 3600 * 1000)

        var dateStrD = date.getFullYear() + "-" + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()))
        var dateStrT = (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" + (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes())) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()))
        //console.log(dateStrD + " " + dateStrT)
        var MsgUserType = "another"
        if (nowUser == MsgInfo.User)
            MsgUserType = "myself"

        switch (MsgInfo.Type) {
            case "text":
                page += `
                    <div class="msg-${MsgUserType}">
                        <div>Time: ${dateStrD + " " + dateStrT}<hr>
                            User:${MsgInfo.User}<br>
                            ${MsgInfo.Content}
                        </div>
                    </div>`
                break;

            default:
                break;
        }
    }


    //console.log(page)

    page = pages.replaceAll("<!-- MSG BODY -->", page)

    return new Response(page, {
        headers: { "Content-Type": "text/html;charset=utf-8" },
    })

}

