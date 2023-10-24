const fs = require("fs")

vue_component = {
    read(path,cb){
        if(!path.toLowerCase().endsWith(".vue")){
            path +=".vue"
        }
        let obj = {
             name : path.split("/").pop(),
           
        }
        obj.path = path.split(obj.name)[0]
        obj.prefix = obj.name.slice(0,-4)
        fs.readFile(obj.path+obj.name,(err,file)=>{
            if(err){
                cb(err)
            }else{
                file = file.toString()
                let temp = {}
                temp.script = `${file.split(/<script|;?\s+<\/script>/gm)[1]}`
                //temp.script.replace
                temp.style = `${file.split(/<style>|<\/style>/gm)[1]}`
                // temp.head = file.split(/<head>|<\/head>/gm)[1]
                temp.html = get_html(file,temp)
                let component = `Vue.component("${obj.prefix}",
                {template:\`${temp.html.replace(/\`/gm,"\\\`")}\`,
                ${temp.script.split(/{/gm).splice(1).join("{")})
                    let $$styleSheet = document.createElement("style")
                        $$styleSheet.innerText = \`${temp.style.replace(/\$\$/g, obj.prefix)}\`
                        document.head.appendChild($$styleSheet)
                `

                    
                // fs.writeFile("test.js",component,err=>{
                    cb(null,component.replace(/\$\$/g, obj.prefix))
                // })
            }
        })
    }
}

module.exports = vue_component
function get_html(file,temp){
    let tempfile = file
    tempfile=tempfile.split("<template>")
    tempfile.shift()
    tempfile=tempfile.join("<template>")
    tempfile=tempfile.split("</template>")
    tempfile.pop()
    tempfile=tempfile.join("</template>")
    return tempfile
    // Object.keys(temp).map(v=>{
    //     if(temp[v]){
    //         tempfile = tempfile.replace(temp[v],"")
    //     }
    // })
}
