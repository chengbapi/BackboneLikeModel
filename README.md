# BackboneLikeModel
一个`Backbone.Model`的替代品
解决Backbone.Model使用中的如下问题

### 1. `model.toJSON`只是attributes的浅拷贝
#### example1 in Backbone

    // ---- Model Module ----
    var model = Backbond.Model({
      defaults {
        obj: { attr1: 1, attr2: 2 },
        arr: [1, 2, 3]
      }
    });
    
    // ---- View Module or somewhere use model.toJSON ----
    var json = model.toJSON();
    // change json data for some reason
    json.obj.attr3 = 3;
    json.arr.push(4);
    
    // ---- next time you use model ----
    model.get('obj');   // { attr1: 1, attr2: 2, attr3: 3 }
    model.get('arr');   // [1, 2, 3, 4]

*不通过set方式一样可以改变model属性的值，带来很大的隐患和debug代价*

#### example1 in BackboneLikeModel


    // ---- Model Module ----
    var model = BackbondLikeModel({
      defaults {
        obj: { attr1: 1, attr2: 2 },
        arr: [1, 2, 3]
      }
    });
    
    // ---- View Module or somewhere use model.toJSON ----
    var json = model.toJSON();
    // change json data for some reason
    json.obj.attr3 = 3;
    json.arr.push(4);
    
    // ---- next time you use model ----
    model.get('obj');   // { attr1: 1, attr2: 2 }
    model.get('arr');   // [1, 2, 3]

**BackboneLikeModel的toJSON方法将返回属性的深拷贝。**

### 2. `model.set`带来的不确定性

#### example2 in Backbone  

    // ---- Model Module ----
    var model = Backbond.Model({
      defaults: {
        arr: [1, 2, 3]
      },
      pushNumberToArr: function(number) {
        var arr = this.get('arr');
        arr.push(number);     // nothing changed
        this.set('arr', arr); // nothing changed neither
      }
    });
    
    // ---- somewhere use model ----
    // change json data for some reason
    model.pushNumberToArr(4);
    
*当属性是对象时，也会发生类似结果*

#### example3 in Backbone      

    // ---- Model Module ----
    var model = Backbond.Model({ 
      defaults: {
        number: 1 
      }
    });
    
    // ---- somewhere use model ----
    // change json data for some reason
    model.set('number', 1);   // nothing happened
    // but you really want the view repainted then
    model.set('number', 0, {silent: true});
    model.set('number', 1);   // make things complicated

** 因此 BackboneLikeModel 中没有实现set方法,以及set导致的`trigger("change:xxx")`的事件**，这些操作建议通过Model的方法根据需求各自实现

#### example2 in BackboneLikeModel 

    // ---- Model Module ----
    var model = BackboneLikeModel({ 
      defaults: {
        arr: [1, 2, 3]
      },
      pushToArr: function(number) {
        this.arr.push(number);
        this.trigger('arrChange');
      }
    });
    
    // ---- somewhere use model ----
    // change json data for some reason
    model.pushNumberToArr(4);
    
#### example3 in BackboneLikeModel 
      
    // ---- Model Module ----
    var model = Backbond.Model({ 
      defaults :{
        number: 1 
      },
      setNumber: function(number) {
        // whether to trigger events depends on you
        //if (number == this.number) {
        //  return;
        //}
        this.number = number;
        this.trigger('numberChange');
      }
    });
    
    // ---- somewhere use model ----
    model.setNumber(1);
  
  
