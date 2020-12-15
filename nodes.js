var definitions = { expr, if3, out1, set, get, setk, getk, loop, dont, len };
var deferred = { if3, loop, dont }; // skip and postpone node_exec()
export var variables = {};
export function out(...args) { console.log(...args); }
export function out1(arg) { console.log(arg); }
//=========================
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
    if (!(current_word in definitions))
        return [json_parse(current_word), 1];
    var current_arity = definitions[current_word].length;
    out_nodes.push(current_word);
    word_index++;
    for (var count = 1; count <= current_arity; count++) {
        var [built_node, size] = nodes_build(words, word_index);
        out_nodes.push(built_node);
        word_index += size;
        total_size += size;
    }
    return [out_nodes, total_size];
}
export function node_exec(node) {
    var type = typeof definitions[node[0]];
    if (type == "function") {
        var func = definitions[node[0]];
        var arity = func.length;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFJLFdBQVcsR0FBaUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsQ0FBQTtBQUMvRixJQUFJLFFBQVEsR0FBaUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFBLENBQUMsZ0NBQWdDO0FBQzdGLE1BQU0sQ0FBQyxJQUFJLFNBQVMsR0FBb0IsRUFBRSxDQUFBO0FBRTFDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFVLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUMxRCxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQU8sSUFBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVqRCwyQkFBMkI7QUFFM0IsTUFBTSxVQUFVLFdBQVcsQ0FBQyxNQUFhO0lBQ3JDLElBQUksS0FBSyxHQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDM0IsS0FBSyxHQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFBLEVBQUUsQ0FBQSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNsQyxJQUFJLEtBQUssR0FBQyxXQUFXLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pDLGtEQUFrRDtJQUNsRCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDcEIsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLGFBQW9CO0lBQzdCLE9BQU8sU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUMx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