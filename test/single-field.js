module.exports = {
    eq: {
        queryObject: {
            "Where": {
                "Operator": "Eq",
                "Name": "TestField",
                "Type": "Text",
                "Value": "Simple"
            }
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<Where>',
                        '<Eq>',
                            '<FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value>',
                        '</Eq>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    },
    in: {
        queryObject: {
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
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<Where>',
                        '<In>',
                            '<FieldRef Name="TestInField" />',
                            '<Values>',
                                '<Value Type="Text"><![CDATA[Simple]]></Value>',
                                '<Value Type="Text"><![CDATA[Woot]]></Value>',
                                '<Value Type="Text"><![CDATA[Testing]]></Value>',
                            '</Values>',
                        '</In>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    }
};