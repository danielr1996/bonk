import { serve } from "https://deno.land/std@0.90.0/http/server.ts";
import {exists } from "https://deno.land/std/fs/mod.ts";
import { lookup } from "https://deno.land/x/media_types/mod.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
for await (const request of server) {
    const url = request.url.substr(1);
    console.log(`public/${url}`,await exists(`public/${url}`))
    if(url === '' || !(await exists(`public/${url}`))){
        request.respond({ status: 200, body: await Deno.readTextFile('public/index.html') ,headers: new Headers({'Content-Type':'text/html', 'X-Content-Type-Options':'nosniff'})});
    }else{
        const contentType: string = lookup(`public/${url}`) ?? 'application/octet';

        request.respond({ status: 200, body: await Deno.readTextFile(`public/${url}`) , headers: new Headers({'Content-Type':contentType})});
    }
}
