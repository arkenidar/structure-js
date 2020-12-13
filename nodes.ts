type generic_function=(...args:any[])=>any
type node_type=any[]|any
var definitions:{[key:string]:generic_function}={expr,if3,out1,set,get,setk,getk,loop,dont,len}
var deferred:{[key:string]:generic_function}={if3,loop,dont} // skip and postpone node_exec()
var variables:{[key:string]:any}={}

function out(...args:any[]){ console.log(...args) }
function out1(arg:any){ console.log(arg) }


//test_sequence_basic()
function test_sequence_basic(){
out1("test_sequence_basic()")
//var source='if3|expr|3|==|expr|1|+|2|"Equal"|"Not-Equal"'
var source='out1|10|out1|20'
var words=source.split("|")
/*
var nodes=nodes_build(words,0)
out("result:\t",nodes[0])
out("node_exec:",node_exec(nodes[0]))
*/
node_exec(nodes_build(words,0)[0])
node_exec(nodes_build(words,2)[0])
var sequence=[nodes_build(words,0)[0],nodes_build(words,2)[0]]
out(sequence)
node_exec(sequence)
}

//test_sequence_basic2()
function test_sequence_basic2(){
out("test_sequence_basic2()")
var source='set|"n"|1|out1|expr|get|"n"|+|10'
var words=source.split("|")
node_exec(nodes_build(words,0)[0])
out("variables", variables)
node_exec(nodes_build(words,3)[0])
}

//test_sequence_basic3()
function test_sequence_basic3(){
    out("test_sequence_basic3()")
    var source='begin|set|"n"|2|out1|get|"n"|out1|expr|get|"n"|+|10|end'
    var words=source.split("|")
    var nodes=nodes_build(words,0)[0]
    //out(JSON.stringify(nodes))
    node_exec(nodes)
    //node_exec(nodes_build(words,3)[0])
}

//test_loop()
function test_loop(){
    out("test_loop()")
    var source='begin|set|"n"|1|loop|expr|get|"n"|"<"|11|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|2|expr|get|"n"|"+"|" even number"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end'
    exec_source(source)
}

//test_loop2()
function test_loop2(){
    out("test_loop2()")
    var source='begin|set|"n"|1|loop|expr|get|"n"|"<"|21|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|" FizzBuzz: multiple of both 3 and 5"|if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|" Fizz: multiple of 3"|if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|" Buzz: multiple of 5"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end'
    exec_source(source)
}

//test_parse_split()
function test_parse_split() {
    out("test_parse_split()")
    var source1='begin|set|"n"|1|loop|expr|get|"n"|"<"|21|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|" FizzBuzz: multiple of both 3 and 5"|if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|" Fizz: multiple of 3"|if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|" Buzz: multiple of 5"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end'
    var words1=source1.split("|")
    var source2=`
    begin|
    set|"n"|1|
    loop|
        expr|get|"n"|"<"|21|
        
    begin|
        out1|
        if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|
            " FizzBuzz: multiple of both 3 and 5"|
        if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|
            " Fizz: multiple of 3"|
        if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|
            " Buzz: multiple of 5"|
        get|"n"|

        set|"n"|expr|get|"n"|+|1|
    end|
    end`
    var words2=source2.split("|")
    words2=words2.map(word=>word.trim())
    out("split test:",JSON.stringify(words1)==JSON.stringify(words2))
}

//test_parse_split_exec()
function test_parse_split_exec() {
    out("test_parse_split_exec()")
    var source=`
    begin|
    set|"n"|1|
    loop|
        expr|get|"n"|"<"|21|
        
    begin|
        out1|
        if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|
            " FizzBuzz: multiple of both 3 and 5"|
        if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|
            " Fizz: multiple of 3"|
        if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|
            " Buzz: multiple of 5"|
        get|"n"|

        set|"n"|expr|get|"n"|+|1|
    end|
    end`
    exec_source(source)
}

//test_multiline_strings()
function test_multiline_strings(){
    out("test_multiline_strings()")
    var source=`begin|
    out1|"line1\nline2"|
    out1|line1\nline2|
    out1|line1
line2|end
    `
    exec_source(source)
    var words=source.split("|")
    words=words.map(word=>word.trim())
    out(words)
}

//test_parse_less_quotes()
function test_parse_less_quotes(){
    out("test_parse_less_quotes()")
    var source=`
    begin|
    set|n|1|
    loop|
        expr|get|n|<|21|
        
    begin|
        out1|
        if3|expr|0|==|expr|get|n|%|15|expr|get|n|+|
            " FizzBuzz: multiple of both 3 and 5"|
        if3|expr|0|==|expr|get|n|%|3|expr|get|n|+|
            " Fizz: multiple of 3"|
        if3|expr|0|==|expr|get|n|%|5|expr|get|n|+|
            " Buzz: multiple of 5"|
        get|n|

        set|n|expr|get|n|+|1|
    end|
    end`
    exec_source(source)
}

test_program_count()
function test_program_count(){
    out("test_program_count()")
    var source=`
    begin|
    set|counters|{"a":0,"e":0,"i":0,"o":0,"u":0}|
    set|phrase|hello everyone|
    out1|get|phrase|
    set|n|0|
    out1|get|counters|

    loop|expr|get|n|<|len|phrase|
    begin|
        dont|out1|get|n|
        
        set|letter|getk|get|n|phrase|
        dont|out1|get|letter|
        
        set|increment|if3|expr|get|letter|in|get|counters|1|0|
        dont|out1|get|increment|

        if3|expr|1|==|get|increment|
            setk|get|letter|counters|expr|1|+|getk|get|letter|counters|
            pass|

        set|n|expr|get|n|+|1|
    end|
    
    out1|counted:|
    out1|get|counters|
    end
    `
    exec_source(source)
}

//=========================

function exec_source(source:string){
    var words=source.split("|")
    words=words.map(word=>word.trim())
    var nodes=nodes_build(words,0)[0]
    //out(JSON.stringify(nodes,null,4))//spacing-level
    node_exec(nodes)
}

function len(variable_name:string):number{
    return variables[variable_name].length
}

function get(variable_name:string):any{
    return variables[variable_name]
}

function set(variable_name:string,value:any){
    return variables[variable_name]=value
}

function getk(key:any,variable_name:string):any{
    return variables[variable_name][key]
}

function setk(key:any,variable_name:string,value:any){
    return variables[variable_name][key]=value
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
  if(op=="in") return a in b
}

function if3(condition:node_type,case_true:node_type,case_false:node_type){
    return node_exec(condition)?node_exec(case_true):node_exec(case_false)
}

function loop(condition:node_type,while_true_do_this:node_type){
    while(node_exec(condition)){
        node_exec(while_true_do_this)
    }
}

function dont(node_to_ignore:node_type){}

//=========================================

function nodes_build(words:string[],word_index:number):[node_type[],number]{
    
    var current_word:string=words[word_index]
    
    var out_nodes:node_type[]=[]
    var total_size:number=1
    
    if(current_word=="begin"){ // sequence
        var sequence=[]
        var size=1

        var cur_index=word_index+1
        while(words[cur_index]!="end"){
            
            [out_nodes,total_size]=nodes_build(words,cur_index)
            
            sequence.push(out_nodes)
            size+=total_size

            cur_index+=total_size
        }
        size++
        return [sequence,size]
    }
    if(!(current_word in definitions)) return [json_parse(current_word),1]
    var current_arity=definitions[current_word].length
    out_nodes.push(current_word)
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
        
    var type=typeof definitions[node[0]]
    if(type=="function")
    {
        var func=definitions[node[0]]
        var arity=func.length
        var arg_list=[]
        for(var argi=1;argi<=arity;argi++){
            var pushed=node[0] in deferred?
            node[argi]:node_exec(node[argi])
            arg_list.push(pushed)
        }
        return func(...arg_list)
    }
    else
    if(Array.isArray(node)){
        for(var subnode of node)
            node_exec(subnode)
    }
    else
    {
        return node
    }
}
