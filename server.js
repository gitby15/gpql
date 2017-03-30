/**
 * Created by timl on 2017/3/6.
 */
var express = require('express');
var bodyParser = require('body-parser');
var {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
var {makeExecutableSchema} = require('graphql-tools');
var {find, filter} = require('lodash');
var typeDefs = [`
type Query {
  employees(
  name: String,
  id:Int
  ):[Employee],
  littleBrothers:[LittleBrother]
}

type Bello {
  name: String,
  age: Int
}


type Employee {
  id:String,
  name:String,
  age(fullYear:Boolean):Int,
  littleBrothers:[LittleBrother]
}

type LittleBrother {
  id:String,
  name:String,
  skill:[String],
  bigBrother:Employee
  count:Int
}

input EmployeeMsg {
  id: Int,
  name: String,
  age: Int,
}

type Mutation {
  hire(employee:EmployeeMsg):Employee,
  fire(id:Int!):Boolean
}


schema {
  query: Query
  mutation: Mutation
}`];

let d_littleBrothers = [
  {
    id: "1201",
    name: 'tony',
    skill: ["降龙十八掌", "猴子偷桃"],
    bigBrother: '1101',
    count: 20
  },
  {
    id: "1202",
    name: 'Michael',
    skill: ["菜刀", "双节棍"],
    bigBrother: '1101',
    count: 2
  },
  {
    id: "1203",
    name: 'Bob',
    skill: ["太极拳", "手枪"],
    bigBrother: '1101',
    count: 40
  }, {
    id: "2201",
    name: 'Ben',
    skill: ["卖萌", "哭"],
    bigBrother: '1102',
    count: 0
  }
];

let d_employees = [
  {
    id: 1101,
    name: "Jack Ma",
    age: 58,
    littleBrothers: [1201, 1202, 1203]
  }, {
    id: 1102,
    name: "Jackson Ma",
    age: 18,
    littleBrothers: [
      2201,
    ]
  }, {
    id: 1103,
    name: "Tim Li",
    age: 18,
    littleBrothers: []
  }
];

var resolvers = {
  Query: {
    employees(_, param){
      let _param = {};
      for (let key in param) {
        if (param[key]) {
          _param[key] = param[key];
        }
      }
 //     console.log('---', _param, '---');
      return filter(d_employees, _param);
    },
    littleBrothers(){
      return d_littleBrothers;
    }
  },
  Mutation: {
    hire(_, employee){
      let param = employee.employee;
      if (param.id === undefined) {
        param.id = (Math.random() * 10000).toFixed(0);
      }
      d_employees.push(param);
      return param;
    },
    fire(_, param){
      let result = false;
      let temp = []
      temp = d_employees.map(function (elem, idx, list) {
        if (elem.id !== param.id) {
          return elem;
        } else {
          result = true;
        }
      });
     // console.log(temp);
      d_employees = temp;
      return result;
    }
  },

  Employee: {
    age(employee,param) {
      let result = employee.age;
      if(param.fullYear) {
        result++;
      }
      return result;
    },
    littleBrothers(employee) {
      var ep = employee.littleBrothers || [];
      return ep.map(function (elem) {
        return find(d_littleBrothers, {id: elem});
      });
    }
  },

  LittleBrother: {
    bigBrother(littleBrother) {
      return find(d_employees, {id: littleBrother.bigBrother});
    }
  },


  // Query1: {
  //   hello(root) {
  //     return 'world';
  //   },
  //   bello(){
  //     return [{
  //       name: 'belo1',
  //       age: 5
  //     }, {
  //       name: 'belo2',
  //       age: 4
  //     }, {
  //       name: 'belo3',
  //       age: 6
  //     }]
  //   },
  //
  //   employees(){
  //     return [
  //       {
  //         id: "1101",
  //         name: "Jack Ma",
  //         age: 58,
  //         littleBrothers: []
  //       }, {
  //         id: "1102",
  //         name: "Jackson Ma",
  //         age: 18,
  //         littleBrothers: [
  //           "2201",
  //         ]
  //       }, {
  //         id: "1103",
  //         name: "Tim Li",
  //         age: 18,
  //         littleBrothers: []
  //       }
  //     ]
  //   },
  //
  //   littleBrothers(){
  //     return [
  //       {
  //         id: "1201",
  //         name: 'tony',
  //         skill: ["降龙十八掌", "猴子偷桃"],
  //         count: 20
  //       },
  //       {
  //         id: "1202",
  //         name: 'Michael',
  //         skill: ["菜刀", "双节棍"],
  //         count: 2
  //       },
  //       {
  //         id: "1203",
  //         name: 'Bob',
  //         skill: ["太极拳", "手枪"],
  //         count: 40
  //       }, {
  //         id: "2201",
  //         name: 'Ben',
  //         skill: ["卖萌", "哭"],
  //         count: 0
  //       }
  //     ]
  //   },
  //
  // }
};

var schema = makeExecutableSchema({typeDefs, resolvers});
var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
console.log('------------------------------------------------');


