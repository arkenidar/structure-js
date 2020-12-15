import { out, out1, node_exec, nodes_build, variables, exec_source } from "./nodes.js";
var Tests;
(function (Tests) {
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
        var source2 = `
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
    end`;
        var words2 = source2.split("|");
        words2 = words2.map(word => word.trim());
        out("split test:", JSON.stringify(words1) == JSON.stringify(words2));
    }
    //test_parse_split_exec()
    function test_parse_split_exec() {
        out("test_parse_split_exec()");
        var source = `
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
    end`;
        exec_source(source);
    }
    //test_multiline_strings()
    function test_multiline_strings() {
        out("test_multiline_strings()");
        var source = `begin|
    out1|"line1\nline2"|
    out1|line1\nline2|
    out1|line1
line2|end
    `;
        exec_source(source);
        var words = source.split("|");
        words = words.map(word => word.trim());
        out(words);
    }
    //test_parse_less_quotes()
    function test_parse_less_quotes() {
        out("test_parse_less_quotes()");
        var source = `
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
    end`;
        exec_source(source);
    }
    test_program_count();
    function test_program_count() {
        out("test_program_count()");
        var source = `
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
    `;
        exec_source(source);
    }
})(Tests || (Tests = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUE7QUFFL0UsSUFBTyxLQUFLLENBc0xYO0FBdExELFdBQU8sS0FBSztJQUNSLHVCQUF1QjtJQUN2QixTQUFTLG1CQUFtQjtRQUN4QixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUM5QiwyREFBMkQ7UUFDM0QsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUM7UUFDL0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5Qjs7OztVQUlFO1FBQ0YsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsU0FBUyxvQkFBb0I7UUFDekIsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDOUIsSUFBSSxNQUFNLEdBQUcsa0NBQWtDLENBQUM7UUFDaEQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5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