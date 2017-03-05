module.exports = {
    single: {
        queryObject: {
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
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<OrderBy>',
                        '<FieldRef Name="Id" Ascending="true" />',
                    '</OrderBy>',
                    '<Where>',
                        '<Gt><FieldRef Name="Id" /><Value Type="Integer">3</Value></Gt>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    },
    multiple: {
        queryObject: {
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
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<OrderBy>',
                        '<FieldRef Name="Id" Ascending="true" />',
                        '<FieldRef Name="Title" Ascending="false" />',
                    '</OrderBy>',
                    '<Where>',
                        '<Geq><FieldRef Name="Id" /><Value Type="Integer">3</Value></Geq>',
                    '</Where>',
                '</Query>',
            '</View>'
        )
    },
    withoutWhere: {
        queryObject: {
            "OrderBy": {
                "Name": "Id",
                "Ascending": true
            }
        },
        result: ''.concat(
            '<View>',
                '<Query>',
                    '<OrderBy>',
                        '<FieldRef Name="Id" Ascending="true" />',
                    '</OrderBy>',
                '</Query>',
            '</View>'
        )
    }
};