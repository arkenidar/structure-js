type generic_function=(...args:any[])=>any
type node_type=any[]|any
var definitions:{[key:string]:generic_function}={expr,if3,out1,set,get,loop}
var deferred:{[key:string]:generic_function}={if3,loop} // skip and postpone node_exec()
var variables:{[key:string]:any}={}

function out(...args:any[]){ console.log(...args) }
function out1(arg:any){ console.log(arg) }
test_loop2()
function test_sequence_basic(){
//var source='if3|expr|3|==|expr|1|+|2|"Equal"|"Not-Equal"'
var source='out1|10|out1|20'
var words=source.split("|")
/*
var nodes=nodes_build(words,0)
out("result:\t",(nodes[0])) // JSON.stringify(nodes[0]) // debugging
out("node_exec:",node_exec(nodes[0]))
*/
node_exec(nodes_build(words,0)[0])
node_exec(nodes_build(words,2)[0])
var sequence=[nodes_build(words,0)[0],nodes_build(words,2)[0]]
out(sequence)
node_exec(sequence)
}

function test_sequence_basic2(){
    out("test_sequence_basic2()")
var source='set|"n"|1|out1|expr|get|"n"|+|10'
var words=source.split("|")
node_exec(nodes_build(words,0)[0])
out("variables", variables)
node_exec(nodes_build(words,3)[0])
}

function test_sequence_basic3(){
        out("test_sequence_basic3()")
    var source='begin|set|"n"|2|out1|get|"n"|out1|expr|get|"n"|+|10'
    var words=source.split("|")
    var nodes=nodes_build(words,0)[0]
    out(JSON.stringify(nodes)) // for debugging
    node_exec(nodes)
    //node_exec(nodes_build(words,3)[0])
}

function test_loop(){
    out("test_loop()")
    var source='begin|set|"n"|1|loop|expr|get|"n"|"<"|11|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|2|expr|get|"n"|"+"|" numero pari"|get|"n"|set|"n"|expr|get|"n"|+|1|end'
    exec_source(source)
}

function test_loop2(){
    out("test_loop2()")
    var source='begin|set|"n"|1|loop|expr|get|"n"|"<"|21|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|" FizzBuzz: multiple of both 3 and 5"|if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|" Fizz: multiple of 3"|if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|" Buzz: multiple of 5"|get|"n"|set|"n"|expr|get|"n"|+|1|end'
    exec_source(source)
}

function exec_source(source:string){
    var words=source.split("|")
    var nodes=nodes_build(words,0)[0]
    var debug=false
    if(debug){
        out(nodes)
        out(JSON.stringify(nodes))
    }
    node_exec(nodes)
}

function get(variable_name:string):any{
    return variables[variable_name]
}

function set(variable_name:string,value:any){
    return variables[variable_name]=value
}

function json_parse(current:string){
    try{
        return JSON.parse(current)
    }catch(e){
        return current
    }    
}

function expr(a:any,op:string,b:any){
  if(op=="==") return a==b
  if(op=="+") return a+b
  if(op=="<") return a<b
  if(op=="%") return a%b
}

function if3(condition:node_type,case_true:node_type,case_false:node_type){
    return node_exec(condition)?node_exec(case_true):node_exec(case_false)
}

function loop(condition:node_type,while_true_do_this:node_type){
    while(node_exec(condition)){
        node_exec(while_true_do_this)
    }
}

function nodes_build(words:string[],word_index:number):[node_type[],number]{
    var current_word:string=words[word_index]
    var out_nodes:node_type[]=[]
    var total_size:number=1
    var size:number=0
    if(current_word=="begin"){ // sequence
        var sequence=[]
        var cur_index=word_index+1
        while(cur_index<words.length && words[cur_index]!="end"){
            [out_nodes,total_size]=nodes_build(words,cur_index)
            sequence.push(out_nodes)
            cur_index+=total_size
            size+=total_size
        }
        return [sequence,size]
    }
    if(!(current_word in definitions)) return [[json_parse(current_word)],1] // ["if3",["=",[3],["+",[1],[2]]],["Equal"],["Not-Equal"]]
    var current_arity=definitions[current_word].length
    out_nodes.push(definitions[current_word])
    word_index++
    for(var count=1;count<=current_arity; count++){
        var [built_node,size]=nodes_build(words,word_index)
        out_nodes.push(built_node)
        word_index+=size
        total_size+=size
    }
    return [out_nodes,total_size]
}

function node_exec(node:any[]):any{
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
