---
type: project-task
status: in-progress
owner: 秘书处/调度中心
priority: high
area: brand-seo
source: docs/superpowers/plans/2026-07-26-maverenne-migration-roadmap.md
review_date: 2026-08-07
---

# ACT-2026-07-26｜Maverenne 品牌迁移准备

## 结果

在不影响当前生产站和商品销售状态的前提下，完成 Maverenne 名称清查、品牌迁移技术预检、客户可见文案审计和旧 URL 证据准备；名称门槛通过后才开始隔离分支的品牌事实源实施。

## 验收

- [ ] USPTO/WIPO/域名/社交名称形成带来源与时间的只读清查记录；明确非法律意见。
- [x] 技术预检完成：已识别 `/api/health`、`BASE_URL`、`AUTH_URL`、build-time env、schema 来源、rewrite 语义和 Prisma 依赖问题。
- [x] 内容与品牌只读审计完成：客户可见表面已按保留、改写、删除入口和禁用承诺分类。
- [x] 增长与数据只读审计完成：确认当前缺少逐 URL 的 GSC/Bing/GA4/Pinterest 证据，不作 keep/rewrite/redirect 猜测。
- [ ] 名称门槛通过后，阶段一 Task 2 才可开始；未通过则退回命名。
- [ ] 域名购买、外部平台写入和生产部署分别取得明确授权后才执行。

## 阻塞与依赖

- 名称清查结果尚未回收。
- GSC、Bing、GA4、Pinterest 的逐路径只读导出尚未取得；无证据 URL 保持 `keep/待确认`，不得重定向到首页。
- 本地 `@prisma/client` 缺失会阻塞 clean build；代码任务开始前须运行 `npm ci` 与 `npx prisma generate` 并验证可解析。
- 商品、支付、库存、定价与当前销售状态不在本行动变更范围。

## 关联

- [Maverenne 设计规格](../../docs/superpowers/specs/2026-07-26-maverenne-brand-repositioning-design.md)
- [三阶段迁移路线图](../../docs/superpowers/plans/2026-07-26-maverenne-migration-roadmap.md)
- [公司策略](../../docs/company/strategy.md)
- [本周优先级](../../docs/company/weekly-priorities.md)
- [公司决策日志](../../docs/company/decision-log.md)
- [[../06-决策与复盘/关键决策/DEC-2026-07-26｜批准 Maverenne 品牌重定位设计]]
