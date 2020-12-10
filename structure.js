function out(...args){ console.log(...args) }

// ["if",["=",[3],["+",[1],[2]]],["Equal"],["Not-Equal"]]

// prefix&infix
["prefix","if",["infix",[3],"==",["infix",[1],"+",[2]]],["Equal"],["Not-Equal"]]


var if3=(a,b,c)=>a?b:c
var equal=(a,b)=>a==b
var add=(a,b)=>a+b
out("infix|prefix:\t",prefix(if3,infix(3,equal,infix(1,add,2)),"Equal","Not-Equal"))

function prefix(...args){
    var pre=args[0]
    args.splice(0,1)
    return pre(...args)
}

function infix(...args){
    var [a,infix_,b]=args
    return infix_(...[a,b])
}


var source='if = 3 + 1 2 "Equal" "Not-Equal"'
var source_expr='if expr 3 == ( expr 1 + 2 ) "Equal" "Not-Equal"'
out("source:\t",source)

var words=source.split(" ")
out("count:\t",words.length)

out("parsed:\t",JSON.stringify(words))

var nodes_expected=["if",["=",3,["+",1,2]],"Equal","Not-Equal"]
var arity={"if":3,"=":2,"+":2}

function nodes_build(word_index){
    var current_word=words[word_index]
    if(!(current_word in arity)) return [[JSON.parse(current_word)],1] // ["if",["=",[3],["+",[1],[2]]],["Equal"],["Not-Equal"]]
    var current_arity=arity[current_word]
    var out_nodes=[]
    out_nodes.push(current_word)
    word_index++
    var total_size=1
    for(var count=1;count<=current_arity; count++){
        var [built_node,size]=nodes_build(word_index)
        out_nodes.push(built_node)
        word_index+=size
        total_size+=size
    }
    return [out_nodes,total_size]
}

var nodes=nodes_build(0)
out("result:\t",JSON.stringify(nodes[0]))
out("equal:\t",JSON.stringify(nodes[0])==JSON.stringify(nodes_expected))
