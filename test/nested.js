module.exports = {
    and: {
        queryObject: {
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
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<Where>',
                        '<And>',
                            '<Contains><FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value></Contains>',
                            '<Eq><FieldRef Name="TestField2" /><Value Type="Text"><![CDATA[Simple as this]]></Value></Eq>',
                        '</And>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    },
    andAndOr: {
        queryObject: {
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
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<Where>',
                        '<And>',
                            '<Contains><FieldRef Name="TestField" /><Value Type="Text"><![CDATA[Simple]]></Value></Contains>',
                            '<And>',
                                '<Eq><FieldRef Name="TestField2" /><Value Type="Text"><![CDATA[Simple as this]]></Value></Eq>',
                                '<Or>',
                                    '<IsNull><FieldRef Name="TestField3" /></IsNull>',
                                    '<Neq><FieldRef Name="TestField4" /><Value Type="Text"><![CDATA[Passeli]]></Value></Neq>',
                                '</Or>',
                            '</And>',
                        '</And>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    }
};