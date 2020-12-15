type generic_function=CallableFunction
type node_type=any[]|any
var definitions:{[key:string]:generic_function}={expr,if3,out1,set,get,setk,getk,loop,dont,len}
var deferred:{[key:string]:generic_function}={if3,loop,dont} // skip and postpone node_exec()
export var variables:{[key:string]:any}={}

export function out(...args:any[]){ console.log(...args) }
export function out1(arg:any){ console.log(arg) }

//=========================

export function exec_source(source:string){
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

export function nodes_build(words:string[],word_index:number):[node_type[],number]{
    
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

export function node_exec(node:any[]):any{
        
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
