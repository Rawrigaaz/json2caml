var assert = require('assert');
var json2caml = require('../src/json2caml');

describe('Single fields', () => {
    var singleField = require('./single-field');

    describe('Eq', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                singleField.eq.result,
                json2caml(singleField.eq.queryObject)
            );
        });
    });
    describe('In', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                singleField.in.result, 
                json2caml(singleField.in.queryObject)
            );
        });
    });
});

describe('Nested', () => {
    var nested = require('./nested');

    describe('And', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                nested.and.result, 
                json2caml(nested.and.queryObject)
            );
        });
    });

    describe('And & And & Or', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                nested.andAndOr.result, 
                json2caml(nested.andAndOr.queryObject)
            );
        });
    });
});

describe('OrderBy', () => {
    var orderBy = require('./order-by');
    describe('Single', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                orderBy.single.result, 
                json2caml(orderBy.single.queryObject)
            );
        });
    });

    describe('Multiple', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                orderBy.multiple.result, 
                json2caml(orderBy.multiple.queryObject)
            );
        });
    });

    describe('Without Where', () => {
        it('should return correct CAML markup', () => {
            assert.equal(
                orderBy.withoutWhere.result, 
                json2caml(orderBy.withoutWhere.queryObject)
            );
        });
    })
});