var definitions = {
    expr, if3, out1, set, get, setk, getk, loop, dont, len, func,
    arg
};
var deferred = { if3, loop, dont, func }; // skip and postpone node_exec()
export var variables = {};
export function out(...args) { console.log(...args); }
export function out1(arg) { console.log(arg); }
//=========================
var definitions_func = {};
var stack = [];
export function func(func_name, func_arity, node) {
    var func_def;
    func_def = function (...args) {
        stack.push(args);
        var ret_value = node_exec(node);
        stack.pop();
        return ret_value;
    };
    definitions_func[func_name] = { func_def, func_arity };
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
    if (out_nodes[0] === "func")
        node_exec(out_nodes);
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
    var defined_function = get_function(node[0]);
    if (defined_function !== null) {
        var func = defined_function.func;
        var arity = defined_function.arity;
        var arg_list = [];
        for (var argi = 1; argi <= arity; argi++) {
            var pushed = node[0] in deferred ?
                node[argi] : node_exec(node[argi]);
            arg_list.push(pushed);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFJLFdBQVcsR0FBaUM7SUFDNUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUk7SUFDbEQsR0FBRztDQUFDLENBQUE7QUFDUixJQUFJLFFBQVEsR0FBaUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsQ0FBQSxDQUFDLGdDQUFnQztBQUNsRyxNQUFNLENBQUMsSUFBSSxTQUFTLEdBQW9CLEVBQUUsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBVSxJQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDMUQsTUFBTSxVQUFVLElBQUksQ0FBQyxHQUFPLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFFakQsMkJBQTJCO0FBQzNCLElBQUksZ0JBQWdCLEdBQXdFLEVBQUUsQ0FBQTtBQUM5RixJQUFJLEtBQUssR0FBTyxFQUFFLENBQUE7QUFDbEIsTUFBTSxVQUFVLElBQUksQ0FBQyxTQUFnQixFQUFFLFVBQWlCLEVBQUUsSUFBYztJQUNwRSxJQUFJLFFBQVEsQ0FBQTtJQUNaLFFBQVEsR0FBQyxVQUFTLEdBQUcsSUFBVTtRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2hCLElBQUksU0FBUyxHQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM3QixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDWCxPQUFPLFNBQVMsQ0FBQTtJQUNwQixDQUFDLENBQUE7SUFDRCxnQkFBZ0IsQ0FBQyxTQUFT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