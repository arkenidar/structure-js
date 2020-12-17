import {out,out1,node_exec,nodes_build,variables,
    exec_source,def_func} from "./nodes.js"

// tsc && node Tests
// npm run test

module Tests {
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

    test_parse_less_quotes()
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

    out(`
    //======================================================
    // SECTION: function definition mechanisms.
    // (currently very WIP)
    `)
    
    //test_func_def()
    function test_func_def(){
        var test_node=nodes_build(["out1","success"],0)[0]
        //node_exec(test_node) // success
        def_func("func_test",0,test_node)
        //out("definitions_func",definitions_func)
        exec_source("func_test")
    }
    
    //test_func_def_2()
    function test_func_def_2(){
        /*
        var test_node=nodes_build(["out1","success1"],0)[0]
        //node_exec(test_node) // success
        func("func_test1",0,test_node)
        */

        exec_source(`
        def_func|func_test2|0|out1|success2
        `)
        //out("definitions_func",definitions_func)
        exec_source("func_test2")
    }

    ///test_func_def_args_1()
    function test_func_def_args_1(){
        // arguments tests
        exec_source("def_func|func_test_arg|1|arg|0")
        exec_source("out1|func_test_arg|abc")

        exec_source(`
        begin|
        def_func|func_test_arg2|1|arg|0|
        out1|func_test_arg2|xyz|
        end
        `)
    }
    
    //test_func_def_args_2_power()
    function test_func_def_args_2_power(){
        // dont|def_func|:power|1|temp-definition|

        // out1|power|8|
        // out1|call|power|8|
        // def_func|:power|1|expr|arg|0|*|arg|0|
        exec_source(`
        begin|
        
        def_func|:power|1|expr|arg|0|*|arg|0|
        out1|power|8|
        end
        `)
    }

    //test_func_def_recursive1()
    function test_func_def_recursive1(){
        exec_source("def_func|:factorial|1|to-be--pre-defined")
        
        // expr|arg|0|*|factorial|expr|arg|0|-|1
        // arg|0
        // factorial|0
        // 1
        // expr|arg|0|*|factorial|0
        if(true){
        exec_source(`        
        def_func|:factorial|1|
        if3|expr|arg|0|==|0|
            1|
            expr|arg|0|*|factorial|expr|arg|0|-|1
        `)
        }

        exec_source(`
        begin|

        out1|result of factorial calc:|
        out1|factorial|3|
        end
        `)
    }

    //test_func_def_recursive2()
    function test_func_def_recursive2(){

        /*
        def_func|:factorial|1|
        if3|expr|arg|0|==|0|
            1|
            expr|arg|0|*|factorial|expr|arg|0|-|1|
        */

        out("definition and use of a recursive function.")
        exec_source(`begin|

        def_func|:factorial|1|recursive-predef|
        
        def_func|:factorial|1|
        if3|expr|arg|0|==|0|
            1|
            expr|arg|0|*|factorial|expr|arg|0|-|1|

        out1|factorial calc:|
        out1|factorial|4|
        end`)
    }
    
    //test_func_def_recursive_shortened()
    function test_func_def_recursive_shortened(){

        // messy code traces, original goal not reached,
        // new understandings led to new goals.

        ///dont|def_func|expr|:|+|arg|0|arg|1|recursive-predef|

        // original goal
        out("definition and use of a recursive function with rec_func.")
        
        exec_source(`begin|
        def_func|:rec_func|2|predef|
        def_func|:factorial|1|recursive-predef|
        end`)
        
        exec_source(`begin|

        def_func|:rec_func|2|begin|
            out1|arg|0|
            out1|arg|1|
            dont|out1|expr|:|+|arg|0|
            def_func|arg|0|arg|1|recursive-predef|
        end|

        
        dont|rec_func|:factorial|1|

        if3|false|
        def_func|:factorial|1|recursive-predef|
        do-nothing|

        def_func|:factorial|1|
        if3|expr|arg|0|==|0|
        1|
        expr|arg|0|*|factorial|expr|arg|0|-|1|

        out1|factorial calculation:|
        out1|factorial|4|

        end`)
    }

    //arguments_test_1()
    function arguments_test_1(){
        var source=`
        begin|

        set|func_name|:name|
        
        out1|get|func_name|
        def_func|get|func_name|0|
            out1|called|
        
        name|

        end`
        exec_source(source)
    }


}
