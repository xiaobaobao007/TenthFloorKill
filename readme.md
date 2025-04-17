# 十楼杀项目（0.-9 version）

- 测试地址

  ```http://localhost:5500/index.html?account=AAA&url=ws://localhost:8080```

  ```http://localhost:5500/index.html?account=BBB&url=ws://localhost:8080&roomId=1000```
- 无数据库设计
- 登录只需要一个账号即可
- 预计【0.3】
- 预计【0.6】版本为【无英雄】和【带卡牌效果】的测试玩法
- 预计【1.0】版本为【有英雄】和【带卡牌效果】的正式版本

# 帮助

## 游戏内emoji含义

- 房主：🏠
- 情报传递任意方向： 🔄
- 不能被烧毁锁定： 🔒

## 隐性规则

### 情报传递方式

- 情报传递方式为【选择一名玩家】 + 【选择一张情报】
- 带旋转的情报：以选择玩家距离自己最近的方式传递。

```
例子：
我传递旋转密电给我下家，那就是逆时针传递。
我传递旋转密电给我上家，那就是顺时针传递。
我传递旋转密电给非上下家，那就是计算两个方向最近的方式，相等时依旧是逆时针。
```

- 无指定的方式的情报（危险情报）传递规则，右上角会提示【切换】，点击【切换】会改变当前情报的传递方式（方便提醒玩家，切换后的字体会变成斜体）。

# 版本任务

## 当前版本任务

- 危险情报切换后名字进行特殊化处理以提醒玩家。
- 阵营和输赢概念增加。
- 点击查看已接受到的情报。
- 完成【无英雄】和【无卡牌效果】的纯情报传递测试玩法。

## 下版本任务

- 完成【无英雄】和【带卡牌效果】的测试玩法。

## 后续版本任务

- 完成【有英雄】和【带卡牌效果】的正式版本。

# 游戏内事件管理

- 为了快捷开发、客户端所有操作（弹窗、场景切换）全部由服务器控制。

![游戏事件流程图](/resoures/event.png)