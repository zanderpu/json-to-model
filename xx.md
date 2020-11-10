### Flutter JSON To Model

[https://czero1995.github.io/json-to-model/](https://czero1995.github.io/json-to-model/)

![//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/904e6b0f3048460cbdd7018b06b67ad3~tplv-k3u1fbpfcp-zoom-1.image](https://tva1.sinaimg.cn/large/0081Kckwgy1gkjvsdnwxxj313s0pnq6n.jpg)



### BackGround

------

 In the development process, the server usually returns data in JSON format. For web developers (JavaScript, TypeScript), you can directly get JSON data to do our logic.

```JSON itself originated from JavaScript, and JavaScript parsing and processing JSON has natural advantages```

But in strongly typed languages like **Java** and **Dart**, we need to transfer JSON data to model objects for use.

* Under normal circumstances, we will use some third-party libraries to dynamically transform the Model, but there is no JSON serialization library like Java’s GSON/Jackson in Flutter.

* Because runtime reflection is disabled in Flutter. The official explanation is that runtime reflection will interfere with Dart’s **Tree Shaking**. Using **Tree Shaking** can remove unused code in the Release version, which can significantly optimize the size of the application.

* Because reflection will be applied to Dart’s reflection function by default, and because of this, it is impossible to realize the function of dynamic conversion to Model.

  

### Several schemes of serialization

------

There are two serialization schemes officially recommended by Flutter：[https://flutter.dev/docs/development/data-and-backend/json](https://flutter.dev/docs/development/data-and-backend/json)

1. Manual serialization of small projects is relatively simple and is more suitable for simple JSON conversion of small projects. However, the project is large or multi-person cooperation, which is prone to errors and difficult to maintain.。

   ```Flutter has a built-in dart:convert library   Manually serialize JSON using dart:convert   ```

2. To use code generation in large and medium-sized projects, you need to use the following three dependency packages to generate models through automatic code generation. This solution is easy to maintain. Since serialized data code no longer needs to be manually written or maintained, you can minimize the risk of abnormalities of serialized JSON data at runtime;

* [json_annotation ](https://pub.dev/packages/json_annotation)

* [json_serializable ](https://pub.dev/packages/json_serializable)

* [build_runner ](https://pub.dev/packages/build_runner)



### Conversion Process

------



1. Add dependency in **pubspec.yaml**.

```
json_annotation: ^3.1.0
json_serializable: ^3.5.0
build_runner: ^1.0.0
```

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25c8f20265864cffb539379e44bc0954~tplv-k3u1fbpfcp-zoom-1.image)

​	

```
Execute Pub get in Android Stuido.
```

2. **New model class(mode/demo_model.dart)**

```
class DemoModel{

}
```

3. **Convert the JSON data requested by the backend into a Model on the web page：**

   **[https://czero1995.github.io/json-to-model/](https://czero1995.github.io/json-to-model/):Website conversion supports the conversion of unlimited levels of nested complex objects.**

   ![//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/904e6b0f3048460cbdd7018b06b67ad3~tplv-k3u1fbpfcp-zoom-1.image](https://tva1.sinaimg.cn/large/0081Kckwgy1gkjvsdnwxxj313s0pnq6n.jpg)

* For example, copy the following JSON data to the web page (left):

```
{

  "code": 0,

  "data": {

​    "avatar": "xxx.png",

​    "id": 7,

​    "float":0.1,

​    "is_deleted": false,

​    "nickname": "nickName",

​    "openId": null,

​    "phone": "13641418383",

​    "store_ids": [1,2],

​    "updated": "2020-11-05 11:53:10",

​    "more":[{"a":1,"b":"b","c":{"c1":0.2,"c2":2}}]

  }

}
```



* Then converted to Model data (on the right):

```
import 'package:json_annotation/json_annotation.dart';

part 'demo_model_data.g.dart'; 

@JsonSerializable(explicitToJson: true)

class DemoModelModel {

​    DemoModelData data;

​    DemoModelModel({

​      this.data,

​      this.code,

​      this.message

​    });

​    factory DemoModelModel.fromJson(Map<String, dynamic> json) => _$DemoModelModelFromJson(json);

​    Map<String, dynamic> toJson() => _$DemoModelModelToJson(this);

}



@JsonSerializable(explicitToJson: true)

class DemoModelData {

​    String avatar;

​    int id;

​    double float;

​    bool is_deleted;

​    String nickname;

​    var openId;

​    String phone;

​    List<int> store_ids; 

​    String updated;

​    List<MoreData> more; 

​    DemoModelData({

​        this.avatar, 

​        this.id, 

​        this.float, 

​        this.is_deleted, 

​        this.nickname, 

​        this.openId, 

​        this.phone, 

​        this.store_ids, 

​        this.updated, 

​        this.more, 

​    });

  factory DemoModelData.fromJson(Map<String, dynamic> json) => _$DemoModelDataFromJson(json);

  Map<String, dynamic> toJson() => _$DemoModelDataToJson(this);

}



@JsonSerializable(explicitToJson: true) 

class MoreData{ 

​    int a;

​    String b;

​    CData c;

​    MoreData({

​        this.a, 

​        this.b, 

​        this.c, 

​    });

​    factory MoreData.fromJson(Map<String, dynamic> json) => _$MoreDataFromJson(json);

​    Map<String, dynamic> toJson() => _$MoreDataToJson(this);

}



@JsonSerializable(explicitToJson: true) 

class CData{ 

​    double c1;

​    int c2;

​    CData({

​        this.c1, 

​        this.c2, 

​    });

​    factory CData.fromJson(Map<String, dynamic> json) => _$CDataFromJson(json);

​    Map<String, dynamic> toJson() => _$CDataToJson(this);

}


```



**Then copy the converted data and overlay it on the demo_model.dart file.**



4. **Execute build_runner**

Execute commands in the project terminal:: 

```
flutter pub run build_runner build
```



After the execution is complete, the **demo_model.g.dart** file will be generated.



### The entire execution process is as follows

![//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bc6bb3edb75410397af822c881b1316~tplv-k3u1fbpfcp-zoom-1.image](https://tva1.sinaimg.cn/large/0081Kckwgy1gkjw9ym6n1g31qi0qohe1.gif)