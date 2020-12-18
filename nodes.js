var definitions = {
    expr, if3, out1, set, get, setk, getk, loop, dont, len, def_func, arg, ifunc: def_func
};
// defer: skip and postpone node_exec()
var deferred = {
    if3, loop, dont, def_func, ifunc: def_func
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
    // REMOVED: func_name.substring(1) for colon name trick :name
    definitions_func[func_name] = { func_def: func_def_inner, func_arity: arity };
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
    // immediate evaluation after creating such node.
    // implementation: node of type immediate? (reserved name) NO
    // implementation: nodes marked with exclamation mark NO
    // implementation: only def_func is immediately evaluated after node creation
    if (Array.isArray(out_nodes) && out_nodes[0] == "def_func") {
        node_exec(out_nodes); // evaluated
        // exec only 1 time, by removing node, or ignoring it
        out_nodes = ["dont", out_nodes]; // kept but ignored node
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFJLFdBQVcsR0FBaUM7SUFDNUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFFBQVE7Q0FBQyxDQUFBO0FBQzlFLHVDQUF1QztBQUN2QyxJQUFJLFFBQVEsR0FBaUM7SUFDekMsR0FBRyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEtBQUssRUFBQyxRQUFRO0NBQUMsQ0FBQTtBQUMxQyxNQUFNLENBQUMsSUFBSSxTQUFTLEdBQW9CLEVBQUUsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBVSxJQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDMUQsTUFBTSxVQUFVLElBQUksQ0FBQyxHQUFPLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFFakQsMkJBQTJCO0FBQzNCLElBQUksZ0JBQWdCLEdBQXdFLEVBQUUsQ0FBQTtBQUM5RixJQUFJLEtBQUssR0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3BCLE1BQU0sVUFBVSxRQUFRLENBQUMsU0FBZ0IsRUFBRSxVQUFpQixFQUFFLElBQWM7SUFFeEUsSUFBSSxLQUFLLEdBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQy9CLElBQUcsS0FBSztRQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRTVELDZEQUE2RDtJQUM3RCxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBQyxF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