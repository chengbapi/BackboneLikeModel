/**
* Creation Date: 2015-03-13
* Created By: chengbapi@gmail.com
* Last Modified: 2015-03-13
* Last Modified By: chengbapi@gmail.com
* Description:
*/
var should = require("should");
var Model = require("../model");

describe('Model', function(){

    describe('#new()', function(){
        it('instance', function(){
            var model = new Model({ a: 1, b: 2 });

            model.toJSON().should.eql({ a: 1, b: 2 });
        });
    });
    describe('#extend()', function(){
        it('defaults', function(){
            TestModel = Model.extend({
                defaults: { c: 3 }
            });
            var model = new TestModel({ d: 4 });

            model.toJSON().should.eql({ c: 3, d: 4 });
        });
        it('defaults-attr-is-array', function(){
            var testArray = [1, 2, 3, 4];
            TestModel = Model.extend({
                defaults: {
                    arr: testArray
                }
            });
            var model = new TestModel();

            testArray.push(5);
            testArray.should.eql([1,2,3,4,5]);
            model.toJSON().should.eql({
                arr: [1,2,3,4]
            });
        });
        it('defaults-attr-is-object', function(){
            var testObject = { aa: 11, bb: 22 };
            TestModel = Model.extend({
                defaults: {
                    obj: testObject
                }
            });

            var model = new TestModel();
            testObject.cc = 33;

            testObject.should.eql({ aa: 11, bb: 22, cc: 33 });
            model.toJSON().should.eql({
                obj: { aa: 11, bb: 22 }
            });
        });
        it('defaults-multi-extend', function(){
            TestModelA = Model.extend({
                defaults: { c: 3 }
            });
            TestModelB = TestModelA.extend({
                defaults: { d: 4 }
            });
            var model = new TestModelB({ e: 5 });

            model.toJSON().should.eql({ c: 3, d: 4, e: 5 });
        });
        it('defaults-overwrite', function(){
            TestModelA = Model.extend({
                defaults: { a: 1, b: 2, c: 3 }
            });

            var model = new TestModelA({ a: 11, b: 22 });
            model.toJSON().should.be.eql({ a: 11, b: 22 ,c: 3 });
        });
        it('initialize', function(){
            var outer = 0;
            TestModelA = Model.extend({
                defaults: { c: 3 },
                initialize: function() {
                    outer++;
                }
            });

            var model1 = new TestModelA({ d: 4 });
            outer.should.eql(1);
            model1.toJSON().should.be.eql({ c: 3, d: 4 });
            var model2 = new TestModelA({ e: 5 });
            outer.should.eql(2);
            model2.toJSON().should.be.eql({ c: 3, e: 5 });
        });
    });
    describe('#toJSON()', function(){
        it('basic', function(){
            TestModelA = Model.extend({
                defaults: { a: 1 }
            });

            var model = new TestModelA({ b: 2 });
            model.toJSON().should.be.eql({ a: 1, b: 2 })
        });
        it('attribute-is-array', function(){
            TestModelA = Model.extend({
                defaults: {
                    arr: [1,2,3,4]
                }
            });

            var model = new TestModelA();

            var json1 = model.toJSON();
            json1.arr.pop();
            json1.should.be.eql({ arr: [1,2,3] });
            // 原数据不变
            var json2 = model.toJSON();
            json2.should.be.eql({ arr: [1,2,3,4] });
            //console.log(json1);
            //console.log(json2);
        });
        it('attribute-is-object', function(){
            TestModelA = Model.extend({
                defaults: {
                    obj: {
                        a: 1,
                        b: {
                            bb: 2
                        }
                    }
                }
            });

            var model = new TestModelA();

            var json1 = model.toJSON();
            json1.obj.a = 11;
            json1.obj.b.bb = 22;
            json1.obj.b.cc = 33;
            json1.should.be.eql({ obj: { a: 11, b: { bb: 22, cc: 33 } } });
            // 原数据不变
            var json2 = model.toJSON();
            json2.should.be.eql({ obj: { a: 1, b: { bb: 2 } } });
            //console.log(json1);
            //console.log(json2);
        });
    });
});


