type generic_function=CallableFunction
type node_type=any[]|any
var definitions:{[key:string]:generic_function}={
    expr,if3,out1,set,get,setk,getk,loop,dont,len,def_func,arg,ifunc:def_func}
// defer: skip and postpone node_exec()
var deferred:{[key:string]:generic_function}={
    if3,loop,dont,def_func,ifunc:def_func}
export var variables:{[key:string]:any}={}

export function out(...args:any[]){ console.log(...args) }
export function out1(arg:any){ console.log(arg) }

//=========================
var definitions_func:{[func_name:string]:{"func_def":generic_function,"func_arity":number}}={}
var stack:any[]=[[]]
export function def_func(func_name:string, func_arity:number, node:node_type){
    
    var arity=node_exec(func_arity)
    if(false)out("def_func/3()",func_name, node_exec(func_name))

    definitions_func[func_name.substring(1)]={func_def:func_def_inner,func_arity:arity}
    function func_def_inner(...args:any[]){
        stack.push(args)
        var ret_value=node_exec(node)
        stack.pop()
        return ret_value
    }
}
function arg(index:number){
    return stack[stack.length-1][index]
}
//==============================================
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
  if(op=="*") return a*b
  if(op=="-") return a-b
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

    var got_function=get_function(current_word)
    if(got_function===null){
        // return [json_parse(current_word),1]
        out_nodes=json_parse(current_word)
        total_size=1
    }
    else if(got_function!==null){
        var current_arity=got_function.arity
        out_nodes.push(current_word)
        word_index++
        for(var count=1;count<=current_arity; count++){
            var [built_node,size]=nodes_build(words,word_index)
            out_nodes.push(built_node)
            word_index+=size
            total_size+=size
        }
    }
    
    // immediate evaluation after creating such node.
    // implementation: node of type immediate? (reserved name) NO
    // implementation: nodes marked with exclamation mark NO
    // implementation: only def_func is immediately evaluated after node creation
    if(Array.isArray(out_nodes) && out_nodes[0]=="def_func"){
        node_exec(out_nodes) // evaluated
        // exec only 1 time, by removing node, or ignoring it
        out_nodes=["dont",out_nodes] // kept but ignored node
    }
    
    return [out_nodes,total_size]
}

function get_function(func_name:string):{func:generic_function,arity:number}|null{
    if(typeof definitions[func_name]==="function"){
        return {func:definitions[func_name],arity:definitions[func_name].length}
    }else if(typeof definitions_func[func_name]==="object"){
        return {func:definitions_func[func_name].func_def,
            arity:definitions_func[func_name].func_arity}
    }else
    return null
}

export function node_exec(node:node_type):any{
    
    var defined_function=Array.isArray(node)?get_function(node[0]):null
    if(defined_function!==null)
    {
        var func=defined_function.func
        var arity=defined_function.arity
        var arg_list=[]
        var func_name=node[0]
        for(var argi=1;argi<=arity;argi++){
            
            if(false)
            if(func_name=='def_func') //throw new Error()
                out("node:",node)

            var dont_defer_cond=(func_name=='def_func' && argi<=2)
            //out("defer_cond",defer_cond,node[argi])
            
            var is_deferred:boolean=func_name in deferred
            if(dont_defer_cond) is_deferred=false
            
            var pushed=is_deferred?node[argi]:node_exec(node[argi])
            arg_list.push(pushed)
        }
        if(false)out("func_name:",func_name,"|","arg_list:",arg_list)
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
