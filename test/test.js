var assert = require('assert');
var json2caml = require('../src/json2caml');

describe('Single fields', function() {
    describe('Eq', function() {
        it('should return correct CAML markup', function() {
            var query = {
                "Where": {
                    "Operator": "Eq",
                    "Name": "TestField",
                    "Type": "Text",
                    "Value": "Simple"
                }
            };
            assert.equal(
                '<View><Query><Where><Eq><FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value></Eq></Where></Query></View>', 
                json2caml(query)
            );
        });
    });
    describe('In', function() {
        it('should return correct CAML markup', function() {
            var query = {
                "Where": {
                    "Operator": "In",
                    "Name": "TestInField",
                    "Type": "Text",
                    "Values": [
                        "Simple",
                        "Woot",
                        "Testing"
                    ]
                }
            };
            assert.equal(
                '<View><Query><Where><In><FieldRef Name="TestInField" /><Values><Value Type="Text"><![CDATA[Simple]]></Value><Value Type="Text"><![CDATA[Woot]]></Value><Value Type="Text"><![CDATA[Testing]]></Value></Values></In></Where></Query></View>', 
                json2caml(query)
            );
        });
    });
});

describe('Nested', function() {
    describe('And', function() {
        it('should return correct CAML markup', function() {
            var query = {
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
            assert.equal(
                '<View><Query><Where><And><Contains><FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value></Contains><Eq><FieldRef Name="TestField2" /><Value Type="Text"><![CDATA[Simple as this]]></Value></Eq></And></Where></Query></View>', 
                json2caml(query)
            );
        });
    });

    describe('And & Or', function() {
        it('should return correct CAML markup', function() {
            var query = {
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
                            "Operator": "And",
                            "Children": [
                                {
                                    "Operator": "Eq",
                                    "Name": "TestField2",
                                    "Type": "Text",
                                    "Value": "Simple as this"
                                },
                                {
                                    "Operator": "Or",
                                    "Children": [
                                        {
                                            "Operator": "IsNull",
                                            "Name": "TestField3"
                                        },
                                        {
                                            "Operator": "Neq",
                                            "Name": "TestField4",
                                            "Type": "Text",
                                            "Value": "Passeli"
                                        }
                                    ] 
                                }
                            ]
                        }
                    ]
                }
            };
            assert.equal(
                '<View><Query><Where><And><Contains><FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value></Contains><And><Eq><FieldRef Name="TestField2" /><Value Type="Text"><![CDATA[Simple as this]]></Value></Eq><Or><IsNull><FieldRef Name="TestField3" /></IsNull><Neq><FieldRef Name="TestField4" /><Value Type="Text"><![CDATA[Passeli]]></Value></Neq></Or></And></And></Where></Query></View>', 
                json2caml(query)
            );
        });
    });
});

describe('OrderBy', function() {
        describe('Single', function() {
            it('should return correct CAML markup', function() {
                var query = {
                    "OrderBy": {
                        "Name": "Id",
                        "Ascending": true
                    },
                    "Where": {
                        "Operator": "Gt",
                        "Name": "Id",
                        "Type": "Integer",
                        "Value": "3"
                    }
                };

                assert.equal(
                    '<View><Query><OrderBy><FieldRef Name="Id" Ascending="true" /></OrderBy><Where><Gt><FieldRef Name="Id" /><Value Type="Integer">3</Value></Gt></Where></Query></View>', 
                    json2caml(query)
                );
            });
        });

        describe('Multiple', function() {
            it('should return correct CAML markup', function() {
                var query = {
                    "OrderBy": [
                        {
                            "Name": "Id",
                            "Ascending": true
                        },
                        {
                            "Name": "Title",
                            "Ascending": false
                        }
                    ],
                    "Where": {
                        "Operator": "Geq",
                        "Name": "Id",
                        "Type": "Integer",
                        "Value": "3"
                    }
                };

                assert.equal(
                    '<View><Query><OrderBy><FieldRef Name="Id" Ascending="true" /><FieldRef Name="Title" Ascending="false" /></OrderBy><Where><Geq><FieldRef Name="Id" /><Value Type="Integer">3</Value></Geq></Where></Query></View>', 
                    json2caml(query)
                );
            });
        });
    });