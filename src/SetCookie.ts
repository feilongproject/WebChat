export async function SetCookie():Promise<string> {

    return `
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript">
        var name = prompt("请设置你的名称: ")
        document.cookie = \`user=\${name}\`
        cookieStore.get("user").then(res => {
            console.log(res.value)
            if (name != res.value) {
                alert(\`警告: cookie 设置失败\`)
            } else {
                alert(\`已设置用户名: \${name}\`)
            }
            window.location.href = "/"
        })
    </script>
</head>`
}