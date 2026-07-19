# MythRealms 冷启动上线状态基线

**记录日期：** 2026-07-19

**执行计划：** `docs/superpowers/plans/2026-07-19-cold-start-next-stage.md`

**执行分支：** `codex/cold-start-next-stage`

## 状态定义

| 状态 | 定义 |
| --- | --- |
| 未开始 | 没有代码、资料或平台配置 |
| 代码完成 | 仓库内已有实现，但尚未在生产环境验证 |
| 待人工验证 | 需要登录外部平台或执行真实业务操作 |
| 已完成 | 已有测试结果、截图、事件记录、平台回执或其他可复查证据 |

## Git 基线

| 项目 | 状态 | 证据或说明 |
| --- | --- | --- |
| 当前分支 | 已完成 | `git branch --show-current` 返回 `codex/cold-start-next-stage` |
| 与远端关系 | 已完成 | `git rev-list --left-right --count origin/main...HEAD` 返回远端领先 0、本地领先 4 |
| 三份 2026-07-18 冷启动计划 | 代码完成 | 已中文化，当前为已修改但尚未提交状态 |
| 2026-07-19 下一阶段计划 | 代码完成 | 文件已创建，当前尚未提交 |
| 工作区隔离 | 待人工验证 | 已切换到专用分支，但工作区仍有大量用户的视频、Blender、缓存和临时资产；后续必须按文件精确暂存 |

## 本地测试基线

| 项目 | 状态 | 证据或说明 |
| --- | --- | --- |
| 完整单元测试 | 已完成 | 2026-07-19 运行 `npm run test:unit`，340 项通过，0 失败 |
| Lint | 已完成 | `npm run lint` 退出码为 0；0 错误、34 条既有警告 |
| 生产构建 | 已完成 | `npm run build` 成功；Next.js 16.2.6 完成编译、类型检查和 137 个静态页面生成 |
| 启动检查 | 待人工验证 | 本阶段尚未运行 `npm run launch:check`，且会依赖生产配置 |

测试输出中的邮件异常日志来自预期的失败场景测试；最终测试汇总仍为 340 项通过、0 失败。

## 技术就绪状态

| 能力 | 状态 | 本地证据 | 仍需验证 |
| --- | --- | --- | --- |
| Journal 可索引 | 代码完成 | `src/app/blog/page.tsx`、`src/app/blog/[slug]/page.tsx`、`tests/seo-catalog.test.ts` | 生产 `/blog` 抓取与索引状态 |
| Sitemap 包含商品和文章 | 代码完成 | `src/app/sitemap.ts`、`src/lib/seo/sitemap.ts`、`tests/seo-catalog.test.ts` | 生产 `/sitemap.xml` 返回和 Search Console 接收状态 |
| robots 规则 | 代码完成 | `src/app/robots.ts`、`tests/seo-catalog.test.ts` | 生产 `/robots.txt` 返回 |
| BlogPosting 结构化数据 | 代码完成 | `src/components/ui/JsonLd.tsx`、`src/app/blog/[slug]/page.tsx`、`tests/seo-catalog.test.ts` | Google 富媒体结果测试 |
| 供应商图片优先 | 代码完成 | `src/lib/1688-products.ts`、`tests/storefront-catalog.test.ts` | 四款商品逐图人工核对 |
| AI editorial 图片披露 | 代码完成 | `src/app/products/[slug]/1688-product.tsx`、`tests/storefront-trust.test.ts` | 生产移动端文案可见性 |
| Cookie 同意状态实时响应 | 代码完成 | `src/lib/analytics/consent.ts`、`src/components/layout/CookieConsent.tsx`、`tests/analytics-consent.test.ts` | 生产浏览器接受、拒绝和撤回流程 |
| `view_item` | 代码完成 | `src/lib/tracking.ts`、`src/app/products/[slug]/1688-product.tsx`、`tests/analytics-tracking.test.ts` | GA4、Meta、Pinterest 后台事件 |
| `add_to_cart` | 代码完成 | `src/lib/cart.ts`、`src/lib/tracking.ts`、`tests/analytics-tracking.test.ts` | 生产事件值和商品 ID |
| `begin_checkout` | 代码完成 | `src/app/checkout/page.tsx`、`src/lib/tracking.ts`、`tests/analytics-tracking.test.ts` | 生产事件值和购物车商品 |
| `purchase` 与去重 | 代码完成 | `src/app/checkout/success/tracker.tsx`、`src/lib/tracking.ts`、`tests/analytics-tracking.test.ts` | 经用户授权的真实低价支付、刷新去重和退款 |
| 测量操作手册 | 代码完成 | `docs/operations/cold-start-measurement-runbook.md` | 按手册完成一次生产验收并保存记录 |
| Analytics 环境变量说明 | 代码完成 | `.env.example` 中的 `NEXT_PUBLIC_GA_ID`、`NEXT_PUBLIC_META_PIXEL_ID`、`NEXT_PUBLIC_PINTEREST_TAG_ID` | Vercel Production 中的真实值 |
| 定时任务配置 | 代码完成 | `vercel.json` 中 `/api/cron/daily` | Vercel 中 `CRON_SECRET` 和最近一次成功运行记录 |

## 平台与渠道状态

| 平台 | 状态 | 已有证据 | 下一项人工验证 |
| --- | --- | --- | --- |
| Vercel Production | 代码完成 | 2026-07-19 控制台显示 Production 为 `Ready`，来源为 `main` 的 `86961c9` | 当前分支新提交尚未部署；仍需核对环境变量和 Cron |
| 临时生产域名 | 代码完成 | Vercel 控制台列出 `mythrealms-shop.vercel.app`，项目状态为 `Ready` | 使用美国网络完成页面与漏斗人工验收 |
| 自定义品牌域名 | 未开始 | 用户持有 `jasperkit.com`，但已确认不接入 MythRealms，以免品牌名称不一致 | 冷启动验证后再选择与 MythRealms 一致的域名 |
| GA4 | 待人工验证 | 代码支持 GA4 且 `.env.example` 有变量说明 | 确认 Web 数据流、Production ID、DebugView 与美国会话 |
| Meta Pixel | 待人工验证 | 代码支持 Meta Pixel | 确认 Pixel ID 和 Test Events |
| Pinterest Tag | 待人工验证 | 代码支持 Pinterest Tag | 确认 Tag ID 和事件诊断 |
| Google Search Console | 待人工验证 | Sitemap 和 robots 代码已存在 | 验证域名、提交 Sitemap、检查代表性 URL |
| Google Merchant Center | 未开始 | 仓库存在 Google 商品 Feed 路由 | 完成履约核实后再验证商家和提交 Feed |
| TikTok | 待人工验证 | 已知账号已有 3 条视频，但仓库没有后台指标证据 | 记录粉丝、播放、互动、主页访问和链接点击基线 |
| Instagram | 待人工验证 | 已有渠道配置计划 | 确认账号资料、主页链接和 Reels 复用设置 |
| Pinterest 内容渠道 | 待人工验证 | 已有渠道配置计划和内容辅助代码 | 确认账号资料、Board、主页链接和 Pin 发布流程 |

TikTok 当前“3 条视频”的信息来自用户陈述，不作为播放量或转化完成证据；具体指标必须从平台后台记录。

## 内容生产状态

| 项目 | 状态 | 本地证据 | 仍需完成 |
| --- | --- | --- | --- |
| Violet Rain 镜头包 | 代码完成 | `SHOT_VIOLET_RAIN_COLD_START_001` 含 4 张首帧、`template.json`、`Thumbnail.png` | 产品事实、授权、视频生成和发布审核 |
| Moon Disc 镜头包 | 代码完成 | `SHOT_MOON_DISC_COLD_START_001` 含 4 张首帧、`template.json`、`Thumbnail.png` | 产品事实、授权、视频生成和发布审核 |
| Turquoise Leaf 镜头包 | 代码完成 | `SHOT_TURQUOISE_LEAF_COLD_START_001` 含 4 张首帧、`template.json`、`Thumbnail.png` | 产品事实、授权、视频生成和发布审核 |
| Falling Pearl 镜头包 | 代码完成 | `SHOT_FALLING_PEARL_COLD_START_001` 含 4 张首帧、`template.json`、`Thumbnail.png` | 产品事实、授权、视频生成和发布审核 |
| 首个 14 天发布表 | 代码完成 | `docs/superpowers/plans/2026-07-18-cold-start-content-operations.md` | 七条首周队列、排期、发布和数据记录 |
| 90 天运营规则 | 代码完成 | 同一内容运营计划包含阶段目标、漏斗规则和预算门槛 | 按周执行并记录保留、迭代、停止决策 |
| 首周内容队列与日志 | 待人工验证 | `video-pipeline/work/2026-07-19-us-cold-start-week-01/content-queue.md`、`docs/operations/cold-start-content-log.md`；用户于 2026-07-19 确认第 1 条已发布 | 回填帖子链接、实际发布时间、音频、AI 标签及 2 小时／24 小时数据；继续制作第 2 条 |

## 人工阻塞项

以下信息无法从仓库可靠得出，未完成前不能把对应任务标记为完成：

1. 四款产品的 1688 原始商品链接、供应商名称、采购价、单件重量和包装尺寸。
2. 供应商允许在独立站和社交媒体使用图片的明确授权。
3. 供应商国内发货时效、缺货处理和退换货限制。
4. 至少三家集运或跨境代发服务商的真实报价和异常赔付规则。
5. Vercel Production 中的 `CRON_SECRET` 和 Analytics 环境变量。
6. GA4、Meta、Pinterest、Search Console 和 Merchant Center 后台状态。
7. 经用户单独授权的真实支付、购买事件去重和退款验证。
8. TikTok、Instagram 和 Pinterest 的真实账号指标与主页配置。

## 当前结论

- 仓库的技术基础明显领先于三份计划中的未勾选状态，但大部分能力只能标记为“代码完成”，不能等同于“生产已完成”。
- 当前最大业务阻塞不是继续扩充站点功能，而是产品事实、图片授权、美国履约报价和生产事件验证。
- 四款镜头包具备进入视频生产的结构基础，但必须先通过产品事实和履约门槛。
- 四份产品事实包已建立；Violet Rain、Moon Disc 和 Falling Pearl 的本地图库结构基本一致，仍等待供应商信息。
- Turquoise Leaf 图库混入至少两种结构版本，当前暂停发布和视频生成，直至供应商确认实际发货版本。
- 本地单元测试、Lint 和生产构建已经通过；`launch:check` 与生产事件验证仍等待单独授权和平台配置。
- Vercel 控制台显示线上部署可用，但生产仍停留在 `86961c9`；本阶段提交尚未推送或部署。
- 冷启动流量测试统一使用 `https://mythrealms-shop.vercel.app`；`jasperkit.com` 暂不接入，正式品牌域名确定前不投入域名型 SEO 迁移工作。

## 下一动作

执行首周三款产品内容队列，并完成 Vercel 生产页面、GA4 前三个漏斗事件和社媒链接的人工验证。供应商完整事实核验按用户决定延期，但真实接单前仍需最低限度确认可售款式、采购价、国内发货与跨境履约线路。
