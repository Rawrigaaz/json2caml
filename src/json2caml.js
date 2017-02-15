/**
 * @license
 * Copyright (c) 2017 Niklas Engblom
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = json2caml;
    } 
    else {
        window.json2caml = json2caml;
    }

    function json2caml(object) {
        if(!object || typeof object != 'object' || object instanceof Array) {
            console.error('jsonToCaml only accepts object as a paramter.');
            return undefined;
        }

        var query = object;

        var view = getPropertyValue('view', query);
        if(view) query = view;

        var q = getPropertyValue('query', query);
        if(q) query = q;

        if(!query || !validateStructure()) {
            console.error('Query is not valid. Make sure you have added all required nodes.');
            return null;
        }

        var currentNode;
        var camlQuery = '<View><Query>{query}</Query></View>'

        var orderBy = getPropertyValue('orderBy', query);
        if(orderBy) {
            var fieldRefs = [];
            if(orderBy instanceof Array) {
                for(var i = 0, len = orderBy.length; i < len; i++) {
                    fieldRefs.push(getFieldRef({
                        name: getPropertyValue('name', orderBy[i]),
                        ascending: !!getPropertyValue('ascending', orderBy[i])
                    }));
                }
            }
            else {
                fieldRefs.push(getFieldRef({
                    name: getPropertyValue('name', orderBy),
                    ascending: !!getPropertyValue('ascending', orderBy)
                }));
            }
            
            var orderByCaml = ''.concat(
                '<OrderBy>',
                    fieldRefs.join(''),
                '</OrderBy>'
            );

            camlQuery = camlQuery.replace('{query}', orderByCaml + '{query}');
        }

        var where = getPropertyValue('where', query);
        camlQuery = camlQuery.replace('{query}', '<Where>{query}</Where>');
        return camlQuery.replace('{query}', getCamlNode(where));
    }

    function getCamlNode(obj) {
        var operator = getPropertyValue('operator', obj).toLowerCase();
        var nodeCaml, children;
        switch(operator) {
            case 'and':
                nodeCaml = '<And>{child}</And>';
                break;
            case 'or':
                nodeCaml = '<Or>{child}</Or>';
                break;
            case 'eq':
            case 'neq':
            case 'gt':
            case 'geq':
            case 'lt':
            case 'leq':
            case 'contains':
            case 'includes':
                var nodeName = operator.charAt(0).toUpperCase() + operator.substr(1);
                nodeCaml = getNodeWithFieldRefAndValue({
                    nodeName: nodeName,
                    fieldName: getPropertyValue('name', obj),
                    type: getPropertyValue('type', obj),
                    value: getPropertyValue('value', obj)
                });
                break;
            case 'in':
                var type = getPropertyValue('type', obj);
                nodeCaml = ''.concat(
                    '<In>',
                        getFieldRef({name: getPropertyValue('name', obj)}),
                        '<Values>',
                            getPropertyValue('values', obj).map(value => getValueNode({ type: type, value: value })).join(''),
                        '</Values>',
                    '</In>'
                );
                break;
            case 'isnotnull':
            case 'isnull':
                var nodeName = operator == 'isnull' ? 'IsNull' : 'IsNotNull';
                nodeCaml = ''.concat(
                    '<', nodeName, '>',
                        getFieldRef({name: getPropertyValue('name', obj)}),
                    '</', nodeName, '>'
                )
                break;
            case 'beginswith':
            case 'notincludes':
                var nodeName = operator == 'beginswith' ? 'BeginsWith' : 'NotIncludes';
                nodeCaml = getNodeWithFieldRefAndValue({
                    nodeName: nodeName,
                    fieldName: getPropertyValue('name', obj),
                    type: getPropertyValue('type', obj),
                    value: getPropertyValue('value', obj)
                });
                break;
            case 'daterangesoverlap':
                nodeCaml = ''.concat(
                    '<DateRangesOverlap>',
                        getPropertyValue('fieldRefs', obj).map(value => getFieldRef({name: value})).join(''),
                        getValueNode({type: 'DateTime', value: 'Now'}),
                    '</DateRangesOverlap>'
                );
                break;
            case 'membership':
                nodeCaml = ''.concat(
                    '<Membership Type="', getPropertyValue('type', obj), '">',
                        getFieldRef({name: getPropertyValue('name', obj)}),
                    '</Membership>'
                );
                break;
            default:
                throw new Error('Invalid operator: '+operator);
        }

        children = getPropertyValue('children', obj);
        if(children) {
            if(children.length != 2) {
                throw new Error('Children property must have (only) two objects. Used operator: '+operator+'.');
            }

            nodeCaml = nodeCaml.replace(
                '{child}', 
                [getCamlNode(children[0]), getCamlNode(children[1])].join('')
            );
        }

        return nodeCaml;
    }
    function getNodeWithFieldRefAndValue(options) {
        return ''.concat(
            '<', options.nodeName, '>',
                getFieldRef({name: options.fieldName}),
                getValueNode({
                    type: options.type,
                    value: options.value
                }),
            '</', options.nodeName, '>'
        );
    }
    function getFieldRef(options) {
        options.nodeName = 'FieldRef';
        options.closeTag = true;
        return getStartTag(options);
    }
    function getValueNode(options) {
        var value;

        switch(options.type) {
            case 'Text':
                //no need to escape characters when value is inside CDATA
                value = '<![CDATA['+options.value+']]>';
                break;
            case 'DateTime':
                value = getDateTimeValue(options.value);
                break;
            default:
                value = options.value;
        }

        return ''.concat(
            '<Value Type="', options.type, '"', (options.includeTimeValue ? ' IncludeTimeValue="true"' : ''), '>',
                value,
            '</Value>'
        );
    }

    function getDateTimeValue(value) {
        if(value.toLowerCase() == 'now') value = '<Now />';
        else if(value.toLowerCase() == 'today') value = '<Today />';
        else if(value.toLowerCase() == 'month') value = '<Month />';
        return value;
    }

    function getStartTag(options) {
        //convert camel case to pascal case for all attributes
        return ''.concat(
            '<', options.nodeName, ' ',
                Object.keys(options).map((key) => {
                    if(key == 'nodeName' || key == 'closeTag') return '';

                    return ''.concat(key.charAt(0).toUpperCase(), key.substr(1), '="', options[key], '" ');
                }).join(''),
            (options.closeTag ? '/>' : '')
        );
    }

    function getPropertyValue(property, object) {
        var keys = Object.keys(object).filter(key => key.toLowerCase() == property.toLowerCase());

        return keys.length ? object[keys[0]] : undefined;
    }

    function validateStructure() {
        //TODO
        return true;
    }
})();