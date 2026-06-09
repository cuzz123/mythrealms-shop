# MythRealms Google Merchant Center 设置指南

## 第一步：创建账号
1. 打开 https://merchants.google.com
2. 用你的 Google 账号登录
3. 点击"创建 Merchant Center 账号"
4. 填写：
   - 商家名称: MythRealms
   - 国家/地区: United States
   - 时区: Eastern Time

## 第二步：配置商品 Feed
1. 左侧菜单 → 商品 → Feed
2. 点击"+" 添加 Feed
3. 选择"主要 Feed"
4. 设置：
   - 目标国家/地区: United States
   - 语言: English
   - Feed 名称: MythRealms Products
   - 输入方式: 定期提取
   - Feed 网址: `https://mythrealms-shop.vercel.app/api/feed/google`
   - 提取频率: 每天
5. 点击"创建 Feed"

## 第三步：验证网站
1. 设置 → 商家信息 → 网站
2. 输入: `https://mythrealms-shop.vercel.app`
3. 选择验证方式：
   - 推荐: 使用 Google Analytics（你的 GA4 已在运行）
   - 备选: 新增 HTML 标记

## 第四步：运费设置
1. 设置 → 运费和退货
2. 配置：
   - 美国满 $69.99 免运费
   - 标准运费: $4.99
   - 处理时间: 2-3 周（手工制作）

## 第五步：税费设置
1. 设置 → 营业税
2. 根据你的业务结构配置

## 第六步：关联 Google Ads（可选）
1. 设置 → 已关联的账号 → Google Ads
2. 关联后可用于 Performance Max 广告 campaign

## Feed 网址
```
https://mythrealms-shop.vercel.app/api/feed/google
```

## 说明
- Feed 每天自动更新（由 Google 定期抓取）
- 新产品自动出现在 Feed 中
- 库存为 0 的商品自动标记为 "out_of_stock"
- 价格取产品最低变体价格
