
const config = {

    userName:'',
    userPhone:'',
    usercompany:'',
    EMPUID:''
}

let bindToGlobal=function(obj, key){
     if (typeof window[key] === 'undefined') {
     window[key] = {};
 }

 for (let i in obj) {
     window[key][i] = obj[i]
 }

}
bindToGlobal(config,'_const')







