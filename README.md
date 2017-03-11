# json2caml

JavaScript module to convert JS/JSON objects to CAML markup. CAML markup is used in Microsoft SharePoint as a query language.

Can be used to retain IDE IntelliSense and highlighting while building your queries instead of having queries as strings.

## Installation

### npm and module bundler (e.g. Browserify)

`npm i json2caml`
```
var json2caml = require('json2caml');
```

### Include as standalone js file
Get from Github: [minified](dist/json2caml.min.js) or [full](dist/json2caml.js)
```
<script src="/path/to/json2caml.js"></script>
```

## Usage

```
var query = {
    "OrderBy": {
        "Name": "Id",
        "Ascending": true
    },
    "Where": {
        "Operator": "And",
        "Children": [
            {
                "Operator": "Contains",
                "Name": "TestField",
                "Type": "Text",
                "Value": "Simple"
            },
            {
                "Operator": "Eq",
                "Name": "TestField2",
                "Type": "Text",
                "Value": "Simple as this"
            }
        ]
    }
};

var camlQuery = json2caml(query);
```

Note that most of the CAML specific properties and values (operators, types, orderby/where) are case-insensitive so you can use camel case or pascal case or whatever else you fancy.

### Options
json2caml accepts second parameter for options. All available options are listed below.

Example: `json2caml(query, { includeViewAndQuery: false })`

| Option              | Default value |
| ------------------- | ------------- |
| includeViewAndQuery | true          |

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Make your changes and run tests (`gulp test`)
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Licensed under MIT License

Copyright 2017 Niklas Engblom

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.