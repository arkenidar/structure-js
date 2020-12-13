"use strict";
var definitions = { expr: expr, if3: if3, out1: out1, set: set, get: get, setk: setk, getk: getk, loop: loop, dont: dont, len: len };
var deferred = { if3: if3, loop: loop, dont: dont }; // skip and postpone node_exec()
var variables = {};
function out() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log.apply(console, args);
}
function out1(arg) { console.log(arg); }
//test_sequence_basic()
function test_sequence_basic() {
    out1("test_sequence_basic()");
    //var source='if3|expr|3|==|expr|1|+|2|"Equal"|"Not-Equal"'
    var source = 'out1|10|out1|20';
    var words = source.split("|");
    /*
    var nodes=nodes_build(words,0)
    out("result:\t",nodes[0])
    out("node_exec:",node_exec(nodes[0]))
    */
    node_exec(nodes_build(words, 0)[0]);
    node_exec(nodes_build(words, 2)[0]);
    var sequence = [nodes_build(words, 0)[0], nodes_build(words, 2)[0]];
    out(sequence);
    node_exec(sequence);
}
//test_sequence_basic2()
function test_sequence_basic2() {
    out("test_sequence_basic2()");
    var source = 'set|"n"|1|out1|expr|get|"n"|+|10';
    var words = source.split("|");
    node_exec(nodes_build(words, 0)[0]);
    out("variables", variables);
    node_exec(nodes_build(words, 3)[0]);
}
//test_sequence_basic3()
function test_sequence_basic3() {
    out("test_sequence_basic3()");
    var source = 'begin|set|"n"|2|out1|get|"n"|out1|expr|get|"n"|+|10|end';
    var words = source.split("|");
    var nodes = nodes_build(words, 0)[0];
    //out(JSON.stringify(nodes))
    node_exec(nodes);
    //node_exec(nodes_build(words,3)[0])
}
//test_loop()
function test_loop() {
    out("test_loop()");
    var source = 'begin|set|"n"|1|loop|expr|get|"n"|"<"|11|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|2|expr|get|"n"|"+"|" even number"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end';
    exec_source(source);
}
//test_loop2()
function test_loop2() {
    out("test_loop2()");
    var source = 'begin|set|"n"|1|loop|expr|get|"n"|"<"|21|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|" FizzBuzz: multiple of both 3 and 5"|if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|" Fizz: multiple of 3"|if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|" Buzz: multiple of 5"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end';
    exec_source(source);
}
//test_parse_split()
function test_parse_split() {
    out("test_parse_split()");
    var source1 = 'begin|set|"n"|1|loop|expr|get|"n"|"<"|21|begin|out1|if3|expr|0|"=="|expr|get|"n"|"%"|15|expr|get|"n"|"+"|" FizzBuzz: multiple of both 3 and 5"|if3|expr|0|"=="|expr|get|"n"|"%"|3|expr|get|"n"|"+"|" Fizz: multiple of 3"|if3|expr|0|"=="|expr|get|"n"|"%"|5|expr|get|"n"|"+"|" Buzz: multiple of 5"|get|"n"|set|"n"|expr|get|"n"|+|1|end|end';
    var words1 = source1.split("|");
    var source2 = "\n    begin|\n    set|\"n\"|1|\n    loop|\n        expr|get|\"n\"|\"<\"|21|\n        \n    begin|\n        out1|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|15|expr|get|\"n\"|\"+\"|\n            \" FizzBuzz: multiple of both 3 and 5\"|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|3|expr|get|\"n\"|\"+\"|\n            \" Fizz: multiple of 3\"|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|5|expr|get|\"n\"|\"+\"|\n            \" Buzz: multiple of 5\"|\n        get|\"n\"|\n\n        set|\"n\"|expr|get|\"n\"|+|1|\n    end|\n    end";
    var words2 = source2.split("|");
    words2 = words2.map(function (word) { return word.trim(); });
    out("split test:", JSON.stringify(words1) == JSON.stringify(words2));
}
//test_parse_split_exec()
function test_parse_split_exec() {
    out("test_parse_split_exec()");
    var source = "\n    begin|\n    set|\"n\"|1|\n    loop|\n        expr|get|\"n\"|\"<\"|21|\n        \n    begin|\n        out1|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|15|expr|get|\"n\"|\"+\"|\n            \" FizzBuzz: multiple of both 3 and 5\"|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|3|expr|get|\"n\"|\"+\"|\n            \" Fizz: multiple of 3\"|\n        if3|expr|0|\"==\"|expr|get|\"n\"|\"%\"|5|expr|get|\"n\"|\"+\"|\n            \" Buzz: multiple of 5\"|\n        get|\"n\"|\n\n        set|\"n\"|expr|get|\"n\"|+|1|\n    end|\n    end";
    exec_source(source);
}
//test_multiline_strings()
function test_multiline_strings() {
    out("test_multiline_strings()");
    var source = "begin|\n    out1|\"line1\nline2\"|\n    out1|line1\nline2|\n    out1|line1\nline2|end\n    ";
    exec_source(source);
    var words = source.split("|");
    words = words.map(function (word) { return word.trim(); });
    out(words);
}
//test_parse_less_quotes()
function test_parse_less_quotes() {
    out("test_parse_less_quotes()");
    var source = "\n    begin|\n    set|n|1|\n    loop|\n        expr|get|n|<|21|\n        \n    begin|\n        out1|\n        if3|expr|0|==|expr|get|n|%|15|expr|get|n|+|\n            \" FizzBuzz: multiple of both 3 and 5\"|\n        if3|expr|0|==|expr|get|n|%|3|expr|get|n|+|\n            \" Fizz: multiple of 3\"|\n        if3|expr|0|==|expr|get|n|%|5|expr|get|n|+|\n            \" Buzz: multiple of 5\"|\n        get|n|\n\n        set|n|expr|get|n|+|1|\n    end|\n    end";
    exec_source(source);
}
test_program_count();
function test_program_count() {
    out("test_program_count()");
    var source = "\n    begin|\n    set|counters|{\"a\":0,\"e\":0,\"i\":0,\"o\":0,\"u\":0}|\n    set|phrase|hello everyone|\n    out1|get|phrase|\n    set|n|0|\n    out1|get|counters|\n\n    loop|expr|get|n|<|len|phrase|\n    begin|\n        dont|out1|get|n|\n        \n        set|letter|getk|get|n|phrase|\n        dont|out1|get|letter|\n        \n        set|increment|if3|expr|get|letter|in|get|counters|1|0|\n        dont|out1|get|increment|\n\n        if3|expr|1|==|get|increment|\n            setk|get|letter|counters|expr|1|+|getk|get|letter|counters|\n            pass|\n\n        set|n|expr|get|n|+|1|\n    end|\n    \n    out1|counted:|\n    out1|get|counters|\n    end\n    ";
    exec_source(source);
}
//=========================
function exec_source(source) {
    var words = source.split("|");
    words = words.map(function (word) { return word.trim(); });
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
function nodes_build(words, word_index) {
    var _a;
    var current_word = words[word_index];
    var out_nodes = [];
    var total_size = 1;
    if (current_word == "begin") { // sequence
        var sequence = [];
        var size = 1;
        var cur_index = word_index + 1;
        while (words[cur_index] != "end") {
            _a = nodes_build(words, cur_index), out_nodes = _a[0], total_size = _a[1];
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
        var _b = nodes_build(words, word_index), built_node = _b[0], size = _b[1];
        out_nodes.push(built_node);
        word_index += size;
        total_size += size;
    }
    return [out_nodes, total_size];
}
function node_exec(node) {
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
        return func.apply(void 0, arg_list);
    }
    else if (Array.isArray(node)) {
        for (var _i = 0, node_1 = node; _i < node_1.length; _i++) {
            var subnode = node_1[_i];
            node_exec(subnode);
        }
    }
    else {
        return node;
    }
}
//# sourceMappingURL=nodes.js.map