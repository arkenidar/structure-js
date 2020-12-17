var definitions = {
    expr, if3, out1, set, get, setk, getk, loop, dont, len, def_func, arg
};
// defer: skip and postpone node_exec()
var deferred = {
    if3, loop, dont, def_func
};
export var variables = {};
export function out(...args) { console.log(...args); }
export function out1(arg) { console.log(arg); }
//=========================
var definitions_func = {};
var stack = [[]];
export function def_func(func_name, func_arity, node) {
    var arity = node_exec(func_arity);
    if (false)
        out("def_func/3()", func_name, node_exec(func_name));
    definitions_func[func_name.substring(1)] = { func_def: func_def_inner, func_arity: arity };
    function func_def_inner(...args) {
        stack.push(args);
        var ret_value = node_exec(node);
        stack.pop();
        return ret_value;
    }
}
function arg(index) {
    return stack[stack.length - 1][index];
}
//==============================================
export function exec_source(source) {
    var words = source.split("|");
    words = words.map(word => word.trim());
    var nodes = nodes_build(words, 0)[0];
    //out(JSON.stringify(nodes,null,4))//spacing-level
    node_exec(nodes);
}
function len(variable_name) {
    return variables[variable_name].length;
}
function get(variable_name) {
    return variables[variable_name];
}
function set(variable_name, value) {
    return variables[variable_name] = value;
}
function getk(key, variable_name) {
    return variables[variable_name][key];
}
function setk(key, variable_name, value) {
    return variables[variable_name][key] = value;
}
function json_parse(current) {
    try {
        return JSON.parse(current);
    }
    catch (e) {
        return current;
    }
}
function expr(a, op, b) {
    if (op == "==")
        return a == b;
    if (op == "+")
        return a + b;
    if (op == "<")
        return a < b;
    if (op == "%")
        return a % b;
    if (op == "in")
        return a in b;
    if (op == "*")
        return a * b;
    if (op == "-")
        return a - b;
}
function if3(condition, case_true, case_false) {
    return node_exec(condition) ? node_exec(case_true) : node_exec(case_false);
}
function loop(condition, while_true_do_this) {
    while (node_exec(condition)) {
        node_exec(while_true_do_this);
    }
}
function dont(node_to_ignore) { }
//=========================================
export function nodes_build(words, word_index) {
    var current_word = words[word_index];
    var out_nodes = [];
    var total_size = 1;
    if (current_word == "begin") { // sequence
        var sequence = [];
        var size = 1;
        var cur_index = word_index + 1;
        while (words[cur_index] != "end") {
            [out_nodes, total_size] = nodes_build(words, cur_index);
            sequence.push(out_nodes);
            size += total_size;
            cur_index += total_size;
        }
        size++;
        return [sequence, size];
    }
    var got_function = get_function(current_word);
    if (got_function === null) {
        // return [json_parse(current_word),1]
        out_nodes = json_parse(current_word);
        total_size = 1;
    }
    else if (got_function !== null) {
        var current_arity = got_function.arity;
        out_nodes.push(current_word);
        word_index++;
        for (var count = 1; count <= current_arity; count++) {
            var [built_node, size] = nodes_build(words, word_index);
            out_nodes.push(built_node);
            word_index += size;
            total_size += size;
        }
    }
    // immediate evaluation after creating such node (node of type immediate? reserved name)
    ///if(Array.isArray(out_nodes) && out_nodes[0]=='def_func') node_exec(out_nodes)
    return [out_nodes, total_size];
}
function get_function(func_name) {
    if (typeof definitions[func_name] === "function") {
        return { func: definitions[func_name], arity: definitions[func_name].length };
    }
    else if (typeof definitions_func[func_name] === "object") {
        return { func: definitions_func[func_name].func_def,
            arity: definitions_func[func_name].func_arity };
    }
    else
        return null;
}
export function node_exec(node) {
    var defined_function = Array.isArray(node) ? get_function(node[0]) : null;
    if (defined_function !== null) {
        var func = defined_function.func;
        var arity = defined_function.arity;
        var arg_list = [];
        var func_name = node[0];
        for (var argi = 1; argi <= arity; argi++) {
            if (false)
                if (func_name == 'def_func') //throw new Error()
                    out("node:", node);
            var dont_defer_cond = (func_name == 'def_func' && argi <= 2);
            //out("defer_cond",defer_cond,node[argi])
            var is_deferred = func_name in deferred;
            if (dont_defer_cond)
                is_deferred = false;
            var pushed = is_deferred ? node[argi] : node_exec(node[argi]);
            arg_list.push(pushed);
        }
        if (false)
            out("func_name:", func_name, "|", "arg_list:", arg_list);
        return func(...arg_list);
    }
    else if (Array.isArray(node)) {
        for (var subnode of node)
            node_exec(subnode);
    }
    else {
        return node;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFJLFdBQVcsR0FBaUM7SUFDNUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxHQUFHO0NBQUMsQ0FBQTtBQUMvRCx1Q0FBdUM7QUFDdkMsSUFBSSxRQUFRLEdBQWlDO0lBQ3pDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLFFBQVE7Q0FBQyxDQUFBO0FBQzNCLE1BQU0sQ0FBQyxJQUFJLFNBQVMsR0FBb0IsRUFBRSxDQUFBO0FBRTFDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFVLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUMxRCxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQU8sSUFBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVqRCwyQkFBMkI7QUFDM0IsSUFBSSxnQkFBZ0IsR0FBd0UsRUFBRSxDQUFBO0FBQzlGLElBQUksS0FBSyxHQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDcEIsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFnQixFQUFFLFVBQWlCLEVBQUUsSUFBYztJQUV4RSxJQUFJLEtBQUssR0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDL0IsSUFBRyxLQUFLO1FBQUMsR0FBRyxDQUFDLGNBQWMsRUFBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFNUQsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUMsUUFBUSxFQUFDLGNBQWMsRUFBQyxVQUFV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