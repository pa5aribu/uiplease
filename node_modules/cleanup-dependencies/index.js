#! /usr/bin/env node

/*
 * @uthor : Umakant Gundeli <umakant.gundeli@gmail.com>
 * purpose : cleanup un-used dependencies in node project. 
 */

var _ = require('underscore'),
    uniq = require('array-uniq'),
    fs = require('fs-extra'),
    execFile = require('child_process').execFile,
    jsonupdate = require('jsonfile');

fs.readFile("./package.json", function(err, data) {
    var pjson;


    if (err) throw err;
    if (data != undefined && data != null) {
        pjson = JSON.parse(data);
        if (pjson == undefined) {
            console.log("please make sure you are in correct project foler.");
        } else {
            var dependencies = [];
            for (i in pjson.dependencies) {
                dependencies.push(i);
            }
        }
    }

    execFile('find', ['./'], function(err, stdout, stderr) {
        var file_list = stdout.split('\n');
        var file_filtered_list = [];
        _.each(file_list, function(file) {
            if (file.indexOf("node_modules") > -1 ||
                file.indexOf("package.json") > -1 ||
                file.indexOf(".md") > -1 ||
                file.indexOf(".log") > -1 || 
                file.indexOf(".pid") > -1 ||
                file.indexOf(".seed") > -1 ||
                file.indexOf(".lock-wscript") > -1){} 
            else
                file_filtered_list.push(file);
        });

        var used_deps = [];

        _.each(file_filtered_list, function(file) {
            if (file != '' && !fs.lstatSync(file).isDirectory()) {
                var data = fs.readFileSync(file);
                if (data == undefined || data == null) {} else {
                    for (depKey in pjson.dependencies) {
                        if (data != undefined && data != null && (data.toString().indexOf(depKey)) > -1) {
                            used_deps.push(depKey);
                        }
                    }
                    used_deps = uniq(used_deps);
                }
            }
        });
        //alter package.json's dependencies
        var dependencies = pjson.dependencies;
        var unused_deps = [];
        for (depKey in dependencies) {
            if (used_deps.toString().indexOf(depKey) == undefined || used_deps.toString().indexOf(depKey) == -1) {
                unused_deps.push(depKey);
                delete dependencies[depKey];
            }
        }
        pjson.dependencies = dependencies;
        jsonupdate.writeFileSync('./package.json', pjson, {
            spaces: 2
        });
        console.log("Successfully cleaned up these un-used dependencies : ", unused_deps);
    });
});