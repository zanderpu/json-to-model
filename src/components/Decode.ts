const baseModelTemplete:string = `
import 'package:json_annotation/json_annotation.dart';
part 'index.g.dart'; 

@JsonSerializable(explicitToJson: true)
class TempleteModel {
    TempleteData data;
    int code;
    int message;
    TempleteModel({
      this.data,
      this.code,
      this.message
    });
	
    factory TempleteModel.fromJson(Map<String, dynamic> json) => _$TempleteModelFromJson(json);
    Map<String, dynamic> toJson() => _$TempleteModelToJson(this);
}
`;
const baseModelTempleteData:string = `
import 'package:json_annotation/json_annotation.dart';
part 'index.g.dart'; 

@JsonSerializable(explicitToJson: true)
class TempleteData {
    ContentToDo
    TempleteData({
    thisInit
    });

  factory TempleteData.fromJson(Map<String, dynamic> json) => _$TempleteDataFromJson(json);
  Map<String, dynamic> toJson() => _$TempleteDataToJson(this);
}

`;
const baseModelBottomToJson:string = `

    factory TempleteData.fromJson(Map<String, dynamic> json) => _$TempleteDataFromJson(json);
    Map<String, dynamic> toJson() => _$TempleteDataToJson(this);
`;

enum BaseDataType  {
  String =   "[object String]",
  Number = "[object Number]",
  Boolean = "[object Boolean]",
  Object ="[object Object]",
  Array ="[object Array]",
  Null = "[object Null]",
}

let fileName:string = "";
let createChildTemps:string[] = [];

function isFloat(val:number):boolean{
  if(val === 1){
    return false
  }
  return val % 1 != 0;
}

function getThisInit(obj:object):string {
    let initStr:string = "";
    for (let key in obj) {
      initStr = initStr + `    this.${key}, \n    `;
    }
    return initStr;
}
  
function getBottomToJson(str:string):string {
  return baseModelBottomToJson.replace(/TempleteData/g, str);
}

function judgeType(val:any):string {
  return Object.prototype.toString.call(val);
}

function firstUpperCase(str:string):string {
  let val:string = "";
  str
    .split("_")
    .map(
      (item) =>
        (val =
          val +
          item.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()))
    );
  return val;
}


function createChildData(className:string, obj:object) {
  let value =`@JsonSerializable(explicitToJson: true) \nclass ${className}{ \n    ${getDataType(
    obj
  )}\n    ${className}({\n    ${getThisInit(obj)}});${getBottomToJson(className)} \n}\n\n `;
  createChildTemps.push(value);
}

function getDataType(obj:object):string {
  let result = "";
  for (let key in obj) {
    switch (judgeType(obj[key])) {
      case BaseDataType.String:
        result = `${result}String ${key};\n    `;
        break;

      case BaseDataType.Number:
        result = `${result}${isFloat(obj[key]) ? 'double': 'int'} ${key};\n    `;
        break;

      case BaseDataType.Boolean:
        result = `${result}bool ${key};\n    `;
        break;

      case BaseDataType.Null:
        result = `${result}var ${key};\n    `;
        break;

      case BaseDataType.Object:
        result = `${result}${firstUpperCase(key)}Data ${key};\n    `;
        createChildData(`${firstUpperCase(key)}Data`, obj[key]);
        break;
        
      case BaseDataType.Array:
        if (obj[key].length > 0) {
          switch (judgeType(obj[key][0])) {
            case BaseDataType.Number:
              result = `${result}List<${isFloat(obj[key][0]) ? 'double': 'int'}> ${key}; \n    `;
              break;

            case BaseDataType.String:
              result = `${result}List<String> ${key}; \n    `;
              break;

            case BaseDataType.Object:
              result = `${result}List<${firstUpperCase(key)}Data> ${key}; \n    `;
              createChildData(`${firstUpperCase(key)}Data`, obj[key][0]);
              break;

            case BaseDataType.Array:
              result = `${result}List<${firstUpperCase(key)}Data> ${key}; \n    `;
              createChildData(`${firstUpperCase(key)}Data`, obj[key][0]);
              break;
          }
        } else {
          result = `${result}List<dynamic> ${key}; \n    `;
        }
        break;
    }
  }

  return result;
}


export default function decodeObj(value, filename:string) {
  fileName = filename;
  createChildTemps = [];
  let dataResultString:string = `${firstUpperCase(fileName)}`;
  let dataTypeString:string;
  let isArrayValue:boolean = false;
  if (value.data) {
    value = value.data;
  }
  if (Array.isArray(value)) {
    isArrayValue = true;
    value = value[0];
  }
  dataTypeString = isArrayValue
    ? `List<${firstUpperCase(fileName)}Data>`
    : `${firstUpperCase(fileName)}Data`;
  let tempResult = baseModelTemplete
    .replace(/TempleteModel/g, dataResultString)
    .replace(/TempleteData/, dataTypeString)
    .replace(/index/, fileName);
  let dataParentType:string = getDataType(value);
  let childTempValue:string = "";
  dataParentType = baseModelTempleteData
    .replace(/TempleteData/g, `${firstUpperCase(fileName)}Data`)
    .replace(/ContentToDo/, dataParentType)
    .replace(/index/, fileName)
    .replace(/thisInit/, getThisInit(value));

  createChildTemps.reverse().map((item) => (childTempValue = `${childTempValue}${item}`));

  return `${dataParentType}${childTempValue}`;
}

