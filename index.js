const fs = require("fs")

vue_component = {
    read(obj,cb){
        fs.readFile(obj.path+obj.name+".vue",(err,file)=>{
            if(err){
                cb(err)
            }else{
                file = file.toString()
                let temp = {}
                temp.script = `${file.split(/<script|<\/script>/gm)[1]}`
                temp.style = `${file.split(/<style>|<\/style>/gm)[1]}`
                // temp.head = file.split(/<head>|<\/head>/gm)[1]
                temp.html = get_html(file,temp)
                let component = `Vue.component("${obj.name}",
                {template:\`${temp.html.replace(/\$\$/g, obj.name).replace(/\`/gm,"\\\`")}\`,
                ${temp.script.split(/{/gm).splice(1).join("{")})
                
                let styleSheet = document.createElement("style")
                    styleSheet.innerText = \`${temp.style.replace(/\$\$/g, obj.name)}\`
                    document.head.appendChild(styleSheet)
                `

                    
                // fs.writeFile("test.js",component,err=>{
                    cb(null,component)
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