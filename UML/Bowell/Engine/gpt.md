# GO
```js
function(){
  var typelookup = {};
  var names = ['array', 'object', ...];
  var index = 0;
  for(; index < names.length; ++index){
    typelookup['[object' + names[index] + ']'] = names[index].tolowercase();
  }
}
```
```js
extend = function(tar, ex){
  var pp, cp;
  for(pp in ex){
    cp = ex[pp];
    if(this.type(cp) === "obj"){
      tar[pp] = this.extend({}, cp);
    }
    else if (this.type(cp) === "array"){
      tar[pp] = this.extend({}, cp);
    }
    else{
       tar[pp] =cp;
    }
  }
  return tar;
}
```