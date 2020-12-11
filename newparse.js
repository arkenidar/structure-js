var definitions={expr,if3,out1,set,get,loop}
var deferred={if3,loop} // skip and postpone node_exec()
var variables={}

function out(...args){ console.log(...args) }
function out1(arg){ console.log(arg) }

var source, words

function test_sequence_basic(){
//source='if3|expr|3|==|expr|1|+|2|"Equal"|"Not-Equal"'
source='out1|10|out1|20'
words=source.split("|")
/*
var nodes=nodes_build(0)
out("result:\t",(nodes[0])) // JSON.stringify(nodes[0]) // debugging
out("node_exec:",node_exec(nodes[0]))
*/
node_exec(nodes_build(0)[0])
node_exec(nodes_build(2)[0])
var sequence=[nodes_build(0)[0],nodes_build(2)[0]]
out(sequence)
node_exec(sequence)
}

function test_sequence_basic2(){
    out("test_sequence_basic2()")
source='set|"n"|1|out1|expr|get|"n"|+|10'
words=source.split("|")
node_exec(nodes_build(0)[0])
out("variables", variables)
node_exec(nodes_build(3)[0])
}

function test_sequence_basic3(){
        out("test_sequence_basic3()")
    source='begin|set|"n"|2|out1|get|"n"|out1|expr|get|"n"|+|10'
    words=source.split("|")
    var nodes=nodes_build(0)[0]
    out(JSON.stringify(nodes)) // for debugging
    node_exec(nodes)
    //node_exec(nodes_build(3)[0])
}

test_loop()
function test_loop(){
    out("test_loop()")
    source='begin|set|"n"|1|loop|expr|get|"n"|"<"|11|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|2|expr|get|"n"|"+"|" numero pari"|get|"n"|set|"n"|expr|get|"n"|+|1|end'
    exec_source()
}

function exec_source(){
    words=source.split("|")
    var nodes=nodes_build(0)[0]
    out(JSON.stringify(nodes)) // for debugging
    node_exec(nodes)
}

function get(variable_name){
    return variables[variable_name]
}

function set(variable_name,value){
    return variables[variable_name]=value
}

function json_parse(current){
    try{
        return JSON.parse(current)
    }catch(e){
        return current
    }    
}

function expr(a,op,b){
  if(op=="==") return a==b
  if(op=="+") return a+b
  if(op=="<") return a<b
  if(op=="%") return a%b
}

function if3(condition,case_true,case_false){
    return node_exec(condition)?node_exec(case_true):node_exec(case_false)
}

function loop(condition,while_true_do_this){
    while(node_exec(condition)){
        node_exec(while_true_do_this)
    }
}

function nodes_build(word_index){
    var current_word=words[word_index]
    if(current_word=="begin"){ // sequence
        var size=0
        var sequence=[]
        var cur_index=word_index+1
        while(cur_index<words.length && words[cur_index]!="end"){
            var [out_nodes,total_size]=nodes_build(cur_index)
            sequence.push(out_nodes)
            cur_index+=total_size
            size+=total_size
        }
        return [sequence,size]
    }
    if(!(current_word in definitions)) return [[json_parse(current_word)],1] // ["if3",["=",[3],["+",[1],[2]]],["Equal"],["Not-Equal"]]
    var current_arity=definitions[current_word].length
    var out_nodes=[]
    out_nodes.push(definitions[current_word])
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

function node_exec(node){
    if(Array.isArray(node)){
        for(var subnode of node)
            node_exec(subnode)
    }
    var type=typeof node[0]
    if(type=="function")
    {
        var func=node[0]
        var arity=func.length
        var arg_list=[]
        for(var argi=1;argi<=arity;argi++){
            var pushed=func.name in deferred?node[argi]:node_exec(node[argi])
            arg_list.push(pushed)
        }
        return func(...arg_list)
    }
    else
    {
        return node[0]
    }
}
