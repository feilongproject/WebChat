import { MsgSend } from './MsgSend'
import { ReadPage } from './ReadPage'
import { SetCookie } from './SetCookie'

import cookie from 'cookie'

async function Main(request: Request): Promise<Response> {

    //console.log(request)
    const url = new URL(request.url)
    //console.log(url)

    const { pathname } = url
    var pathCut = (pathname + "/").replaceAll("//", "/").split("/")

    console.log(`pathname: ${pathname}; href: ${url.href}`)

    var cookiesInfo = request.headers.get("Cookie")
    if (!cookiesInfo) return new Response(await SetCookie(), {
        headers: { "Content-Type": "text/html;charset=utf-8" },
    })
    var cookies = cookie.parse(cookiesInfo)
    //console.log(cookies)

    switch (pathCut[1]) {
        case "send":
            var msgInfo = url.searchParams.get("msg")
            var type = url.searchParams.get("type")

            if (!type) type = "text"
            if (!msgInfo) {
                console.log(url.searchParams.toString())
                return new Response("error: msg empty", {
                    headers: { "Content-Type": "text/html;charset=utf-8" },
                })
            }
            if (!cookies.user) {
                return new Response()
            }
            return await MsgSend(type, cookies.user, msgInfo,)
        default:

            if (pathname == "/") {
                return await ReadPage(cookies.user)
            } else {
                return new Response(`<h1>404 not found page</h1>`, {
                    headers: { "Content-Type": "text/html;charset=utf-8" },
                })
            }


    }


}


addEventListener("fetch", (event) => {
    console.log(`\n\n\nlog start,d=${Date.now()}`)
    event.respondWith(
        Main(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});