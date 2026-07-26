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

- [x] USPTO/WIPO/域名/社交名称已形成带来源与时间的只读清查记录，并明确非法律意见；因关键第一方结果不可用，当前 `name_clearance_passed: false`。
- [x] 技术预检完成：已识别 `/api/health`、`BASE_URL`、`AUTH_URL`、build-time env、schema 来源、rewrite 语义和 Prisma 依赖问题。
- [x] Prisma 跟进诊断完成：隔离诊断目录中，Node 24 在引擎缓存齐备后 `prisma generate` 与客户端解析实际退出 0；此前“挂起”校正为首次多平台引擎获取缓慢与外层超时未清理进程树的高置信推断。当前主工作区仍未恢复客户端，单测、lint、build 仍未运行。
- [x] 内容与品牌只读审计完成：客户可见表面已按保留、改写、删除入口和禁用承诺分类。
- [x] 六页 SEO/GEO 草稿已建立 GIA、FTC、Google Search Central 一手来源证据包；通用知识不得外推为 SKU、政策或品牌事实，`/about` 继续阻断。
- [x] 增长与数据只读审计完成：确认当前缺少逐 URL 的 GSC/Bing/GA4/Pinterest 证据，不作 keep/rewrite/redirect 猜测。
- [x] 已执行停止规则：名称门槛未通过，阶段一 Task 2–7 不启动；当前只继续与品牌上线无关的旧 URL 证据审计。
- [ ] 域名购买、外部平台写入和生产部署分别取得明确授权后才执行。

## 阻塞与依赖

- 名称清查已回收但证据不足：USPTO 查询结果不可复核、WIPO 要求验证码、社交用户名状态不可可靠确认、RDAP 404 不等于注册商可购买。
- GSC、Bing、GA4、Pinterest 的逐路径只读导出尚未取得；无证据 URL 保持 `keep/待确认`，不得重定向到首页。
- Node 24 下 Prisma 生成与客户端解析只在隔离诊断目录完成。主工作区 lockfile 安装已退出 0，但 `generate` 124 秒超时并遗留本轮子进程；该 PID 已定向终止，客户端仍不可解析。完整单测、lint、clean build 尚未运行，不能称构建通过。Node 22 A/B 因官方运行时下载失败未完成，但现有证据不支持把 Node 24 认定为必然不兼容。
- 商品、支付、库存、定价与当前销售状态不在本行动变更范围。

## 关联

- [Maverenne 设计规格](../../docs/superpowers/specs/2026-07-26-maverenne-brand-repositioning-design.md)
- [三阶段迁移路线图](../../docs/superpowers/plans/2026-07-26-maverenne-migration-roadmap.md)
- [公司策略](../../docs/company/strategy.md)
- [本周优先级](../../docs/company/weekly-priorities.md)
- [公司决策日志](../../docs/company/decision-log.md)
- [名称与域名核验记录](../../docs/company/maverenne-name-clearance.md)
- [六页 SEO/GEO 一手来源证据包](../../docs/company/maverenne-seo-source-evidence.md)
- [Prisma 运行时兼容性跟进](../../docs/company/maverenne-build-runtime-compatibility-followup.md)
- [[../06-决策与复盘/关键决策/DEC-2026-07-26｜批准 Maverenne 品牌重定位设计]]
