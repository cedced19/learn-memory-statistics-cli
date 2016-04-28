#!/usr/bin/env node

var statistics = require('learn-memory-statistics');
var request = require('request');
var numberToDate = require('number-to-date');
var Pie = require('cli-pie');
var colors = require('colors');
var program = require('commander');
var isUrl = require('is-url');
var pkg = require('./package.json');
var checkUpdate = require('check-update');

require('console-title')('Learn Memory Statistics');

program
  .version(pkg.version)
  .option('-u, --url [url]', 'Set a server url')
  .parse(process.argv);

var url = 'https://cedced19.github.io/learn-memory-static/data.json';
if (typeof program.url !== 'undefined' && isUrl(program.url)) {
  url = program.url;
} else {
  console.log(colors.bold.red('There is no valid url set.'));
}
console.log(colors.cyan(`This url will be used: ${url}\n`));

request(url, function (error, response, body) {
        if (error) return console.log(colors.bold.red('Cannot access to the server.\n'));
        var data = statistics(JSON.parse(body));
        var languages = new Pie(10, [], { legend: true });
        for (var language in data.languages) {
          languages.add({
              label: language,
              value: data.languages[language]
          });
        }
        console.log(colors.bold.cyan('Languages'), '\n', languages.toString(), '\nSome language can be Latin: Latin is hard to detect.\n');
        var subjects = new Pie(10, [], { legend: true });
        for (var subject in data.subjects) {
          subjects.add({
              label: subject,
              value: data.subjects[subject]
          });
        }
        console.log(colors.bold.cyan('Subjects'), '\n', subjects.toString());
        var createdDate = {
          days: new Pie(10, [], { legend: true }),
          months: new Pie(10, [], { legend: true }),
          years: new Pie(10, [], { legend: true })
        };
        for (var day in data.createdDate.days) {
          createdDate.days.add({
              label: numberToDate(day, 'day'),
              value: data.createdDate.days[day]
          });
        }
        console.log(colors.bold.cyan('Date of creation'), '\n', createdDate.days.toString());
        for (var month in data.createdDate.months) {
          createdDate.months.add({
              label: numberToDate(month, 'month'),
              value: data.createdDate.months[month]
          });
        }
        console.log(createdDate.months.toString());
        for (var year in data.createdDate.years) {
          createdDate.years.add({
              label: year,
              value: data.createdDate.years[year]
          });
        }
        console.log(createdDate.years.toString());
        var updatedDate = {
          days: new Pie(10, [], { legend: true }),
          months: new Pie(10, [], { legend: true }),
          years: new Pie(10, [], { legend: true })
        };
        for (var day in data.updatedDate.days) {
          updatedDate.days.add({
              label: numberToDate(day, 'day'),
              value: data.updatedDate.days[day]
          });
        }
        console.log(colors.bold.cyan('Date of the last update'), '\n', updatedDate.days.toString());
        for (var month in data.updatedDate.months) {
          updatedDate.months.add({
              label: numberToDate(month, 'month'),
              value: data.updatedDate.months[month]
          });
        }
        console.log(updatedDate.months.toString());
        for (var year in data.updatedDate.years) {
          updatedDate.years.add({
              label: year,
              value: data.updatedDate.years[year]
          });
        }
        console.log(updatedDate.years.toString());
        checkUpdate({packageName: pkg.name, packageVersion: pkg.version, isCLI: true}, function(err, latestVersion, defaultMessage){
            if(!err){
                console.log('\n', defaultMessage);
            }
        });
});
